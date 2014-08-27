'use strict'

module.exports = function(grunt) {

    // Load multiple grunt tasks using globbing patterns
    require("load-grunt-tasks")(grunt)
    // Displays the execution time of grunt tasks
    require('time-grunt')(grunt)

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: { // grunt connect:server:keepalive
            server: {
                options: {
                    keepalive: true,
                    port: 5005,
                    base: '.',
                    hostname: '0.0.0.0'
                }
            }
        }
    })

    grunt.registerTask('default', ['connect'])
}