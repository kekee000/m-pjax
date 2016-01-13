/**
 * @file 抽象基类
 * @author  treelite(c.xinle@gmail.com),
 *          mengke01(kekee000@gmail.com)
 */

define(function (require) {

    /**
     * 绑定事件
     * @param {Object} abs Abstract对象
     * @inner
     */
    function bindEvents(abs) {
        var events = abs.events || {};

        var fn;
        Object.keys(events).forEach(function (name) {
            fn = events[name];
            // 没有':'表示abs事件
            if (name.indexOf(':') < 0) {
                abs.on(name, fn);
            }
            // 有':'表示绑定组件事件(view或者model的事件)
            // e.g: view:add
            else {
                var items = name.split(':');
                var item = items[0].trim();

                name = items[1] && items[1].trim();
                if (item && abs[item] && name) {
                    abs[item].on(name, $.proxy(fn, abs));
                }
            }
        });
    }

    /**
     * Abstract
     *
     * @constructor
     * @param {Object} options 配置参数
     * @param {Object} options.events 事件配置
     */
    function Abstract(options) {
        options = options || {};
        $.extend(this, options);
    }

    /**
     * 初始化
     *
     * @public
     */
    Abstract.prototype.init = function () {
        bindEvents(this);
    };

    /**
     * 销毁
     *
     * @public
     */
    Abstract.prototype.dispose = function () {
        this.events = null;
        this.un();
    };

    require('../observable').mixin(Abstract.prototype);

    return Abstract;
});
