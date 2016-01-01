// 端口
exports.port = 8848;

// 网站根目录
exports.documentRoot = process.cwd();

exports.getLocations = function () {
    return [
        {
            location: /\/sleep(?:\?|$)/,
            handler: [
                function (context) {
                    var query = context.request.query;
                    context.stop();
                    setTimeout(function () {
                        context.start();
                    }, query.time || 2000);
                }
            ]
        },
        {
            location: /\/echo(?:\?|$)/,
            handler: [
                function (context) {
                    var query = context.request.query;
                    context.content = query.content;
                }
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

/* eslint-disable guard-for-in */
exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
