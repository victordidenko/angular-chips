var gulp = require('gulp');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

gulp.task('default', ['build']);

gulp.task('build', function() {
    return runSequence('sass', 'concat', 'connect');
})

gulp.task('concat', function() {
    return gulp.src(['src/js/directives/chips.js','src/js/**/*.js', 'dist/template.js'])
        .pipe(concat('angular-chips.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
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

gulp.task('refreshtml',function(){
    gulp.src('samples/index.html')
    .pipe(connect.reload());
})

gulp.watch('samples/index.html', function() {
    console.log('watched')
    gulp.run('refreshtml')
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
