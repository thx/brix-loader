/*
    https://github.com/search?o=desc&q=gulp+boilerplate&ref=searchresults&s=stars&type=Repositories&utf8=%E2%9C%93
    https://github.com/sindresorhus/gulp-plugin-boilerplate/
*/
var pkg = require('./package.json')
var gulp = require('gulp')
var watch = require('gulp-watch')
var jshint = require('gulp-jshint')
var connect = require('gulp-connect')


gulp.task('jshint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('connect', function() {
    connect.server({
        port: 4242
    })
})

gulp.task('default', ['connect'])