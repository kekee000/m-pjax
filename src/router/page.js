/**
 * @file 默认路由控制器 应对多页面
 * @author treelite(c.xinle@gmail.com),
 *         mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var URL = require('../URL');
    var path = require('../util/path');
    var exports = {};

    /**
     * 初始化
     *
     * @public
     * @param {Object} config 路由配置信息
     * @param {Function} applyHanlder 调用路由处理器
     */
    exports.init = function (config, applyHanlder) {
        var curLocation = new URL(location.href);
        var path = curLocation.path;
        if (config.root && path.indexOf(config.root) === 0) {
            path = path.replace(config.root, '');
        }

        applyHanlder(path, curLocation);
    };

    /**
     * 路由跳转
     *
     * @public
     * @param {string} url URL参数
     * @param {Object=} query 查询条件
     */
    exports.redirect = function (url, query) {
        var curLocation = new URL(location.href);
        url = path.resolve(curLocation.path, url || '');
        if (query) {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + URL.stringifyQuery(query);
        }

        location.href = url.toString();
    };

    /**
     * 销毁
     * 不需要处理
     *
     * @public
     */
    exports.dispose = function () {};

    /**
     * 重置URL
     * 不需要处理
     *
     * @public
     */
    exports.reset = function () {};

    return exports;

});
