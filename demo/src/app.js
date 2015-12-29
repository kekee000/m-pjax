/**
 * @file app
 * @author mk(kekee)
 */

define(function (require) {

    var app = require('m-pjax');
    // 加载路由配置
    app.load(require('./config'));

    app.on('beforeload', function (e) {
        console.log(e);
    }).on('afterload', function (e) {
        console.log(e);
    }).on('beforepjax', function (e) {
        console.log(e);
    }).on('afterpjax', function (e) {
        console.log(e);
    })
    // 进入action操作，此处可以绑定action的数据
    .on('enteraction', function (e) {
        console.log(e);
        e.action.model.data = window.ACTION_DATA;
        delete window.ACTION_DATA;
    });


    // 启动应用
    app.start('#viewport', {
        root: '/demo'
    });
});
