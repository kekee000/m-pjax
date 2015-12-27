/**
 * @file 视窗控制器
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var viewport = {

        init: function (main, options) {
            this.main = main;
        },

        load: function (url, options) {
            this.main.html(options.html || '');
        }
    };

    return viewport;
});
