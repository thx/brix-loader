/*
    https://github.com/search?o=desc&q=gulp+boilerplate&ref=searchresults&s=stars&type=Repositories&utf8=%E2%9C%93
    https://github.com/sindresorhus/gulp-plugin-boilerplate/
*/
var pkg = require('./package.json')
var gulp = require('gulp')
var uglify = require('gulp-uglify')
var jshint = require('gulp-jshint')
var connect = require('gulp-connect')
var exec = require('child_process').exec

gulp.task('compress', function() {
    gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

gulp.task('jshint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('connect', function() {
    connect.server({
        port: 4242
    })
})

gulp.task('watch', function(cb) {
    gulp.watch('src/*.js', ['jshint', 'compress'])
        .on('change', function(event) {
            exec('madge --format amd --image ./doc/dependencies.png ./src/',
                function(error, stdout, stderr) {
                    if (error) console.log('exec error: ' + error);
                }
            )
        })

    gulp.watch('demo/base/*.js', function(event) {
        exec('madge --format amd --image ./doc/dependencies-base.png ./demo/base/',
            function(error, stdout, stderr) {
                if (error) console.log('exec error: ' + error);
            }
        )
    })
    gulp.watch('demo/gallery/*.js', function(event) {
        exec('madge --format amd --image ./doc/dependencies-gallery.png ./demo/gallery/',
            function(error, stdout, stderr) {
                if (error) console.log('exec error: ' + error);
            }
        )
    })
})

gulp.task('default', ['connect'])