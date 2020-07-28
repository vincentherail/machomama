/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2019 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.8-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp                      = require('gulp'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-sass'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      browserSync               = require('browser-sync').create(),

      src_folder                = './src/',
      src_assets_folder         = src_folder + 'static/',
      dist_assets_folder        = src_assets_folder + 'dist/';


gulp.task('sass', () => {
  return gulp.src([
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});


gulp.task('js', () => {
  return gulp.src( [ 
    src_assets_folder + 'js/**/*.js' ], { since: gulp.lastRun('js') })
    .pipe(plumber())
    .pipe(webpack({
      mode: 'development'
    }))
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: [
          [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["last 2 versions"],
                }
            }
          ]
        ],
      }))
      .pipe(concat('script.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('dev', gulp.series('sass', 'js'));

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: [ 'src' ]
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  gulp.watch(src_assets_folder + 'scss/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
  gulp.watch(src_assets_folder + 'js/**/*.js', gulp.series('js')).on('change', browserSync.reload);
  gulp.watch(src_folder + '**/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('serve', 'watch'));
