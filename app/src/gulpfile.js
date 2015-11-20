'use strict';

var gulp = require('gulp');
var _$ = require('gulp-load-plugins')();
var packager = require('electron-packager');

const SrcJs = ['./js/index.js', './js/models/*.js', './js/collections/*.js', './js/views/*.js', './js/routers/*.js', './js/main.js'];

/* Scripts */
gulp.task('scripts', function() {
  gulp.src(SrcJs)
  .pipe(_$.concat('app.js'))
  .pipe(gulp.dest('./js/'))
  // Minify
  .pipe(_$.uglify())
  .pipe(_$.concat('app.min.js'))
  .pipe(gulp.dest('./js/'));
});

gulp.task('js', ['scripts']);

/* Stylus  */
gulp.task('stylus', function() {
  gulp.src('./css/estilos.styl')
    .pipe(_$.stylus())
    .pipe(_$.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css/'))
    // Minify
    .pipe(_$.csso())
    .pipe(_$.concat('estilos.min.css'))
    .pipe(gulp.dest('./css/'));
});

/* Watch */
gulp.task('watch', function() {
  gulp.watch('./css/*.styl', ['stylus']);
  gulp.watch(SrcJs, ['js']);
});

/* Build */
gulp.task('clean', function() {
  return gulp.src('../build/', {read: false })
  .pipe(_$.clean({ force: true }));
});

gulp.task('build', ['clean'], function() {
  return packager({
    'dir': './',
    'name': 'Khaleesi-App',
    'version': '0.34.3',
    'all': true,
    'app-version': '0.1.0',
    'out': '../build/',
    'ignore': ['/js/(collections|models|routers|views|app.js|index.js|main.js)', '/css/(estilos.css|estilos.styl)', '/node_modules/(gulp|gulp-*|.bin)', '/gulpfile.js']
  }, function done(err, path){ if(err){ console.error(err); }else{ console.log(path); } });
});