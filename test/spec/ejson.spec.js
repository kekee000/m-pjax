/**
 * @file ejson test
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var ejson = require('m-pjax/ejson');
    var ERROR = ejson.ERROR;

    describe('E-JSON', function () {

        it('parse json fail', function (done) {
            ejson.get('/echo', {content: 'error'}).then(null, function (res) {
                expect(res.status).toBe(ERROR.DATA);
                done();
            });
        });

        it('status === 0', function (done) {
            var res = {status: 0, data: "hello"};

            ejson.get('/echo', {content: JSON.stringify(res)}).then(
                function (data) {
                    expect(data).toEqual(res.data);
                    done();
                }
            );
        });

        it('status !== 0', function (done) {
            var res = {status: 1, statusInfo: "error"};

            ejson.get('/echo', {content: JSON.stringify(res)}).then(null, function (r) {
                expect(r.status).toEqual(res.status);
                expect(res.statusInfo).toEqual(r.statusInfo);
                done();
            });
        });

        it('abort error', function (done) {
            var req = ejson.get('/sleep', {time: 1000});

            req.then(null, function (res) {
                expect(res.status).toEqual(ERROR.ERROR);
                done();
            });

            setTimeout(function () {
                req.abort();
            }, 200);
        });

    });

});
