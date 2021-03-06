/**
 * @file popstate控制器
 * @author treelite(c.xinle@gmail.com),
 *         mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var URL = require('../URL');
    var path = require('../util/path');
    var globalConfig;
    var applyHandler;
    var curLocation;

    var SUPPORT_STATE = !!(history.pushState && history.replaceState);

    var exports = {};

    /**
     * url忽略root
     *
     * @inner
     * @param {string} url url
     * @return {string}
     */
    function ignoreRoot(url) {
        var root = globalConfig.root;
        if (root && url.indexOf(root) === 0) {
            url = url.replace(root, '');
        }

        return url;
    }

    /**
     * 调用路由处理器
     *
     * @inner
     * @param {URL} url URL对象
     * @param {Object} options 参数
     */
    function callHandler(url, options) {
        if (curLocation && url.equalWithQuery(curLocation) && !options.force) {
            return;
        }

        applyHandler(ignoreRoot(url.path), url, options);
        curLocation = url;
    }

    /**
     * 判断url是否超出路由控制
     *
     * @param  {string}  url url
     * @return {boolean}
     */
    function isOutOfRoot(url) {
        var root = globalConfig.root;
        if (root) {
            return url.indexOf(root) !== 0;
        }

        return url.indexOf('/') !== 0;
    }

    /**
     * URL超出控制范围
     *
     * @inner
     * @param {string} url url地址
     * @param {boolean} silent 是否不添加历史纪录 默认为false
     */
    function redirectOut(url, silent) {
        exports.dispose();
        if (silent) {
            location.replace(url);
        }
        else {
            location.href = url;
        }
    }

    /**
     * 根据路径和query创建url
     *
     * @inner
     * @param {string=} url url字符串
     * @param {Object=} query 查询条件
     * @return {URL}
     */
    function createURL(url, query) {
        if (query) {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + URL.stringifyQuery(query);
        }
        return location.protocol + '//' + location.host + url;
    }

    /**
     * 路由监控
     *
     * @inner
     * @param {Object=} e 事件参数
     * @return {*}
     */
    function monitor(e) {
        e = e || {};

        if (isOutOfRoot(location.pathname)) {
            return redirectOut(location.href, true);
        }

        var url = new URL(location.href);
        callHandler(url, e.state || {});
    }

    /**
     * 进行路由跳转
     *
     * @param  {URL} url     url对象
     * @param  {Object=} options 参数
     */
    function redirect(url, options) {
        options = options || {};
        if (!curLocation.equal(url) && !options.silent) {
            history.pushState(options, options.title, url);
        }
        callHandler(url, options);
    }

    /**
     * 获取元素的本页跳转地址
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     * @return {!string}
     */
    function getLink(ele) {
        var target = ele.getAttribute('target');
        var href = ele.href;

        if (!href || (target && target !== '_self')) {
            return;
        }

        var url = new URL(href);
        // 判断是否在控制范围内
        if (!url.equalOrigin(curLocation) || isOutOfRoot(url.path)) {
            return;
        }

        return url;
    }

    /**
     * 劫持全局的click事件
     *
     * @inner
     * @param {Event} e 事件参数
     */
    function hackClick(e) {
        var target = e.target;
        // 先上寻找A标签
        if (e.path) {
            for (var i = 0, item; item = e.path[i]; i++) {
                if (item.tagName === 'A') {
                    target = item;
                    break;
                }
            }
        }
        else {
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
            }
        }

        if (!target) {
            return;
        }

        var href = getLink(target);
        if (href) {
            e.preventDefault();
            var options;
            var redirectType;
            if (redirectType = target.getAttribute('data-redirect')) {
                options = {};
                options[redirectType] = 1;
            }
            redirect(href, options);
        }
    }

    /**
     * 初始化
     *
     * @public
     * @param {Object} config 路由配置信息
     * @param {Function} fn 调用路由处理器
     */
    exports.init = function (config, fn) {

        // 使用默认配置的情况
        if (typeof config === 'function') {
            fn = config;
            config = {};
        }

        applyHandler = fn;
        globalConfig = config;

        // 判断初始化时候是否超出控制范围，超出了则报异常
        if (isOutOfRoot(location.pathname)) {
            throw new Error('current path out of root');
        }

        if (SUPPORT_STATE) {
            window.addEventListener('popstate', monitor, false);
            document.body.addEventListener('click', hackClick, false);
        }

        monitor();
    };

    /**
     * 路由跳转
     *
     * @public
     * @param {string} url 路径
     * @param {Object=} query 查询条件
     * @param {Object=} options 跳转参数
     * @param {boolean=} options.force 是否强制跳转
     * @param {boolean=} options.silent 是否静默跳转（不改变URL）
     * @return {*}
     */
    exports.redirect = function (url, query, options) {
        url = path.resolve(curLocation.path, url || '');
        if (isOutOfRoot(url) || !SUPPORT_STATE) {
            return redirectOut(createURL(url, query));
        }

        redirect(new URL(createURL(url, query)), options);
    };

    /**
     * 重置当前的URL
     *
     * @public
     * @param {string} url 路径
     * @param {Object=} query 查询条件
     * @param {Object=} options 重置参数
     * @param {boolean=} options.silent 是否静默重置，静默重置只重置URL，不加载action
     * @return {*}
     */
    exports.reset = function (url, query, options) {
        options = options || {};

        url = path.resolve(curLocation.path, url);
        if (isOutOfRoot(url) || !SUPPORT_STATE) {
            return redirectOut(createURL(url, query));
        }

        url = new URL(createURL(url, query));
        if (!options.silent) {
            callHandler(url, options);
        }
        else {
            curLocation = url;
        }

        history.replaceState(options, options.title, url);
    };

    /**
     * 销毁
     *
     * @public
     */
    exports.dispose = function () {
        window.removeEventListener('popstate', monitor, false);
        document.body.removeEventListener('click', hackClick, false);
        curLocation = null;
    };

    return exports;

});
