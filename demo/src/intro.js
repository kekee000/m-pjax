define(function (require) {

    function log(e) {
        console.log(this.url, e.type);
    }

    var config = {
        className: 'view-router',
        events: {
            'enter': log,
            'refresh': log
        }
    };

    config.view = {
        events: {
            ready: function () {
                this.find('.curid').html(this.action.query.id);
            }
        }
    }

    return config;
});
