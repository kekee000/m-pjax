/**
 * @file View
 * @author  treelite(c.xinle@gmail.com),
 *          mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var inherits = require('../lang').inherits;
    var Abstract = require('./Abstract');

    /**
     * 绑定DOM事件
     *
     * @inner
     * @param {View} view
     */
    function bindDomEvents(view) {
        var type;
        var selector;
        var fn;
        if (view.domEvents) {
            Object.keys(view.domEvents).forEach(function (name) {
                fn = $.proxy(view.domEvents[name], view);
                name = name.split(':');
                type = name[0].trim();
                selector = name[1] ? name[1].trim() : undefined;
                view.addEvent(type, selector, fn);
            });
            delete view.domEvents;
        }
    }

    /**
     * View
     *
     * @constructor
     * @param {Object} options 配置信息
     * @param {string=} options.className 容器元素附加className
     * @param {Object=} events view事件
     * @param {Object=} domEvents DOM事件
     */
    function View(options) {
        options = options || {};
        Abstract.call(this, options);
        this.init();
    }

    inherits(View, Abstract);

    /**
     * 设置容器元素
     *
     * @public
     * @param {HTMLElement} 视图容器元素
     */
    View.prototype.setMain = function (ele) {
        this.main = $(ele);
    };

    /**
     * 渲染视图
     *
     * @public
     * @param {Object} data
     */
    View.prototype.enter = function () {
        if (!this.main) {
            return;
        }

        if (this.className) {
            this.main.addClass(this.className);
        }
    };

    /**
     * 视图就绪
     * 主要进行事件绑定
     *
     * @public
     */
    View.prototype.ready = function () {
        bindDomEvents(this);
        this.fire('ready');
    };

    /**
     * 重新加载页面
     *
     * @public
     */
    View.prototype.refresh = function () {
        this.fire('refresh');
    };

    /**
     * 选取视图中的DOM元素
     *
     * @public
     * @param {string} selector 选择器
     * @param {HTMLElement=} context 上下文
     * @return {zepto}
     */
    View.prototype.find = function (selector, context) {
        return (context ? $(context) : this.main).find(selector);
    };

    /**
     * 绑定DOM事件
     * 会对进行绑定的DOM元素进行管理，方便自动卸载
     *
     * @public
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {function} fn 事件处理函数
     */
    View.prototype.addEvent = function (type, selector, fn) {
        this.main.on(type, selector, fn);
    };

    /**
     * Superseded by `removeDomEvent`
     *
     * 卸载DOM事件
     *
     * @public
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {function} fn 事件处理函数
     */
    View.prototype.removeEvent = function (type, selector, fn) {
        this.main.off(type, selector, fn);
    };

    /**
     * 视图销毁
     *
     * @public
     */
    View.prototype.dispose = function () {
        this.fire('dispose');
        // 解除相关控件的引用
        if (this.controls) {
            Object.keys(this.controls).forEach(function (name) {
                var ctl = this.controls[name];
                if (typeof ctl.dispose === 'function') {
                    ctl.dispose();
                }
            });
            this.controls = null;
        }

        this.un();

        // 解除事件绑定, 这里会把所有相关的事件都给解除
        this.main.off().remove();
        this.main = null;
    };

    /**
     * 视图休眠
     *
     * @public
     */
    View.prototype.sleep = function () {
        this.fire('sleep');
        this.main.hide();
    };

    /**
     * 视图唤醒
     *
     * @public
     */
    View.prototype.wakeup = function () {
        this.fire('wakeup');
        this.main.show();
    };

    return View;
});
