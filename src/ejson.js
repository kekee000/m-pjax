/**
 * @file ejson 模块
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {


    var ejsonError = {
        DATA: -1, // json解析错误
        ABORT: -2, // 请求 abort
        TIMEOUT: -3,  // 请求超时
        ERROR: -500 // 未知错误
    };


    var exports = {

        get: function (url, data) {
            var options = {
                url: url,
                method: 'GET',
                dataType: 'json',
                data: data
            };
            return request(options);
        },

        post: function (url, data) {
            var options = {
                url: url,
                method: 'POST',
                dataType: 'json',
                data: data
            };
            return request(options);
        },

        request: request,

        ERROR: ejsonError
    };

    /**
     * 发送ajax请求
     *
     * @param  {Object} options pajx参数
     * @param  {string} options.url 请求url
     * @param  {Object=} options.data 请求数据
     * @param  {method=} options.method 发送方式，post or get
     * @param  {number=} options.timeout 超时时间
     * @return {promise}
     */
    function request(options) {
        exports.fire('ajax:before', {
            options: options
        });

        /* eslint-disable new-cap*/
        var deferred = $.Deferred();
        /* eslint-enable new-cap*/
        var xhr = $.ajax(options).done(function (data) {
            xhr = null;
            if (data && data.status === 0) {
                exports.fire('ajax:success', {
                    options: options,
                    data: data.data
                });

                deferred.resolve(data.data);
            }
            else {
                exports.fire('ajax:error', {
                    options: options,
                    data: data
                });

                data = data || {};
                data.status = data.status || ejsonError.DATA;
                deferred.reject(data);
            }
        }).fail(function (data) {
            xhr = null;
            deferred.reject({
                status: data.status === 200 ? ejsonError.DATA : ejsonError.ERROR,
                statusInfo: data
            });
        });

        deferred.abort = function () {
            xhr && xhr.abort();
        };

        return deferred;
    }

    return require('./observable').mixin(exports);
});
