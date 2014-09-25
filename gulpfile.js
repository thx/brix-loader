/* global require */
/* global console */

var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mochaPhantomJS = require('gulp-mocha-phantomjs')
var connect = require('gulp-connect')
var rjs = require('gulp-requirejs')
var exec = require('child_process').exec

// https://github.com/spenceralger/gulp-jshint
gulp.task('jshint', function() {
    var globs = [
        'src/*.js', 'gulpfile.js',
        '../brix-components/**/*.js',
        '!../brix-components/bower_components/**/*'
    ]
    return gulp.src(globs)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

// https://github.com/mrhooray/gulp-mocha-phantomjs
gulp.task('mocha', function() {
    return gulp.src('test/*.html')
        .pipe(mochaPhantomJS({
            reporter: 'spec'
        }))
})

// https://github.com/RobinThrift/gulp-requirejs
gulp.task('rjs', function() {
    var build = {
        baseUrl: 'src',
        out: 'dist/loader.js',
        name: 'loader'
    }
    rjs(build)
        .pipe(gulp.dest('.')) // pipe it to the output DIR
})

// https://github.com/floatdrop/gulp-watch
gulp.task('watch', function( /*callback*/ ) {
    gulp.watch(['src/*.js', 'gulpfile.js'], ['madge', 'jshint', 'rjs', 'mocha'])
})

// https://github.com/pahen/madge
gulp.task('madge', function( /*callback*/ ) {
    exec('madge --format amd ./src/',
        function(error, stdout /*, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
            console.log('module dependencies:')
            console.log(stdout)
        }
    )
    exec('madge --format amd --image ./doc/dependencies.png ./src/',
        function(error /*, stdout, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
        }
    )
})

// https://github.com/AveVlad/gulp-connect
gulp.task('connect', function() {
    connect.server({
        port: 4244
    })
})

// TODO
// https://github.com/search?utf8=%E2%9C%93&q=gulp-mocha-phantomjs+coveralls&type=Code&ref=searchresults
gulp.task('coveralls', function() {})

gulp.task('default', ['connect', 'watch'])
gulp.task('build', ['jshint', 'rjs', 'mocha'])