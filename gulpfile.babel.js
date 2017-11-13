'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import merge from 'merge-stream';
import sequence from 'gulp-sequence';
import del from 'del';

const paths = {
  styles: {
    src: 'src/static/styles/**/*.sass',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/static/scripts/**/*.js',
    commons: 'src/static/scripts/commons/**/*.js',
    pagescripts: 'src/static/scripts/pagescripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

const clean = () => del([ 'assets' ]);

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  var commons = gulp.src(paths.scripts.commons)
    .pipe(babel())
    //.pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));

  var pagescripts = gulp.src(paths.scripts.pagescripts)
    .pipe(babel())
    //.pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));

  return merge(commons, pagescripts);
}

function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

gulp.task('clean', clean);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watchFiles);

gulp.task('default', sequence(['clean'], ['styles', 'scripts'], 'watch'))
