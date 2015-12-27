/**
 * @file index.js
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    function log(e) {
        console.log(this.url, e.type);
    }


    var config = {
        events: {
            'enter': log,
            'refresh': log,
            'wakeup': log,
            'sleep': log,
            'ready': log,
            'view:dispose': log,
            'view:sleep': log,
            'view:wakeup': log,
            'view:ready': log,
            'view:dispose': log,
            'model:ajax': log
        }
    };

    return config;
});
