var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var connect      = require('gulp-connect');
var clean        = require('gulp-clean');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin')
var jade         = require('gulp-jade');
var rename       = require('gulp-rename');
var minifyCSS    = require('gulp-minify-css');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');
var shell        = require('gulp-shell');
var sourcemaps   = require('gulp-sourcemaps');
var stylus       = require('gulp-stylus');
var uglify       = require('gulp-uglify');

var reportError = function(error){
    notify.onError({
        title: 'Gulp Task Error',
        message: 'Check your console',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
};

gulp.task('html', function() {
    gulp.src('app/**/!(_)*.jade')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(jade({ pretty: true }))
        .pipe(rename({ dirname: './' }))
        .pipe(gulp.dest('public'))
        .pipe(connect.reload())
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function() {
    gulp.src('app/assets/styl/main.styl')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(stylus())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(rename('main.css'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(rename('main.min.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(connect.reload())
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
    gulp.src('app/assets/js/**/*.js')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('images', function() {
    gulp.src('app/assets/img/**/*')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('public/assets/img'));
});

gulp.task('copyfonts', function() {
    gulp.src('app/assets/fonts/**/*.{ttf,otf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('connect', function() {
    connect.server({
        root: 'public',
        livereload: true
    });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.jade', ['html']);
    gulp.watch('app/assets/**/*.styl', ['css']);
    gulp.watch('app/assets/**/*.js', ['js']);
    gulp.watch('app/assets/**/*.{jpg,png,gif}', ['images']);
});

gulp.task('clean-build', function() {
    gulp.src([
        'public/assets/css/main.css',
        'public/assets/css/main.min.css',
        'public/assets/css/main.min.css.map',
        'public/assets/js/main.min.js',
        'public/assets/js/main.min.js.map',
        'public/assets/fonts/**/*.{ttf,woff,woff2,eof,svg}',
        'public/**/*.html',
    ])
        .pipe(clean());
});

gulp.task('build', ['html', 'css', 'js', 'images', 'copyfonts']);

gulp.task('re-build', function(callback) {
    runSequence('clean-build', ['build'], callback);
});

gulp.task('start', ['build', 'connect', 'watch']);
gulp.task('start-browser-sync', ['build', 'browser-sync', 'watch']);
gulp.task('default');