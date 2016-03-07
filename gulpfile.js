var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    concat       = require('gulp-concat'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    rename       = require('gulp-rename'),
    minifyCSS    = require('gulp-minify-css'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    runSequence  = require('run-sequence'),
    shell        = require('gulp-shell'),
    sourcemaps   = require('gulp-sourcemaps'),
    stylus       = require('gulp-stylus'),
    uglify       = require('gulp-uglify');

var sourcePath = {
        jade:   'app/templates/',
        stylus: 'app/assets/styl/',
        js:     'app/assets/js/',
        img:    'app/assets/img/',
        fonts:  'app/assets/fonts/'
    },
    destPath = {
        html:  'public/',
        css:   'public/assets/css/',
        js:    'public/assets/js/',
        img:   'public/assets/img/',
        fonts: 'public/assets/fonts/'
    };

var reportError = function(error){
    notify.onError({
        title: 'Gulp Task Error',
        message: 'Check your console',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
};

gulp.task('jade', function() {
    gulp.src(sourcePath.jade + '**/!(_)*.jade')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(jade({ pretty: true }))
        .pipe(rename({ dirname: './' }))
        .pipe(gulp.dest(destPath.html))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('stylus', function() {
    gulp.src(sourcePath.stylus + 'main.styl')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(rename('main.css'))
        .pipe(gulp.dest(destPath.css))
        .pipe(rename('main.min.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destPath.css));
});

gulp.task('js', function() {
    gulp.src(sourcePath.js + '**/*.js')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destPath.js))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('img', function() {
    gulp.src(sourcePath.img + '**/*')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(destPath.img));
});

gulp.task('copyfonts', function() {
    gulp.src(sourcePath.fonts + '**/*.{ttf,otf,woff,woff2,eof,svg}')
        .pipe(gulp.dest(destPath.fonts));
});

gulp.task('browserSyncConfig', function() {
    browserSync.init({
        port: 6969,
        server: './public',
        notify: false,
        files: [
            destPath.css + '**/*.css'
        ]
    });
});

gulp.task('watch', function() {
    gulp.watch(sourcePath.jade + '**/*.jade', ['jade']);
    gulp.watch(sourcePath.stylus + '**/*.styl', ['stylus']);
    gulp.watch(sourcePath.js + '**/*.js', ['js']);
    gulp.watch(sourcePath.img + '**/*.{jpg,png,gif}', ['img']);
});

gulp.task('clean-build', function() {
    return del([
        destPath.html + '*.html',
        destPath.css + 'main.css',
        destPath.css + 'main.min.css',
        destPath.css + 'main.min.css.map',
        destPath.js + 'main.min.js',
        destPath.js + 'main.min.js.map',
        destPath.fonts + '*'
    ])
});

gulp.task('build', ['jade', 'stylus', 'js', 'img', 'copyfonts']);
gulp.task('re-build', function(callback) {
    runSequence('clean-build', ['build'], callback);
});

gulp.task('serve', ['browserSyncConfig', 'build', 'watch']);
gulp.task('default');