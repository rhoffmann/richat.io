var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var karma = require('karma');
var reload = browserSync.reload;

var WATCH = false;
var DIST_DIR = './dist';
var SRC_DIR = './src';

var paths = {
  entryJS: SRC_DIR + '/js/app.js',
  watchJS : SRC_DIR + '/js/**/*.{js,jsx}',
};

function lintAllTheThings(ids) {
  return gulp.src( ids || paths.watchJS )
    .pipe(g.eslint())
    .pipe(g.eslint.format())
    .pipe(g.eslint.failOnError())
    .on('error', g.notify.onError('LINT ERRORS: <%= error.message %>'));
}

function browserifyShare() {
  var b = browserify({
    debug: true,
    extensions: ['.jsx'],
    insertGlobalVars: true,
    cache: {},
    packageCache: {},
    fullPaths: false
  })
  .transform(
    babelify.configure({
      optional: ["runtime", "es7.asyncFunctions"]
    })
  )
  .require(paths.entryJS, {entry: true});

  if (WATCH) {
    b = watchify(b);

    b.on('update', function(ids) {
      // FIXME: watchify needs to rebundle, but gets stuck on lint errors
      // so i disabled eslint.failOnError() for WATCH tasks, the bundle will
      // recompile on failing lints
      lintAllTheThings(ids)
      bundleShare(b);
    });
  }

  b.on('log', g.util.log);

  return bundleShare(b);
}

function bundleShare(b) {
  return b.bundle()
    .on('error', g.util.log.bind(g.util, 'Browserify Error' ))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(g.sourcemaps.init({loadMaps: true, sourceRoot: '/dist/'}))
    .pipe(g.uglify())
    .pipe(g.sourcemaps.write('./'))
    // TODO: rev
    .pipe(gulp.dest(DIST_DIR + '/js'))
    .pipe(g.if(WATCH, reload({ stream: true })));
}

gulp.task('scripts', ['lint'], function() {
  WATCH = false;
  return browserifyShare();
});

gulp.task('lint', function(){
  return lintAllTheThings();
});

gulp.task('watch', ['lint'], function() {
  browserSync({
    server: {
      baseDir: "./dist/"
    }
  });

  WATCH = true;
  browserifyShare();
});

gulp.task('assets', function() {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));

});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    //.pipe(preprocess({context: { dev: true }}))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('styles', function(){
  var styles = gulp.src(SRC_DIR + '/scss/app.scss')
    .pipe(g.plumber())
    .pipe(g.sass())
    .pipe(g.autoprefixer('last 2 version', '> 1%'))
    .on('error', g.notify.onError())
    .pipe(gulp.dest('dist/css'));

  return styles;

});

gulp.task('test', function(done) {
  karma.runner.run({port: 9876}, function(exitCode) {
    if (exitCode) return done('Karma tests failed');
    return done();
  });
});

gulp.task('publish-aws', function() {

  var publisher = g.awspublish.create({
    "bucket": "richat.io",
    "region": "eu-west-1"
  });

  var headers = {
     'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./dist/**/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(g.awspublish.reporter());
});


gulp.task('deploy', ['dist', 'publish-aws']);
gulp.task('dist', ['scripts', 'styles', 'html', 'assets']);
gulp.task('default', ['watch']);
