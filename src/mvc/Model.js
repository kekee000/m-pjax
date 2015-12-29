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
     * @param {string} url url
     * @param {Object} query 请求参数
     *
     * @public
     */
    Model.prototype.get = function (url, query) {
        return ejson.get(url, query);
    };

    return Model;
});
