var babel = require('gulp-babel');
var gulp = require('gulp');
var path = require('path');
var resolve = path.resolve;
var del = require('del');
var run = require('run-sequence');

gulp.task('build:public', function() {
  return gulp.src('src/public/**/*')
      .pipe(gulp.dest('dist'));
});

gulp.task('build:js', function() {
  return gulp.src('src/js/app.js')
      .pipe(babel())
      .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:public', 'build:js']);

gulp.task('clean', function() {
  return del('dist');
});

gulp.task('default', function(cb) {
  run(
    'clean',
    'build',
    cb
  );
});
