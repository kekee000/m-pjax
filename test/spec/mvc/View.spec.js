/**
 * @file view spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Abstract = require('m-pjax/mvc/Abstract');
    var View = require('m-pjax/mvc/View');

    describe('View', function () {

        var main;

        beforeEach(function () {
            main = document.createElement('div');
            main.style.cssText += ';position:absolute;top:-1000px;left:-1000px';
            document.body.appendChild(main);
        });

        afterEach(function () {
            main.remove();
            main = null;
        });

        it('should inherited abstract', function () {
            var view = new View();
            expect(view instanceof Abstract).toBeTruthy();
        });


        it('.setMain(ele) should set main element', function () {
            var view = new View();
            view.setMain(main);
            expect(view.main[0]).toBe(main);
        });


        it('.ready() should bind dom events', function (done) {
            $(main).html('<div class="box"><div class="inner"></div></div>');
            var fn = jasmine.createSpy('fn');
            var view = new View({
                main: main,
                domEvents: {
                    'click:.box': fn
                }
            });

            view.ready();

            $('.box', main).click();

            setTimeout(function () {
                expect(fn.calls.any()).toBeTruthy();
                done();
            }, 0);
        });

        it('.addEvent() should bind dom events', function (done) {
            $(main).html('<div class="box"><div class="inner"></div></div>');
            var view = new View({
                main: main
            });

            var thisObj;
            view.addEvent('click', '.box', function () {
                thisObj = this;
            });

            $('.inner', main).click();

            setTimeout(function () {
                expect(thisObj.className).toBe('box');
                done();
            }, 0);
        });

        it('.removeEvent() should unbind dom events', function (done) {
            $(main).html('<div class="box"><div class="inner"></div></div>');
            var fn = jasmine.createSpy('fn');
            var view = new View({
                main: main
            });

            view.addEvent('click', '.box', fn);
            view.removeEvent('click', '.box');

            $('.inner', main).click();

            setTimeout(function () {
                expect(fn.calls.any()).toBeFalsy();
                done();
            }, 0);
        });

        describe('.dipose()', function () {

            it('should detach all dom events', function (done) {
                $(main).html('<div class="box"><div class="inner"></div></div>');
                var fn = jasmine.createSpy('fn');
                var view = new View({
                    main: main,
                    domEvents: {
                        'click:.box': fn,
                        'click': fn
                    }
                });

                view.ready();
                view.dispose();

                $('.inner', main).click();

                setTimeout(function () {
                    expect(fn.calls.count()).toBe(0);
                    done();
                }, 0);
            });

            it('should dipose all controls', function () {
                var fn = jasmine.createSpy('fn');
                var view = new View({
                    main: main,
                    controls: [],
                    events: {
                        ready: function () {
                            this.controls.push({
                                dispose: fn
                            });
                            this.controls.keyfn = {
                                dispose: fn
                            };
                        }
                    }
                });

                view.ready();
                view.dispose();
                expect(view.controls).toBeNull();
                expect(fn.calls.count()).toBe(2);
            });

        });

    });

});
