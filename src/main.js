/**
 * @file pjax框架入口
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var router = require('./router');
    var viewport = require('./viewport');
    var pjax = require('./pjax');
    var Action = require('./mvc/Action');
    var cachedAction = {};
    var current = {};

    /**
     * 根据action配置创建action
     * 规则如下：
     * 如果配置带有constructor则为自己mod的action直接创建
     * 否则用默认的constructor创建
     *
     * @param  {Object} actionOptions action配置
     * @return {Action}
     */
    function createAction(actionOptions) {
        var Constructor;
        if (actionOptions && actionOptions.constructor !== Object) {
            Constructor = actionOptions.constructor;
        }
        else {
            Constructor = Action;
        }

        return new Constructor(actionOptions);
    }

    /**
     * 加载pjax页面
     *
     * @param  {Object} config 配置
     * @param  {string} config.url 请求地址
     * @param  {Object=} config.data 请求参数
     * @return {promise}
     */
    function loadPjax(config) {
        return pjax.request({
            url: config.url
        });
    }


    /**
     * 发送框架action事件
     *
     * @param  {string} name   名称
     * @param  {Action} action action
     * @param  {route} route  路由配置
     */
    function fireActionEvent(name, action, route) {
        exports.fire(name, {
            action: action,
            route: route
        });
    }


    /**
     * 加载action页面
     * 规则如下：
     * 如果配置了缓存的action则直接唤醒action
     * 否则根据配置加载action，如果action为字符串则加载action脚本，否则
     *
     * @param  {Object} config route配置参数
     * @return {promise}
     */
    function loadAction(config) {

        var deferred = $.Deferred();
        var action;

        // 如果当前aciton被缓存的话，获取缓存的action
        // 会受到options.noCache的影响
        if (config.cached) {
            action = cachedAction[config.path];
            if (action && config.options.noCache) {
                action.dispose();
                fireActionEvent('leaveaction', action, config);
                delete cachedAction[config.path];
                action = null;
            }
        }

        if (!action) {
            var enterAction = function (actionOptions) {
                action = createAction(actionOptions);
                fireActionEvent('enteraction', action, config);

                // 这里设置action的config为route中配置的config
                if (null != config.config) {
                    action.config = config.config;
                }

                action.enter(config.path, config.query, config.options, viewport.current);
                action.ready();
                if (config.cached) {
                    cachedAction[config.path] = action;
                }

                deferred.resolve(action);
            };

            if (!config.action) {
                enterAction();
            }
            else if (typeof config.action === 'string') {
                require([config.action], enterAction);
            }
            else {
                enterAction(config.action);
            }
        }
        else {
            action.wakeup(config.path, config.query, config.options);
            deferred.resolve(action);
        }

        return deferred;
    }

    function tryLoadAction(config, finishLoad) {
        // action 加载满足以下条件
        // 首屏：不需要加载pjax，直接加载action
        // 第二屏：
        // 如果当前的action未加载，则加载并初始化action
        // 如果当前的action已加载，并且path同当前的action一致，仅query变化，则调用action的refresh
        //     如果path同当前的action不一致，则注销当前action，加载path指定的action
        //     如果当前action被缓存，则调用wakeup方法唤醒

        var finishLoadAction = function (action) {
            if (current.action && !current.config.cached) {
                current.action.dispose();
                fireActionEvent('leaveaction', current.action, current.config);
            }

            current.action = action;
            current.config = config;
            fireActionEvent('afterload', action, config);
            finishLoad();
        }

        var errorLoadAction = function () {
            fireActionEvent('errorload', null, config);
            finishLoad();
        }


        fireActionEvent('beforeload', current.action, current.config);

        // 首屏加载
        if (!current.action) {
            loadAction(config).then(finishLoadAction, errorLoadAction);
        }
        else {
            if (config.path === current.config.path && !config.options.force) {
                current.action.refresh(config.path, config.query, config.options);
                current.config = config;
                finishLoad();
                return;
            }

            // 处理当前正在工作的Action
            // 如果action的sleep返回false阻止离开则停止加载action
            if (current.action) {
                if (current.config.cached && !current.action.sleep()) {
                    return;
                }
            }

            // action 不加载pjax的情况:
            // 配置的pjax不等于空
            // action配置缓存，并且没有强制刷新
            if (false === config.pjax || (config.cached && cachedAction[config.path]) && !config.options.noCache) {
                loadAction(config).then(finishLoadAction, errorLoadAction);
                return;
            }

            // 如果pjax加载出错，则保留当前的action可用
            // 如果action加载出错，则没办法，页面挂掉

            exports.fire('beforepjax', {
                config: config
            });
            loadPjax(config).then(function (html) {
                exports.fire('afterpjax', {
                    config: config
                });
                viewport.load(config.url, {
                    html: html
                });
                loadAction(config).then(finishLoadAction, errorLoadAction);
            }, errorLoadAction);
        }
    }


    /**
     * 路由导向
     *
     * @inner
     * @param {option} route 路由配置
     * @return {Function}
     */
    function routeTo(route) {
        return function (path, query, params, url, options, done) {
            // 设置当前的路由信息
            var config = $.extend({}, route);
            config.path = path;
            config.query = query;
            config.options = options;
            config.url = url;

            // 尝试加载Action
            tryLoadAction(config, done);
        };
    }


    var exports = {
        routes: []
    };

    /**
     * 加载路由配置信息
     *
     * @public
     * @param {Object} paths 路由配置
     * @return {this}
     */
    exports.load = function (paths) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        this.routes = this.routes.concat(paths);
        return this;
    };

    /**
     * 启动框架
     *
     * @public
     * @param {HTMLElement} main 主元素
     * @param {Object} options 全局配置信息 完整配置参考`./config.js`
     * @return {this}
     */
    exports.start = function (main, options) {

        // 扩展全局配置信息
        var config = $.extend({}, require('./config'), options);

        // 初始化viewport
        viewport.init($(main), config.viewport);

        // 添加路由
        this.routes.forEach(function (item) {
            router.add(item.path, routeTo(item));
        });

        router.config({
            path: config.path,
            index: config.index,
            root: config.root
        });

        // 启动路由
        router.start();
        delete this.routes;
        return this;
    };

    /**
     * 停止App
     * For Test
     *
     * @public
     */
    exports.stop = function () {
        router.stop();
        router.clear();
    };

    return require('./observable').mixin(exports);
});
