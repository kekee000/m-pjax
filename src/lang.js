/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var lang = {

        /**
         * 为函数提前绑定前置参数（柯里化）
         *
         * @see http://en.wikipedia.org/wiki/Currying
         * @param {Function} fn 要绑定的函数
         * @param {...*} args 函数执行时附加到执行时函数前面的参数
         * @return {Function}
         */
        curry: function (fn) {
            var args = [];
            for (var i = 1, l = arguments.length; i < l; i++) {
                args.push(arguments[i]);
            }

            return function () {
                var xargs = args.slice(0);
                for (var i = 0, l = arguments.length; i < l; i++) {
                    xargs.push(arguments[i]);
                }
                return fn.apply(this, xargs);
            };
        },

        /**
         * 为函数绑定this与前置参数
         *
         * @param {Function} fn 需要操作的函数
         * @param {Object} thisArg 需要绑定的this
         * @return {Function}
         */
        bind: function (fn, thisArg) {
            return $.proxy(fn, thisArg);
        },

        /**
         * 对象属性拷贝
         *
         * @param {Object} target 目标对象
         * @param {...Object} source 源对象
         * @return {Object}
         */
        extend: function (target, source) {
            return $.extend.apply($, arguments);
        },

        /**
         * 为类型构造器建立继承关系
         *
         * @param {Function} subClass 子类构造器
         * @param {Function} superClass 父类构造器
         * @return {Function}
         */
        inherits: function (subClass, superClass) {
            var Fn = function () {};
            Fn.prototype = superClass.prototype;
            var proto = new Fn();

            Object.keys(subClass.prototype).forEach(function (key) {
                proto[key] = subClass.prototype[key];
            });

            proto.constructor = subClass;
            subClass.prototype = proto;
            return subClass;
        },

        /**
         *
         * Returns a function, that, when invoked, will only be triggered at most once
         * during a given window of time.
         * copy from underscore.js
         *
         * @param  {Function} func 节流函数
         * @param  {number} wait 节流间隔时间
         * @return {Function} 包裹后函数
         */
        throttle: function (func, wait) {
            var context;
            var args;
            var timeout;
            var result;
            var previous = 0;
            var later = function () {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
                var now = new Date();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                }
                else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },

        /**
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered. The function will be called after it stops being called for
         * N milliseconds. If `immediate` is passed, trigger the function on the
         * leading edge, instead of the trailing.
         * during a given window of time.
         * copy from underscore.js
         *
         * @param  {Function} func 去颤动函数
         * @param  {number} wait 去颤动间隔时间
         * @param  {boolean} immediate 是否立即调用debounce函数
         * @return {Function}    包裹后函数
         */
        debounce: function (func, wait, immediate) {
            var timeout;
            var result;
            return function () {
                var context = this;
                var args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        }
    };

    return lang;
});
