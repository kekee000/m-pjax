/**
 * @file Action
 * @author  treelite(c.xinle@gmail.com),
 *          mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var inherits = require('../lang').inherits;
    var Abstract = require('./Abstract');
    var View = require('./View');
    var Model = require('./Model');

    /**
     * Action
     *
     * @constructor
     * @param {Object} options 配置参数
     * @param {Object} options.view view配置项
     * @param {Object} options.model model配置项
     * @param {Object=} options.events 事件
     */
    function Action(options) {
        Abstract.call(this, options);
        this.init();
        this.fire('init');
    }

    inherits(Action, Abstract);

    /**
     * 初始化
     *
     * @public
     */
    Action.prototype.init = function () {
        var Constructor;

        if (this.view && this.view.constructor !== Object) {
            Constructor = this.view.constructor;
        }
        else {
            Constructor = View;
        }
        this.view = new Constructor(this.view);

        if (this.model && this.model.constructor !== Object) {
            Constructor = this.model.constructor;
        }
        else {
            Constructor = Model;
        }
        this.model = new Constructor(this.model);

        this.view.action = this;
        this.view.model = this.model;

        Abstract.prototype.init.call(this);
    };


    /**
     * 加载页面
     *
     * 页面入口
     * 完成数据请求，页面渲染
     *
     * @public
     * @param {string} url 当前的访问地址
     * @param {Object} query 查询条件
     * @param {Object} options 跳转参数
     * @param {HTMLElement} main 视图容器
     */
    Action.prototype.enter = function (url, query, options, main) {
        this.url = url;
        this.query = $.extend({}, query);
        this.options = $.extend({}, options);

        this.view.setMain(main);
        this.fire('enter');
        this.view.enter();
    };

    /**
     * 重新加载页面，url未改变，仅query改变的情况
     *
     * @public
     * @param {string} url 当前的访问地址
     * @param {Object} query 查询条件
     * @param {Object} options 跳转参数
     */
    Action.prototype.refresh = function (url, query, options) {
        this.url = url;
        this.query = $.extend({}, query);
        this.fire('refresh');
        this.view.refresh();
    };

    /**
     * 唤醒页面
     *
     * @public
     * @param {string} url 当前的访问地址
     * @param {Object} query 查询条件
     * @param {Object} options 跳转参数
     */
    Action.prototype.wakeup = function (url, query, options) {
        this.url = url;
        this.query = $.extend({}, query);
        this.options = $.extend({}, options);

        this.fire('wakeup');
        this.view.wakeup();
    };

    /**
     * 页面就绪
     * 完成页面渲染转场后触发
     * 进行事件注册
     *
     * @public
     */
    Action.prototype.ready = function () {
        this.fire('ready');
        this.view.ready();
    };

    /**
     * 页面跳转
     *
     * @public
     */
    Action.prototype.redirect = function () {
        require('../router').redirect(arguments[0], arguments[1], arguments[2]);
    };

    /**
     * 页面休眠
     *
     * @public
     * @return {boolean} 是否能休眠页面
     */
    Action.prototype.sleep = function () {
        var event = {};
        this.fire('sleep', event);

        if (event.returnValue !== false) {
            this.view.sleep();
            return true;
        }
        return false;
    };

    /**
     * 页面卸载
     *
     * @public
     */
    Action.prototype.dispose = function () {
        this.un();
        this.view.dispose();
        this.model.dispose();
        this.events = this.view = this.model = null;
    };

    return Action;
});
