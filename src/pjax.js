/**
 * @file pjax控制程序
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var defaultOptions = {
        timeout: 10000,
        dataType: 'html',
        beforeSend: function (xhr) {
            xhr && xhr.setRequestHeader('X-PJAX', true);
        }
    };

    var defaultData = {
        pjax: 1
    };

    var pjax = {

        get: function (url, data) {
            var options = {
                url: url,
                method: 'GET',
                data: data
            };
            return request(options);
        },

        request: request
    };

    /**
     * 发送pajx请求
     *
     * @param  {Object} options pajx参数
     * @param  {string} options.url 请求url
     * @param  {Object=} options.data 请求数据
     * @param  {method=} options.method 发送方式，post or get
     * @param  {number=} options.timeout 超时时间
     * @return {promise}
     */
    function request(options) {
        options = $.extend({}, defaultOptions, options);
        options.data = $.extend({}, defaultData, options.data);

        pjax.fire('pjax:before', {
            options: options
        });

        var promise = $.ajax(options);
        promise.then(function (data) {
            pjax.fire('pjax:success', {
                options: options,
                data: data
            });
        }, function (data) {
            pjax.fire('pjax:error', {
                options: options,
                data: data
            });
        });
        return promise;
    }

    return require('./observable').mixin(pjax);
});
