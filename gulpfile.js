const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const stylefmt = require('stylefmt');
const purify = require('gulp-purifycss');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const babel = require('gulp-babel');


// Static Server + watching scss/html files
gulp.task('serve', ['js', 'sass'], function () {

  browserSync.init({
    server: './'
  });

  gulp.watch('./src/*.js', ['js']);
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./index.html').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  const plugins = [
    autoprefixer({ browsers: ['defaults'] }),
    cssnano({
      discardComments: { removeAll: true }
    }),
    stylefmt,
  ];
  return gulp.src('src/*.scss')
    .pipe(sass())
    .pipe(purify(['./js/*.js', './*.html']))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Compile ES6
gulp.task('js', () =>
  gulp.src('src/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream())
);

gulp.task('default', ['serve']);
