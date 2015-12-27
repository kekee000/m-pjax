/**
 * @file Model
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var inherits = require('../lang').inherits;
    var Abstract = require('./Abstract');
    var ejson = require('../ejson');

    /**
     * Model
     *
     * @constructor
     */
    function Model(options) {
        Abstract.call(this, options);
        this.init();
    }

    inherits(Model, Abstract);

    /**
     * 获取数据
     *
     * @public
     */
    Model.prototype.get = function (url, data) {
        return ejson.get(url, data);
    };

    return Model;
});
