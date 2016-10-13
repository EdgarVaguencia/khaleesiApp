var path = require('path');
var gulp = require('gulp');
var _$ = require('gulp-load-plugins')();
var rsequence = require('run-sequence');

var srcCss = ['../chrome/css/estilos.css'];

gulp.task('clean:css', function() {
    return gulp.src(['./data/css/*.min.css'])
        .pipe(_$.clean());
});

gulp.task('min:css', ['clean:css'], function() {
    gulp.src(srcCss)
        .pipe(_$.csso())
        .pipe(_$.concat('estilos.min.css'))
        .pipe(gulp.dest('./data/css/'));
});

gulp.task('default', function() {
    rsequence('css:min');
});
