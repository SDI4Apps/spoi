module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        nggettext_extract: {
            fatima: {
                files: {
                    'template.pot': [__dirname + '/**/*.html', __dirname + '/**/*.js']
                }
            }
        },
        nggettext_compile: {
            fatima: {
                files: {
                    'translations.js': [__dirname + "/*.po"]
                }
            },
        },
        jsdoc: {
            dist: {
                src: ['components/**/*.js'],
                options: {
                    destination: 'docs',
                    configure: 'node_modules/angular-jsdoc/common/conf.json',
                    template: 'node_modules/angular-jsdoc/angular-template',
                    readme: './README.md'
                }
            }
        },

    });

    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('git-pre-commit', ['jsbeautifier']);


};
