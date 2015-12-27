/**
 * @file pajax框架配置
 * @author mengke01(kekee000@gmail.com)
 */

define({

    /**
     * 默认根路径
     *
     * @type {string}
     */
    root: '',

    /**
     * 视图配置
     * 参见`saber-viewport`的全局配置参数
     * https://github.com/ecomfe/saber-viewport
     *
     * @type {Object}
     */
    viewport: {

        /**
         * 当前view的类名称
         *
         * @type {string}
         */
        className: '',

        /**
         * 默认关闭转场效果
         *
         * @type {boolean}
         */
        transition: false
    },

    /**
     * 加载Action超时时间（毫秒）
     * 超过此时间可以切换Action
     *
     * @type {number}
     */
    timeout: 1000
});
