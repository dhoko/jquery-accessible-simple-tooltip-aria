var gulp  = require('gulp'),
    babel   = require('gulp-babel'),
    rename   = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('default', ['es5'], function() {

  gulp
    .src(['./src/*.js', '!./src/*.es6.js'])
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('./dist'));

  gulp
    .src('./src/*.es6.js')
    .pipe(gulp.dest('./dist'));
});



gulp.task('es5', function() {
  gulp
    .src('./src/*.es6.js')
    .pipe(babel())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
});