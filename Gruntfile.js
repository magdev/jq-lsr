/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Marco Grätsch
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        complexity: {
            generic: {
                src: ['srv/**/*.js'],
                options: {
                    errorsOnly: false,
                    cyclometric: 6,
                    halstead: 16,
                    maintainability: 100
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            js: {
                files: ['**/*.js', '!node_modules/**/*.js', '!bower_components/**/*.js'],
                tasks: ['default'],
                options: {
                    nospawn: true
                }
            }
        },
        uglify: {
            all: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/jquery.lsr.min.js': ['src/jquery.lsr.js']
                }
            }
        },
        copy: {
            all: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['src/*.js'],
                    dest: 'dist/',
                    filter: 'isFile'
                }],
            },
        },
    });

    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['complexity', 'jshint', 'copy', 'uglify']);
};
