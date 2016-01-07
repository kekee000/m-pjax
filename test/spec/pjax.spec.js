/**
 * @file pjax test
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var pjax = require('m-pjax/pjax');

    describe('PJAX', function () {

        it('pjax request success', function (done) {
            pjax.request({
                url: '/echo',
                data: {
                    content: 'pjax'
                }
            }).then(
                function (data) {
                    expect(data).toEqual('pjax');
                    done();
                }
            );
        });

        it('pjax get success', function (done) {
            pjax.get('/echo', {
                content: 'pjax'
            }).then(
                function (data) {
                    expect(data).toEqual('pjax');
                    done();
                }
            );
        });

        it('pjax error', function (done) {
            pjax.request({
                url: '/error',
                data: {
                    content: 'pjax'
                }
            }).then(null,
                function (data) {
                    expect(data).not.toBeNull();
                    done();
                }
            );
        });

        it('abort error', function (done) {
            var req = pjax.request({
                url: '/sleep',
                time: 1000
            });

            req.then(null, function (data) {
                expect(data).not.toBeNull();
                done();
            });

            setTimeout(function () {
                req.abort();
            }, 200);
        });

    });

});
