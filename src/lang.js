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
        }
    };

    return lang;
});
