/**
 * @file router测试用例
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {
    var router = require('m-pjax/router');
    var URL = require('m-pjax/URL');

    /**
     * 根据路径和query创建url
     *
     * @inner
     * @param {string=} url url字符串
     * @param {Object=} query 查询条件
     * @return {URL}
     */
    function createURL(url, query) {
        if (query) {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + URL.stringifyQuery(query);
        }
        return location.protocol + '//' + location.host + url;
    }


    // mock controller
    var controller = {
        init: function (config, applyHander) {
            this.applyHander = applyHander;
        },
        redirect: function (url, query, options) {
            var url = new URL(createURL(url || location.pathname, query));
            if (!this.url || !this.url.equal(url)) {
                this.applyHander(url.path, url, options);
                this.url = url;
            }
        },
        dispose: function () {
            this.applyHander = null;
            this.url = null;
        },
        reset: function () {}
    };

    router.controller(controller);

    describe('main', function () {

        describe('start/stop', function () {

            it('should init controller and dipose controller', function () {
                spyOn(controller, 'init');
                spyOn(controller, 'dispose');

                router.start();
                router.stop();

                expect(controller.init.calls.count()).toBe(1);
                expect(controller.dispose.calls.count()).toBe(1);
            });

        });

        describe('add/remove', function () {

            beforeEach(function () {
                router.start();
            });

            afterEach(function () {
                router.stop();
                router.clear();
            });

            it('no handler, throw exception', function () {
                var error;
                try {
                    router.redirect('/');
                }
                catch (e) {
                    error = e;
                }
                expect(error).not.toBeUndefined();
                expect(error.message.indexOf('route') >= 0).toBeTruthy();
            });

            it('default handler', function () {
                var error;
                var fn = jasmine.createSpy('fn');

                router.add('', fn);
                try {
                    router.redirect('/');
                }
                catch (e) {
                    error = e;
                }

                expect(error).toBeUndefined();
                expect(fn).toHaveBeenCalled();
            });

            it('call handler with params', function () {
                var fn = jasmine.createSpy('fn');
                var options = {foo: 'bar'};

                router.add('/home/work', fn);

                router.redirect('/home/work', {name: 'saber'}, options);

                expect(fn).toHaveBeenCalled();
                var params = fn.calls.argsFor(0);
                expect(params[0]).toEqual('/home/work');
                expect(params[1]).toEqual({name: 'saber'});
                expect(params[2]).toEqual({});
                expect(params[3].indexOf('/home/work?name=saber') >= 0).toBeTruthy();
                expect(params[4]).toEqual(options);
            });

            it('RegExp handler', function () {
                var fn = jasmine.createSpy('fn');

                router.add(/\/\d{1,2}$/, fn);

                try {
                    router.redirect('/10');
                    // should error
                    router.redirect('/100');
                }
                catch (e) {}
                expect(fn.calls.count()).toBe(1);
            });

            it('add the same handler repeatedly should throw error', function () {
                var error;
                var fn = jasmine.createSpy('fn');

                router.add('/', fn);
                try {
                    router.add('/', fn);
                }
                catch (e) {
                    error = true;
                }
                expect(error).toBeTruthy();


                error = false;
                router.add(/\/abc$/, fn);
                try {
                    router.add(/\/abc$/, fn);
                }
                catch (e) {
                    error = true;
                }
                expect(error).toBeTruthy();
            });

            it('remove rule', function () {
                var fn1 = jasmine.createSpy('fn1');
                var fn2 = jasmine.createSpy('fn2');
                var fn3 = jasmine.createSpy('fn3');

                router.add('/', fn1);
                router.add(/\/abc$/, fn3);

                router.redirect('/');
                expect(fn1.calls.count()).toBe(1);
                router.redirect('/abc');
                expect(fn3.calls.count()).toBe(1);

                function tryRedirect(path) {
                    try {
                        router.redirect('/');
                    }
                    catch (e) {
                        return false;
                    }
                    return true;
                }

                router.remove('/');
                expect(tryRedirect('/')).toBeFalsy();
                expect(fn1.calls.count()).toBe(1);

                router.remove(/\/abc$/);
                expect(tryRedirect('/abc')).toBeFalsy();
                expect(fn3.calls.count()).toBe(1);
            });

        });

        describe('config', function () {

            beforeEach(function () {
                router.start();
            });

            afterEach(function () {
                router.stop();
                router.clear();
                // reset config
                router.config({
                    index: '',
                    path: '/',
                    root: ''
                });
            });

            it('default index name is empty', function () {
                var fn = jasmine.createSpy('fn');
                router.add('/index', fn);

                try {
                    router.redirect('/');
                }
                catch (e) {}

                expect(fn).not.toHaveBeenCalled();
            });

            it('set index name', function () {
                var fn = jasmine.createSpy('fn');

                router.config({
                    index: 'index'
                });

                router.add('/index', fn);

                router.redirect('/index');
                expect(fn.calls.count()).toBe(1);
            });

        });

        describe('support async handler', function () {

            beforeEach(function () {
                router.start();
            });

            afterEach(function () {
                router.stop();
                router.clear();
            });

            it('will call waiting route', function (done) {
                var fn1 = function (path, query, params, url, options, done) {
                    setTimeout(done, 300);
                };

                var fn2 = jasmine.createSpy('fn2');

                router.add('/', fn1);
                router.add('/new', fn2);

                router.redirect('/');
                router.redirect('/new');

                expect(fn2).not.toHaveBeenCalled();

                setTimeout(function () {
                    expect(fn2).toHaveBeenCalled();
                    done();
                }, 400);
            });

            it ('only wait for the last route', function (done) {
                var fn1 = function (path, query, params, url, options, done) {
                    setTimeout(done, 300);
                };

                var fn2 = jasmine.createSpy('fn2');
                var fn3 = jasmine.createSpy('fn3');

                router.add('/', fn1);
                router.add('/new', fn2);
                router.add('/detail', fn3);

                router.redirect('/');
                router.redirect('/new');
                router.redirect('/detail');

                expect(fn2).not.toHaveBeenCalled();
                expect(fn3).not.toHaveBeenCalled();

                setTimeout(function () {
                    expect(fn2).not.toHaveBeenCalled();
                    expect(fn3).toHaveBeenCalled();
                    done();
                }, 400);
            });

        });

    });

});
