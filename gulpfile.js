var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var watch;
var DIST_DIR = './dist';
var SRC_DIR = './src';

var paths = {
  entryJS: SRC_DIR + '/js/app.jsx',
  watchJS : SRC_DIR + '/**/*.js?',
};

function lintAllTheThings() {
  return gulp.src( paths.watchJS )
    .pipe(g.eslint({
      useEslintrc : true,
      globals: {
        '_' : true
      }
    }))
    .pipe(g.eslint.format())
    .pipe(g.eslint.failOnError());
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
      optional: ["runtime"]
    })
  )
  .require(paths.entryJS, {entry: true})

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

  b.on('log', g.util.log);

  return bundleShare(b);
}

function bundleShare(b) {
  return b.bundle()
    .on('error', g.util.log.bind(g.util, 'Browserify Error' ))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(g.sourcemaps.init({loadMaps: true, sourceRoot: '/dist'}))
    .pipe(g.uglify())
    .pipe(g.sourcemaps.write('./'))
    // TODO: rev
    .pipe(gulp.dest(DIST_DIR + '/js'))
    .pipe(g.if(watch, reload({stream:true})));
}

gulp.task('scripts', function() {

  watch = false;
  return browserifyShare();

});


// FIXME: how to lint after watchify and bundle only after success
gulp.task('lint', function(){
  return lintAllTheThings();
});

gulp.task('watch', function() {
  browserSync({
    server: {
      baseDir: "./dist/"
    }
  });

  watch = true;
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
    .pipe(gulp.dest('dist/css'))

  return styles;

})

gulp.task('publish', function() {

  // create a new publisher
  var publisher = g.awspublish.create({
    "bucket": "richat.io",
    "region": "eu-west-1"
  });

  // define custom headers
  var headers = {
  //   'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./dist/**/*')

     // gzip, Set Content-Encoding headers and add .gz extension
    //.pipe(awsPublish.gzip({ ext: '.gz' }))

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))

    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())

     // print upload updates to console
    .pipe(g.awspublish.reporter());
});


gulp.task('deploy', ['dist', 'publish']);
gulp.task('dist', ['scripts', 'styles', 'html', 'assets']);
gulp.task('default', ['watch']);
