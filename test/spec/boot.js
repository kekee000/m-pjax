/**
 * @file boot.js
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {
    require('./util/path.spec');
    require('./util/uri-parser.spec');

    require('./ejson.spec');
    require('./pjax.spec');

    require('./URL.spec');
    require('./router/popstate.spec');
    require('./router.spec');
    return {};
});
