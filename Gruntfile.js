// Generated on 2014-03-09 using generator-nodejs 1.0.3
module.exports = function(grunt) {


    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        complexity : {
            generic : {
                src : ['srv/**/*.js'],
                options : {
                    errorsOnly : false,
                    cyclometric : 6, // default is 3
                    halstead : 16, // default is 8
                    maintainability : 100
                // default is 100
                }
            }
        },
        jshint : {
            all : ['Gruntfile.js', 'src/**/*.js'],
            options : {
                jshintrc : '.jshintrc'
            }
        },
        watch : {
            js : {
                files : ['**/*.js', '!node_modules/**/*.js'],
                tasks : ['default'],
                options : {
                    nospawn : true
                }
            }
        },
        uglify : {
            all : {
                options : {
                    sourceMap : true
                },
                files : {
                    'dist/jquery.lsr.min.js': ['src/jquery.lsr.js']
                }
            }
        },
        copy : {
            all : {
                files : [{
                    expand : true,
                    flatten : true,
                    src : ['src/*.js'],
                    dest : 'dist/',
                    filter : 'isFile'
                }, ],
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
