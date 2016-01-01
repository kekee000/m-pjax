/**
 * @file path spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var path = require('m-pjax/util/path');

    describe('path', function () {

        describe('static resolve', function () {

            it('should handle one arguments', function () {
                expect(path.resolve('abc/../abd/../../abd/ccc')).toEqual('../abd/ccc');
                expect(path.resolve('/abc/../abd/../../abd/ccc')).toEqual('/abd/ccc');
            });

            it('should handle two arguments', function () {
                expect(path.resolve('abc', '../abde')).toEqual('../abde');
                expect(path.resolve('/abc/../abd', '../../abd/ccc')).toEqual('/abd/ccc');
                expect(path.resolve('/abc/abd', '../ccc')).toEqual('/ccc');
                expect(path.resolve('/abc/abd', './ccc')).toEqual('/abc/ccc');
                expect(path.resolve('/abc/abd', '../')).toEqual('/');
            });

            it('should not ignore the last slash', function () {
                expect(path.resolve('/abcd/../abc/')).toEqual('/abc/');
                expect(path.resolve('/')).toEqual('/');

                expect(path.resolve('/abc/abd/', './ccc')).toEqual('/abc/abd/ccc');
                expect(path.resolve('/abc/abd/', './ccc/')).toEqual('/abc/abd/ccc/');
            });

            it('should ignore first argument when second argument start with "/"', function () {
                expect(path.resolve('/abc/abd', '/../abc/../')).toEqual('/');
                expect(path.resolve('/abc/abd', '//abc')).toEqual('/abc');
            });

            it('out of range', function () {
                expect(path.resolve('/', '../../b')).toEqual('/b');
                expect(path.resolve('../../b')).toEqual('../../b');
            });

            it('wrong path', function () {
                expect(path.resolve('///abc')).toEqual('/abc');
                expect(path.resolve('///../abc')).toEqual('/abc');
            });

        });

        describe('equal', function () {

            it('should return true when they are same', function () {
                expect(path.equal('abc/dd', 'abc/dd')).toBeTruthy();
                expect(path.equal('abc/dd', 'abc/bded/../dd')).toBeTruthy();
            });

            it('should return false when they are not same', function () {
                expect(path.equal('abc/dd', 'abc/dd/bb')).toBeFalsy();
                expect(path.equal('abc/dd', 'abc/../dd')).toBeFalsy();
                expect(path.equal('abc/dd', 'abc/dd/')).toBeFalsy();
            });

            it('should return true betwen empty string and \'/\'', function () {
                expect(path.equal('/', '')).toBeTruthy();
            });

        });

    });

});
