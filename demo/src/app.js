/**
 * @file app
 * @author mk(kekee)
 */

define(function (require) {

    var app = require('m-pjax');
    // 加载路由配置
    app.load(require('./config'));

    // 启动应用
    app.start('#viewport', {
        root: '/demo'
    });
});
