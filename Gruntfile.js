module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // bower-task
        bower: {
            install: {
                options: {
                    targetDir: './public/lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        // contrib-connect server
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'public',
                    keepalive: true
                }
            }
        }

    });

    // Keep bower and public seperate.
    grunt.loadNpmTasks('grunt-bower-task');

    // Provide a development server.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['connect']);

};