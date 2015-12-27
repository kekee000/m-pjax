/**
 * @file 系统缓存策略，默认使用sessionStorage,不支持此接口则使用内存缓存
 *
 * @author mengke01(kekee000@gmail.com)
 *
 * 用法：
 * cache.session = cache
 * cache.session.set / get / remove / each
 * cache.local .set / get / remove / each
 */

define(
    function (require) {

        // 内存缓存
        var memeryStorage = {

            data: {},

            set: function (key, value) {
                this.data[key] = value;
            },

            get: function (key) {
                return this.data[key];
            },

            remove: function (key) {
                delete this.data[key];
            },

            clear: function () {
                delete this.data;
                this.data = {};
            },

            // 支持遍历的接口
            each: function (eachFn) {
                var data = this.data;
                Object.keys(data, function (key) {
                    if (false === eachFn(data[key], key)) {
                        return false;
                    }
                });
            }
        };


        function normalize(key) {
            return key.replace(/[^\w-.]/g, '_');
        }

        /**
         * 获取指定的storage
         *
         * @param {SessionStorage|LocalStorage} storage 存储对象
         * @return {Storage} 存储对象
         */
        function getStorage(storage) {

            // 浏手机浏览器可能设置无痕模式，如果禁用了storage，则会出现报错，需要检查下
            // 如果不能写则不使用storage
            try {
                storage.setItem('__TEST_STOAGE_WRITE', '');
                storage.removeItem('__TEST_STOAGE_WRITE');
            }
            catch (e) {
                return memeryStorage;
            }

            return {
                set: function (key, value) {
                    storage.setItem(key, JSON.stringify(value));
                },

                get: function (key) {
                    var val = storage.getItem(key);
                    return val == null ? val : JSON.parse(val);
                },

                remove: function (key) {
                    storage.removeItem(key);
                },

                clear: function () {
                    storage.clear();
                },

                // 支持遍历的接口
                each: function (eachFn) {
                    var data = storage;
                    Object.keys(data, function (key) {
                        if (false === eachFn(data[key], key)) {
                            return false;
                        }
                    });
                }
            };
        }

        /**
         * 系统缓存对象
         *
         * @constructor
         * @param {Object} storage 使用的存储对象
         */
        function Cache(storage) {
            this.storage = getStorage(storage);
        }


        Cache.prototype = {

            constructor: Cache,

            /**
             * 设置一个对象，并标记什么时候过期
             *
             * @param {string} key 关键字
             * @param {json} value 值
             * @param {Date} expire 过期时间，可以是日期对象或者数字，以秒为单位
             *
             * @return {this}
             */
            set: function (key, value, expire) {
                this.storage.remove(key);
                var now = +new Date();

                if (expire instanceof Date) {
                    expire = expire - now;
                }
                else if (typeof expire === 'number') {
                    expire = expire * 1000;
                }
                else {
                    expire = false;
                }

                var wrapper = {
                    stamp: now,
                    expire: expire,
                    data: value
                };

                this.storage.set(normalize(key), wrapper);

                return this;
            },

            /**
             * 获得一个保存的对象
             *
             * @param {string} key 关键词
             * @param {Function} ifExpire 如果已经过期则执行的函数
             *
             * @return {*} 保存的对象
             */
            get: function (key, ifExpire) {
                var wrapper = this.storage.get(normalize(key));
                if (wrapper == null) {
                    return null;
                }
                // 如果已经过期
                else if (wrapper.expire && (wrapper.stamp + wrapper.expire < Date.now())) {
                    this.storage.remove(key);
                    if (typeof ifExpire === 'function') {
                        ifExpire(wrapper.data);
                    }

                    return null;
                }

                return wrapper.data;
            },

            /**
             * 移除一个对象，这里支持按命名空间存取，命名空间使用 "." 标志符，支
             * 持通配符"*"以便于删除一组对象因此
             * "xxx.*.xxx"
             * "*"
             * "xxx.xxx.*"
             * 都是允许的
             *
             * @param {string} key 需要移除的关键词
             * @return {this}
             */
            remove: function (key) {
                if (!key) {
                    return;
                }
                else if (key.indexOf('*') === -1) {
                    this.storage.remove(key);
                }
                else if (key === '*') {
                    this.storage.clear();
                }
                else {
                    var reg = new RegExp(
                        '^'
                        + normalize(key.replace(/\*/g, '[^\\b]+')).replace(/\./g, '\\.')
                        + '$'
                    );
                    var storage = this.storage;

                    // 移除通配符中的对象
                    storage.each(function (object, key) {
                        if (reg.test(key)) {
                            storage.remove(key);
                        }
                    });
                }

                return this;
            }
        };

        var cache = new Cache(window.sessionStorage);
        cache.session = cache;
        cache.local = new Cache(window.localStorage);

        return cache;
    }
);
