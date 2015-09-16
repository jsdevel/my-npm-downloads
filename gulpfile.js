var browserify = require('browserify');
var babelify = require('babelify');
var es = require('event-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var resolve = path.resolve;
var del = require('del');
var run = require('run-sequence');
var source = require('vinyl-source-stream');

gulp.task('build:public', function() {
  return gulp.src('src/public/**/*')
      .pipe(gulp.dest('dist'));
});

gulp.task('build:js', function(done) {
    browserify({
      entries: './src/js/app.js',
      debug: true
    })
    .transform(babelify)
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist'))
    .pipe(es.wait(done));
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
