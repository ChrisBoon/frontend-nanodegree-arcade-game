module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
              myFiles: ['js/app.js']
        },
        //concatenate js
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'build/css/style.css': 'css/sass/global.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 3 versions']})
                ]
            },
            dist: {
                src: 'build/css/style.css'
            }
        },

        cssbeautifier : {
          files : ['build/css/style.css']
        },
        copy: {
            img: {
                expand: true,
                src: 'images/*',
                dest: 'build/images/',
                flatten: true,
                filter: 'isFile'
            },
            js: {
                src: 'js/*.js',
                dest: 'build/'
            },
            build: {
                expand: true,
                src: '*.html',
                dest: 'build/'
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'build/',
                    dest: 'dist/',
                    src: [
                        'css/*.css',
                        '*.html',
                        'img/*',
                        'js/*.min.js'
                    ]
                }]
            }


        },
        connect: {
            build: {
                options: {
                    port: 9001,
                    keepalive: true,
                    base: 'build'
                }
            },
            dist: {
                options: {
                    port: 9001,
                    keepalive: true,
                    base: 'dist'
                }
            }

        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['jshint','copy:js'],
                options: {
                    spawn: false,
                    livereload: true
                },
            },
            css: {
                files: ['css/sass/*.scss'],
                tasks: ['sass','postcss','cssbeautifier'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            html: {
                files: ['index.html'],
                tasks: ['copy:build'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
        'jshint',
        'sass',
        'postcss',
        'cssbeautifier',
        'copy:img',
        'copy:build',
        'connect:build'
    ]);

    grunt.registerTask('dist', [
        'copy:dist'
    ]);


};