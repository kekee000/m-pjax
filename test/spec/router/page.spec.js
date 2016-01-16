/**
 * @file page controller test spec
 * @author mengke01
 */

define(function (require) {

    var controller = require('m-pjax/router/page');

    describe('Page Controller', function () {

        describe('init/dipose', function () {

            it('should apply handler with current path', function (done) {
                var fn = jasmine.createSpy('fn');
                history.pushState({}, document.title, '?name=treelite&w=1');

                controller.init({}, fn);
                controller.dispose();

                expect(fn).toHaveBeenCalled();
                done();
            });

        });

        describe('redirect', function () {

             it('should have redirect function', function () {
                expect(typeof controller.redirect === 'function').toBeTruthy();
            });
        });

        describe('reset', function () {

             it('should have reset function', function () {
                expect(typeof controller.reset === 'function').toBeTruthy();
            });
        });
    });

});
