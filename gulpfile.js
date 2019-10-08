const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const del = require('del');

const htmlminOptions = {
  collapseWhitespace: true,
  removeComments: true,
};

const reload = (done) => {
  browserSync.reload();
  done();
};

gulp.task('html', () => {
  return gulp.src('./src/*.html')
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', () => {
  return gulp.src('./src/css/*.css')
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', () => {
  return gulp.src('./src/js/*.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('favicon', () => {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sync', () => {
  browserSync.init({
    server: { baseDir: './dist/' },
  });
});

gulp.task('watch', () => {
  gulp.watch('./src/*.html', gulp.series('html', (done) => { reload(done); }));
  gulp.watch('./src/css/*.css', gulp.series('styles', (done) => { reload(done); }));
  gulp.watch('./src/js/*.js', gulp.series('scripts', (done) => { reload(done); }));
});

gulp.task('clean', () => del(['dist']));
gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'html', 'favicon'));
gulp.task('dev', gulp.parallel('favicon', 'sync', 'watch'));
