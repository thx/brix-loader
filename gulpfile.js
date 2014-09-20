/* global require */
/* global console */

var gulp = require('gulp')
var jshint = require('gulp-jshint')
var coveralls = require('gulp-coveralls')
var mochaPhantomJS = require('gulp-mocha-phantomjs')
var instrument = require('gulp-instrument')
var connect = require('gulp-connect')
var rjs = require('gulp-requirejs')
var exec = require('child_process').exec

// https://github.com/spenceralger/gulp-jshint
gulp.task('jshint', function() {
    return gulp.src(['src/*.js', 'gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

// https://github.com/mrhooray/gulp-mocha-phantomjs
gulp.task('mocha', function() {
    return gulp.src('test/*.html')
        .pipe(mochaPhantomJS({
            mocha: {
                globals: ['chai'],
                timeout: 6000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        }))
})

gulp.task('instrument', function() {
    return gulp.src('dist/*.js')
        .pipe(instrument())
        .pipe(gulp.dest('lib-cov'));
});

gulp.task('coverage', ['instrument'], function() {
    process.env.JSCOV = true;
    return spawn('./node_modules/gulp-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/bin/mocha', [
            'test', '--reporter', 'html-cov'
        ]).stdout
        .pipe(source('coverage.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('coveralls', ['instrument'], function(done) {
    if (!process.env.COVERALLS_REPO_TOKEN) {
        return done(new Error("No COVERALLS_REPO_TOKEN set."));
    }

    process.env.JSCOV = 1;

    var err = '';

    var mocha = spawn('node_modules/gulp-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/bin/mocha', [
        'test', '--reporter', 'mocha-lcov-reporter'
    ]);

    mocha.stderr.on('data', function(chunk) {
        err += chunk;
    });

    mocha.stdout
        .pipe(source('lcov.json'))
        .pipe(buffer())
        .pipe(coveralls());

    mocha.on('close', function(code) {
        if (code) {
            if (err) return done(new Error(err));

            return done(new Error(
                "Failed to send lcov data to coveralls."
            ));
        }

        done();
    });
});

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

gulp.task('madge', function( /*callback*/ ) {
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

gulp.task('default', ['connect', 'watch'])
gulp.task('build', ['jshint', 'rjs', 'mocha'])