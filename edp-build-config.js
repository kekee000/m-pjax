/**
 * @file build配置
 * @author edpx-mobile
 */

exports.input = __dirname;
var path = require('path');
exports.output = path.resolve( __dirname, 'output');

exports.getProcessors = function () {

    var moduleProcessor = new ModuleCompiler({
        configFile: './module.conf',
        files: [
            'src/**/main.js',
        ]
    });

    var jsProcessor = new JsCompressor({
        files: [
            'src/main.js',
        ]
    });

    var outputCleaner = new OutputCleaner({
        files: [
            'src/**/*.js',
            '!src/main.js',
        ]
    });
    return [
        moduleProcessor, jsProcessor, outputCleaner
    ];
};

exports.exclude = [
    'tool',
    'doc',
    'module.conf',
    '*.md',
    'demo',
    'test',
    'edp-*',
    'node_modules',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.fecsignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    '*.sh',
    '*.bat',
    'README',
    'nohup.out',
    'mock',
    'deploy',
    'package.json'
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

