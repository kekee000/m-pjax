/**
 * @file URL.spec.js
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var URL = require('m-pjax/URL');

    describe('URL', function () {

        describe('toString', function () {

            it('should return the right string', function () {
                var str = 'http://www.baidu.com/search?wd=hello';
                expect(new URL(str).toString()).toEqual(str);

                str = 'http://www.baidu.com/search?wd=hello#hash';
                expect(new URL(str).toString()).toEqual(str);
            });

        });

        describe('parse', function () {
            it('should return component data', function () {
                var url = new URL('https://www.baidu.com/search');

                expect(url.scheme).toBe('https');
                expect(url.username).toBe('');
                expect(url.password).toBe('');
                expect(url.host).toEqual('www.baidu.com');
                expect(url.port).toBe('');
                expect(url.path).toEqual('/search');
                expect(url.query).toEqual('');
                expect(url.fragment).toBe('');

                url = new URL('ftp://kekee:pwd@www.baidu.com');
                console.log(url)
                expect(url.scheme).toBe('ftp');
                expect(url.username).toBe('kekee');
                expect(url.password).toBe('pwd');
                expect(url.host).toEqual('www.baidu.com');
                expect(url.port).toBe('');
                expect(url.path).toEqual('/');
            });
        });

        describe('query string', function () {
            it('should return query data', function () {
                var url = new URL('https://www.baidu.com/search?wd=hello');

                expect(url.getQuery()).toEqual({
                    wd: 'hello'
                });
            });

            it('parse', function () {
                var query = URL.parseQuery('wd=hello&page=%20&empty=');

                expect(query.wd).toEqual('hello');
                expect(query.page).toEqual(' ');
                expect(query.empty).toBe('');
            });


            it('stringify', function () {
                var querystring = URL.stringifyQuery({
                    wd: 'hello',
                    page: ' ',
                    empty: ''
                });

                expect(querystring).toEqual('wd=hello&page=%20&empty=');
            });

        });

        describe('equal', function () {


            it('equalOrigin', function () {
                var url1 = new URL('http://www.baidu.com?wd=hello#no');
                var url2 = new URL('http://www.baidu.com?wd=hello');
                expect(url1.equalOrigin(url2)).toBeTruthy();

                var url1 = new URL('http://www.baidu.com?wd=hello#no');
                var url2 = new URL('https://www.baidu.com?wd=hello');
                expect(url1.equalOrigin(url2)).toBeFalsy();
            });

            it('equalWithQuery', function () {
                var url1 = new URL('http://www.baidu.com?wd=hello#no');
                var url2 = new URL('http://www.baidu.com?wd=hello');
                expect(url1.equalWithQuery(url2)).toBeTruthy();
            });


            it('should return true when they are the same', function () {
                var url1 = new URL('http://www.baidu.com?wd=hello#no');
                var url2 = new URL('http://www.baidu.com?wd=hello#no');
                expect(url1.equal(url2)).toBeTruthy();
            });

            it('should return fase when they are not the same', function () {
                var url1 = new URL('http://www.baidu.com?wd=hello#no');
                var url2 = new URL('http://www.baidu.com?wd=hello');
                expect(url1.equal(url2)).toBeFalsy();
            });

            it('should not case sensitive about host', function () {
                var url1 = new URL('http://WWW.BAIDU.COM?wd=hello#no');
                var url2 = new URL('http://www.baidu.com?wd=hello');
                expect(url1.equalOrigin(url2)).toBeTruthy();
            });

            it('should normalize path', function () {
                var url1 = new URL('http://www.baidu.com/');
                var url2 = new URL('http://www.baidu.com?');
                expect(url1.equal(url2)).toBeTruthy();

                var url1 = new URL('http://www.baidu.com?xxx');
                var url2 = new URL('http://www.baidu.com/?xxx');
                expect(url1.equal(url2)).toBeTruthy();
            });
        });

    });

});
