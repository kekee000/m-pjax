/**
 * @file pjax控制程序
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var defaultOptions = {
        timeout: 4000,
        data: {
            pjax: 1
        },
        dataType: 'html',
        beforeSend: function(xhr) {
            xhr && xhr.setRequestHeader('X-PJAX', true);
        }
    };

    var pjax = {};

    function getRealUrl(url) {
        return url.indexOf('#') >= 0 ? url.slice(0, url.indexOf('#')) : url;
    }

    pjax.request = function (options) {
        options = $.extend({}, defaultOptions, options);
        options.url = getRealUrl(options.url);
        options.data = $.extend({}, defaultOptions.data, options.data);

        this.fire('pjax:before', {
            options: options
        });

        var promise = $.ajax(options);
        promise.then(function (data) {
            pjax.fire('pjax:success', {
                data: data
            });

            if (options.cache) {
                cache.session.set(options.url, data);
            }
        }, function (data) {
            pjax.fire('pjax:error', {
                data: data
            });
        });
        return promise;
    };

    return require('./observable').mixin(pjax);
});
