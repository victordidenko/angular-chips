var gulp = require('gulp');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var karmaServer = require('karma').Server;

gulp.task('default', ['build']);

gulp.task('build', function() {
    return runSequence('sass', 'concat', 'connect', 'addwatch');
})

gulp.task('concat', function() {
    return gulp.src(['src/js/directives/chips.js', 'src/js/**/*.js', 'dist/template.js'])
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



gulp.task('refreshtml', function() {
    gulp.src('samples/index.html')
        .pipe(connect.reload());
});

gulp.task('addwatch', function() {
    gulp.watch(['src/js/**/*.js', 'samples/*.js'], function() {
        gulp.run('concat');
    });
    gulp.watch('samples/index.html', function() {
        gulp.run('refreshtml')
    });

    gulp.watch('src/css/main.scss', function() {
        gulp.run('sass');
    });
});

gulp.task('connect', function() {
    var server = connect.server({
        livereload: true,
        port: 9000,
    });
});

gulp.task('test', ['sass', 'concat'], function(done) {
    new karmaServer({
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    }, done).start();
});
