/**
 * @file URL解析模块
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var parseUrl = require('./uri-parser');
    var DefaultURL = window.URL || window.webkitURL;


    function createURL(url) {
        if (typeof url === 'string' || url instanceof String) {
            url = new URL(url);
        }
        return url;
    }

    function URL(url) {
        var data;
        if (DefaultURL) {
            var u = new DefaultURL(url);
            data = {
                scheme: u.protocol.slice(0, u.protocol.length - 1),
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

    URL.prototype.equalWithQuery = function (url) {
        url = createURL(url);
        return this.equalOrigin(url)
            && this.path === url.path
            && this.query === url.query;
    };

    URL.prototype.equalWithFragment = function (url) {
        url = createURL(url);
        return this.equalWithQuery(url)
            && this.fragment === url.fragment;
    };

    URL.prototype.getQuery = function () {
        return URL.parseQuery(this.query);
    };

    URL.prototype.toString = function () {
        return this.src;
    };

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

    URL.stringifyQuery = function (query) {
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
