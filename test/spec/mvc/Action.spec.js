/**
 * @file action spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Abstract = require('m-pjax/mvc/Abstract');
    var Action = require('m-pjax/mvc/Action');

    describe('Action', function () {

        it('should inherited abstract', function () {
            var action = new Action();

            expect(action instanceof Abstract).toBeTruthy();
        });

        it('create new instance should bind events', function () {
            var fn = jasmine.createSpy('fn');
            var action = new Action({
                    events: {
                        'view:add': fn,
                        'model:update': fn
                    }
                });

            action.view.fire('add');
            action.model.fire('update');

            expect(fn.calls.count()).toBe(2);
        });

        it('create new instance should fire `init`', function () {
            var fn = jasmine.createSpy('fn');
            var action = new Action({
                    events: {
                        init: fn
                    }
                });

            expect(fn.calls.count()).toBe(1);
        });

        it('.enter() should set url, query and finish', function (done) {
            var url = '/index';
            var query = {filter: 'www'};
            var options = {noCache: true};
            var ele = document.createElement('div');
            var fn = jasmine.createSpy('fn');
            var action = new Action({
                    events: {
                        enter: fn
                    }
                });

            spyOn(action.view, 'setMain').and.callThrough();

            action.enter(url, query, options, ele);
            expect(action.url).toEqual(url);
            expect(action.query).toEqual(query);
            expect(action.query).not.toBe(query);
            expect(action.options).toEqual(options);
            expect(action.options).not.toBe(options);
            expect(fn.calls.count()).toBe(1);
            expect(action.view.setMain).toHaveBeenCalledWith(ele);
            done();
        });


        it('.dispose() should call view\'s dispose and model\'s dispose', function () {
            var action = new Action();

            var vd = spyOn(action.view, 'dispose');
            var md = spyOn(action.model, 'dispose');
            action.dispose();
            expect(vd).toHaveBeenCalled();
            expect(md).toHaveBeenCalled();
        });

    });

});
