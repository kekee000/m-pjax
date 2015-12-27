
define(function (require) {


    function log(e) {
        console.log(this.url, e.type);
    }

    var config = {
        events: {
            'enter': log,
            'refresh': log
        }
    };

    config.model = {

    };

    config.view = {
        events: {
            ready: function () {
                this.main.append('<p>view ready</p>');
            }
        }
    }

    return config;
});
