var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    sass = require('gulp-sass'),
    del = require('del'),
    runSequence = require('run-sequence');

//clean build files
gulp.task('clean', function() {
    return del(['./app/bundle.js', './app/style.css']);
});

//JSHint task
gulp.task('lint', function() {
    return gulp.src('./app/components/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Browserify task
gulp.task('build-dev', function() {
    return gulp.src(['app/app.js'])
    .pipe(browserify({
            insertGlobals: true,
            debug: true
    }))
    //Bundle to a single file
    .pipe(concat('bundle.js'))
    //Output to dist folder
    .pipe(gulp.dest('app'));
});

gulp.task('build-prod', function() {
    return gulp.src(['app/app.js'])
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

//compile sass
gulp.task('build-sass', function() {
    return gulp.src('./app/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['lint'], function() {
    //Watch script files for changes
    gulp.watch(['app/components/**/*.js'], [
        'build-dev'
    ]);
    gulp.watch(['app/**/*.scss'], [
        'build-sass'
    ])
});

//build for dev
gulp.task('build', function(callback) {
    runSequence(['clean'], ['lint'], ['build-sass', 'build-dev'], callback);
});

//build for deploy
gulp.task('deploy', function(callback) {
    runSequence(['clean'], ['lint'], ['build-sass', 'build-prod'], callback);
});