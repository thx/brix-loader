/* global require */
/* global console */

var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')
var connect = require('gulp-connect')
var rjs = require('gulp-requirejs')
var build = {
    baseUrl: 'src',
    out: 'dist/loader.js',
    name: 'loader'
}
var exec = require('child_process').exec

gulp.task('jshint', function() {
    return gulp.src(['src/*.js', 'gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('mocha', function() {
    return gulp.src('test/*.js')
        .pipe(mocha({
            reporter: 'nyan'
        }))
})

gulp.task('rjs', function() {
    rjs(build)
        .pipe(gulp.dest('.')); // pipe it to the output DIR
});

gulp.task('watch', function( /*callback*/ ) {
    gulp.watch(['src/*.js', 'gulpfile.js'], ['jshint', 'rjs'])
        .on('change', function( /*event*/ ) {
            exec('madge --format amd --image ./doc/dependencies.png ./src/',
                function(error /*, stdout, stderr*/ ) {
                    if (error) console.log('exec error: ' + error);
                }
            )
        })
})

gulp.task('connect', function() {
    connect.server({
        port: 4244
    })
})

gulp.task('default', ['watch'])