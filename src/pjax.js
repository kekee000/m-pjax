/**
 * @file pjax控制程序
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var cache = require('./cache');

    var defaultOptions = {
        timeout: 4000,
        data: {
            pjax: 1
        },
        cached: false,
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

        // 默认使用sessionstorate进行cache
        if (options.cached) {
            var data = cache.session.get(options.url);
            if (data) {
                var deferred = $.Deferred();
                deferred.resolve(data);
                pjax.fire('pjax:success', {
                    cache: true,
                    data: data
                });
                return deferred;
            }
        }

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
