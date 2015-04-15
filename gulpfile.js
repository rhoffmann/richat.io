var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber     = require('gulp-plumber');
var autoprefixer  = require('gulp-autoprefixer');
var notify      = require('gulp-notify');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');

var watch;

var DIST_DIR = './dist';
var SRC_DIR = './src';

var paths = {
  js: SRC_DIR + '/js/app.jsx',
  watchJs : SRC_DIR + '/**/*.js?',
};

function lintAllTheThings() {
  return gulp.src( paths.watchJs )
    .pipe(eslint({
      useEslintrc : true,
      globals: {
        '_' : true
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

function browserifyShare() {
  var b = browserify( paths.js, {
    debug: true,
    extensions: ['.jsx'],
    insertGlobalVars: true,
    cache: {},
    packageCache: {},
    fullPaths: false
    //transform: ["reactify", "browserify-shim"]
  });

  b.transform(
    babelify.configure({
      // optional: ["runtime"]
    })
  ).require(paths.js, {entry: true})

  if (watch) {
    b = watchify(b);

    b.on('update', function() {
      /*
      lintAllTheThings()
      .on('finish', function(){
        console.log('lint done');
        bundleShare(b)
      })
      .on('error', function (e){
        gutil.log('lint error ' + e.message);
      });*/
      bundleShare(b);
    });
  }

  b.on('log', gutil.log);

  return bundleShare(b);
}

function bundleShare(b) {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error' ))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true, sourceRoot: '/dist'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_DIR + '/js'))
    .pipe(gulpif(watch, reload({stream:true})));
}

gulp.task('scripts', function() {

  watch = false;
  return browserifyShare();

});


// FIXME: how to lint after watchify and bundle only after success
gulp.task('lint', function(){
  return lintAllTheThings();
});

gulp.task('jshint', function() {
  return gulp.src( paths.watchJs )
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {

  browserSync({
    server: {
      baseDir: "./"
    }
  });

  watch = true;
  browserifyShare();

  gulp.watch( paths.watchJs, ['lint']);
});

gulp.task('assets', function() {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));

  gulp.src('bower_components/react/react-with-addons.js')
    .pipe(gulp.dest('dist/js'));
})

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    //.pipe(preprocess({context: { dev: true }}))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('styles', function(){
  var styles = gulp.src(SRC_DIR + '/scss/app.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', '> 1%'))
    .on('error', notify.onError())
    .pipe(gulp.dest('dist/css'))

  return styles;

})

gulp.task('dist', ['scripts', 'styles', 'html', 'assets']);
gulp.task('default', ['watch']);
