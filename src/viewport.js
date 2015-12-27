/**
 * @file 视窗控制器
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var viewport = {

        init: function (main, options) {
            options = options || {};
            this.main = main;
            this.className = options.className || 'pjax-view';
            var firstChild = this.main.children()[0];
            this.current = firstChild ? $(firstChild) : null;
        },

        load: function (url, options) {
            var html = '<div class="' + this.className + '">'
                + (options.html || '')
                + '</div>';
            this.current = $(html).appendTo(this.main);
            return this.current;
        }
    };

    return viewport;
});
