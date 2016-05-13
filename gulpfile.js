var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

// build templates
// build crawler/web app
// watch and rebuild

gulp.task('build-templates', function() {
    return gulp
        .src('./src/web-dashboard/**/*.html')
        .pipe(templateCache({
            standalone: true
        }))
        .pipe(gulp.dest('public'))
});

gulp.task('build-web-app', function() {
    return gulp
        .src('./src/web-dashboard/client/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('public'))
});

gulp.task('build-src', function() {
    return gulp.src(['./src/**/*.js', '!./src/web-dashboard/client/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
});

gulp.task('watch', function() {
    gulp.watch('./src/web-dashboard/client/**/*', ['build-web-app', 'build-templates']);
    gulp.watch(['./src/**/*.js', '!./src/web-dashboard/client/**/*.js'], ['build-src'])
});


gulp.task('default', ['watch']);
gulp.task('build', ['build-web-app', 'build-templates', 'build-src']);

