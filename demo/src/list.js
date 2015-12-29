
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
        sendAjax: function (params) {
            return this.get('/demo/list.json', params);
        }
    };

    config.view = {

        domEvents: {
            'click:.send-ajax': function () {
                var me = this;
                this.model.sendAjax({
                    page: 1
                }).then(function (data) {
                    me.find('.send-ajax').html(data);
                });
            },

            'click:page>a': function (e) {
                this.action.redirect('', {
                    page: e.target.getAttribute('data-page')
                });
            }
        },

        events: {
            ready: function () {
                console.log(this.model.data);
                this.fire('refresh');
                this.addEvent('click', function () {
                    console.log('click');
                });
                this.main.append('<p>页面加载完毕</p>');
            },
            refresh: function () {
                this.main.find('.curpage').html(this.action.query.page);
            }
        }
    }

    return config;
});
