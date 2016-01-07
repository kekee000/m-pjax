/**
 * @file URL解析模块
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var parseUrl = require('./util/uri-parser');
    var DefaultURL = window.URL || window.webkitURL;

    /**
     * 根据字符串创建URL对象
     *
     * @param  {string|Object} url url字符串
     * @return {URL} URL对象
     */
    function createURL(url) {
        if (typeof url === 'string' || url instanceof String) {
            url = new URL(url);
        }
        return url;
    }


    /**
     * URL对象构造函数
     *
     * @constructor
     * @param {string} url url字符串
     */
    function URL(url) {
        var data;
        if (DefaultURL) {
            var u = new DefaultURL(url);
            data = {
                scheme: u.protocol.slice(0, -1),
                username: u.username,
                password: u.password,
                host: u.host,
                port: u.port,
                path: u.pathname,
                query: u.search.slice(1),
                fragment: u.hash.slice(1)
            };
        }
        else {
            data = parseUrl(url);
        }

        $.extend(this, data);
        this.src = url;
    }

    /**
     * 判断两个url是否相等
     *
     * @param  {string|URL} url url字符串或者对象
     * @return {boolean}
     */
    URL.prototype.equal = function (url) {
        if (this.src === url || this.src === url.src) {
            return true;
        }

        url = createURL(url);
        return this.scheme === url.scheme
            && this.username === url.username
            && this.password === url.password
            && this.host === url.host
            && this.port === url.port
            && this.path === url.path
            && this.query === url.query
            && this.fragment === url.fragment;
    };

    /**
     * 判断两个url是否同源
     *
     * @param  {string|URL} url url字符串或者对象
     * @return {boolean}
     */
    URL.prototype.equalOrigin = function (url) {
        if (this.src === url || this.src === url.src) {
            return true;
        }
        url = createURL(url);

        return  this.scheme === url.scheme
            && this.username === url.username
            && this.password === url.password
            && this.host === url.host
            && this.port === url.port;
    };

    /**
     * 判断两个url是否带Query相等
     *
     * @param  {string|URL} url url字符串或者对象
     * @return {boolean}
     */
    URL.prototype.equalWithQuery = function (url) {
        url = createURL(url);
        return this.equalOrigin(url)
            && this.path === url.path
            && this.query === url.query;
    };

    /**
     * 获取当前url的query对象
     *
     * @return {Object} query对象
     */
    URL.prototype.getQuery = function () {
        return URL.parseQuery(this.query);
    };

    /**
     * 获取url字符串
     *
     * @return {string}
     */
    URL.prototype.toString = function () {
        return this.src;
    };


    /**
     * 解析URL的querystring字符串
     *
     * @public
     * @param  {string} queryString query字符串
     * @return {Object} 解析后对象
     */
    URL.parseQuery = function (queryString) {
        var key;
        var value;
        var res = {};
        String(queryString).split('&').forEach(function (item) {
            if (!item) {
                return;
            }

            item = item.split('=');
            key = item[0];
            value = item.length >= 2 ? decodeURIComponent(item[1]) : '';

            if (res[key]) {
                if (!Array.isArray(res[key])) {
                    res[key] = [res[key]];
                }
                res[key].push(value);
            }
            else {
                res[key] = value;
            }
        });

        return res;
    };

    /**
     * URL的query对象转化为字符串
     *
     * @public
     * @param  {Object} query query对象
     * @return {string} querystring字符串
     */
    URL.stringifyQuery = function (query) {

        if (!query) {
            return '';
        }

        var str = [];
        var item;

        Object.keys(query).forEach(function (key) {
            item = query[key];

            if (!Array.isArray(item)) {
                item = [item];
            }

            item.forEach(function (value) {
                if (value === null) {
                    str.push(key);
                }
                else {
                    str.push(key + '=' + encodeURIComponent(value || ''));
                }
            });
        });
        return str.join('&');
    };

    return URL;
});
