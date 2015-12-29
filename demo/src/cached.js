define(function (require) {

    function log(e) {
        console.log(this.url, e.type);
    }

    var config = {
        className: 'view-router',
        events: {
            'wakeup': log,
            'sleep': log
        }
    };

    config.view = {
        events: {
            ready: function () {
                this.find('.random').html(Math.random());
            }
        }
    }

    return config;
});
