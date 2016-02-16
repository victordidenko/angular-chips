var gulp = require('gulp');
var concat = require('gulp-concat');
var html2js = require('gulp-html2js');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

gulp.task('default', ['build']);

gulp.task('build', function() {
    return runSequence('html2js', 'sass', 'concat', 'copy', 'connect');
})

gulp.task('concat', function() {
    return gulp.src(['src/js/**/*.js', 'dist/template.js'])
        .pipe(concat('chips.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('html2js', function() {
    return gulp.src('src/templates/*.html')
        .pipe(html2js({
            outputModuleName: 'angular.chips',
            useStrict: true
        }))
        .pipe(concat('template.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function() {
    return gulp.src('src/css/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/'));
})

gulp.task('copy', function() {
    return gulp.src([
            'dist/chips.js',
            'dist/main.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
            'bower_components/angular/angular.js',
        ])
        .pipe(gulp.dest('input_demo/lib'))
        .pipe(connect.reload());
});

gulp.watch(['src/js/**/*.js','input_demo/js/*.js'], function() {
    runSequence('concat', 'copy');
});

gulp.watch(['src/templates/*.html','input_demo/index.html'], function() {
    runSequence('html2js', 'concat', 'copy');
});

gulp.task('copycss', function() {
    return gulp.src([
            'dist/main.css',
        ])
        .pipe(gulp.dest('input_demo/lib'))
});

gulp.watch('src/css/main.scss', function(files) {
    runSequence('sass', 'copy');
});

gulp.task('connect', function() {
    var server = connect.server({
        root: 'input_demo',
        fallBack: 'index.html',
        livereload: true,
        port: 9000,
    });
});
