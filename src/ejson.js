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
                dataType: "json",
                data: data
            };
            return request(options);
        },

        post: function (url, data) {
            var options = {
                url: url,
                method: 'POST',
                dataType: "json",
                data: data
            };
            return request(options);
        },

        request: request,

        ERROR: ejsonError
    };

    function successHandler(data) {
        if (data.status === 0) {
            exports.fire('ajax:success', {
                data: data.data
            });

            deferred.resolve(data.data);
        }
        else {
            exports.fire('ajax:error', {
                data: data
            });
            deferred.reject(data);
        }
    }

    function errorHandler(data) {
        deferred.reject({
            status: ejsonError.ERROR,
            statusInfo: data
        });
    }

    function request(options) {
        exports.fire('ajax:before', {
            options: options
        });

        var deferred = $.Deferred();
        $.ajax(options).done(successHandler).fail(errorHandler);
        return deferred.promise();
    }

    return exports;
});
