/**
 * @file 路径相关处理函数
 * @author treelite(c.xinle@gmail.com),
 *         mengke01(kekee000@gmail.com)
 */

define(function (require) {

    /**
     * normalize path
     * see rfc3986 #6.2.3. Scheme-Based Normalization
     *
     * @inner
     * @param {string} path 路径
     * @return {string}
     */
    function normalize(path) {
        if (!path) {
            path = '/';
        }

        return path;
    }

    /**
     * 获取目录
     *
     * @inner
     * @param {string} path 路径
     * @return {string}
     */
    function dirname(path) {
        path = path.split('/');
        path.pop();
        return path.join('/');
    }

    /**
     * 处理路径中的相对路径
     *
     * @inner
     * @param {Array} paths 分割后的路径
     * @param {boolean} overRoot 是否已超出根目录
     * @return {Array}
     */
    function resolveArray(paths, overRoot) {
        var up = 0;
        for (var i = paths.length - 1, item; item = paths[i]; i--) {
            if (item === '.') {
                paths.splice(i, 1);
            }
            else if (item === '..') {
                paths.splice(i, 1);
                up++;
            }
            else if (up) {
                paths.splice(i, 1);
                up--;
            }
        }

        if (overRoot) {
            while (up-- > 0) {
                paths.unshift('..');
            }
        }

        return paths;
    }

    function resolve(from, to) {
        to = to || '';

        if (to.charAt(0) === '/') {
            return resolve(to);
        }

        var isAbsolute = from.charAt(0) === '/';
        var isDir = false;
        if (to) {
            from = dirname(from);
            isDir = to.charAt(to.length - 1) === '/';
        }
        // 对于`/`不处理
        else if (from.length > 1) {
            isDir = from.charAt(from.length - 1) === '/';
        }

        var path = from.split('/')
                    .concat(to.split('/'))
                    .filter(
                        function (item) {
                            return !!item;
                        }
                    );

        path = resolveArray(path, !isAbsolute);


        return (isAbsolute ? '/' : '')
            + (path.length > 0 ? path.join('/') + (isDir ? '/' : '') : '');
    }

    /**
     * 比较path
     *
     * @public
     * @param {string} path1 路径1
     * @param {string} path2 路径1
     * @return {boolean}
     */
    function equal(path1, path2) {
        path1 = normalize(path1);
        path2 = normalize(resolve(path2 || ''));
        return myPath === path;
    }

    return {
        resolve: resolve,
        equal: equal
    };
});
