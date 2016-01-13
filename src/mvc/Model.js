/**
 * @file Model
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var inherits = require('../lang').inherits;
    var Abstract = require('./Abstract');
    var ejson = require('../ejson');
    var pjax = require('../pjax');

    /**
     * Model
     *
     * @constructor
     * @see  Abstract
     * @param {Object} options 参数
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
     * @param {string} url url
     * @param {Object} query 请求参数
     * @return {promise}
     */
    Model.prototype.get = function (url, query) {
        return ejson.get(url, query);
    };

    /**
     * 获取pjax数据
     *
     * @public
     * @param {string} url url
     * @param {Object} query 请求参数
     * @return {promise}
     */
    Model.prototype.getPjax = function (url, query) {
        return pjax.get(url, query);
    };


    return Model;
});
