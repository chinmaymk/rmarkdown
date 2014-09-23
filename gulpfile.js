var gulp = require('gulp');
var uglify = require("gulp-uglify");
var watch = require('gulp-watch');
var rename = require('gulp-rename');

// task
gulp.task('build', function() {
  gulp.src('./src/*.js') // path to your files
  .pipe(uglify())
    .pipe(rename('rmarkdown.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  watch('./src/*.js', function() {
    gulp.start('build');
  });
});