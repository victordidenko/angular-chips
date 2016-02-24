var gulp = require('gulp');
var concat = require('gulp-concat');
var html2js = require('gulp-html2js');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

gulp.task('default', ['build']);

gulp.task('build', function() {
    return runSequence('html2js', 'sass', 'concat', 'connect');
})

gulp.task('concat', function() {
    return gulp.src(['src/js/**/*.js', 'dist/template.js'])
        .pipe(concat('angular-chips.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
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
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

gulp.watch(['src/js/**/*.js','samples/*.js'], function(){
    gulp.run('concat');
});

gulp.watch(['src/templates/*.html','samples/index.html'], function() {
    runSequence('html2js', 'concat');
});

gulp.watch('src/css/main.scss', function(){
    gulp.run('sass');
});

gulp.task('connect', function() {
    var server = connect.server({
        livereload: true,
        port: 9000,
    });
});
