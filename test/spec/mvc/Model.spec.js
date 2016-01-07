/**
 * @file action spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Abstract = require('m-pjax/mvc/Abstract');
    var Model = require('m-pjax/mvc/Model');

    describe('Model', function () {

        it('should inherited abstract', function () {
            var model = new Model();
            expect(model instanceof Abstract).toBeTruthy();
        });

        it('should have ejson get', function (done) {
            var model = new Model();
            var res = {status: 0, data: "hello"};
            model.get('/echo', {content: JSON.stringify(res)}).then(
                function (data) {
                    expect(data).toEqual(res.data);
                    done();
                }
            );
        });

        it('should have pajx get', function (done) {
            var model = new Model();
            var res = {status: 0, data: "hello"};
            model.getPjax('/echo', { content: 'pjax'}).then(
                function (data) {
                    expect(data).toEqual('pjax');
                    done();
                }
            );
        });

    });

});
