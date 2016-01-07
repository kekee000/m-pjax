/**
 * @file Abstract Spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Abstract = require('m-pjax/mvc/Abstract');

    describe('Abstract', function () {

        it('should mixin observable', function () {
            var abs = new Abstract();

            expect(typeof abs.on).toEqual('function');
            expect(typeof abs.fire).toEqual('function');
        });

        it('should extend options', function () {
            var abs = new Abstract({hello: {}});

            expect(abs.hasOwnProperty('hello')).toBeTruthy();
        });

        it('should support events', function () {
            var fo = require('m-pjax/observable').mixin({});
            var count = 0;
            var fn = function () {
                count++;
                expect(this).toBe(abs);
            };
            var abs = new Abstract({
                    events: {
                        'init': fn,
                        'fo:init': fn
                    },
                    fo: fo
                });
            abs.init();

            abs.fire('init');
            abs.fo.fire('init');

            expect(count).toBe(2);
        });

    });
});
