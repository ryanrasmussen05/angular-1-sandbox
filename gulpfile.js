var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate');

//JSHint task
gulp.task('lint', function() {
    gulp.src('./app/components/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Browserify task
gulp.task('build', function() {
    gulp.src(['app/app.js'])
    .pipe(browserify({
            insertGlobals: true,
            debug: true
    }))
    //Bundle to a single file
    .pipe(concat('bundle.js'))
    //Output to dist folder
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['lint'], function() {
    //Watch script files for changes
    gulp.watch(['app/components/**/*.js'], [
        'lint',
        'build'
    ]);
});

gulp.task('deploy', function() {
    gulp.src(['app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        //Bundle to a single file
        .pipe(concat('bundle.js'))
        //annotate angular injection deps
        .pipe(ngAnnotate())
        //minify
        .pipe(uglify())
        //Output to dist folder
        .pipe(gulp.dest('app'));
});