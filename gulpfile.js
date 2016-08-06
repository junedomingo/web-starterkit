var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    concat       = require('gulp-concat'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pug         = require('gulp-pug'),
    rename       = require('gulp-rename'),
    minifyCSS    = require('gulp-minify-css'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    gulpSequence = require('gulp-sequence'),
    shell        = require('gulp-shell'),
    sourcemaps   = require('gulp-sourcemaps'),
    stylus       = require('gulp-stylus'),
    uglify       = require('gulp-uglify');

var sourcePath = {
        pug:   'app/templates/',
        stylus: 'app/assets/styl/',
        js:     'app/assets/js/',
        img:    'app/assets/img/',
        fonts:  'app/assets/fonts/',
        lib:  'app/assets/lib/'
    },
    destPath = {
        html:  'public/',
        css:   'public/assets/css/',
        js:    'public/assets/js/',
        img:   'public/assets/img/',
        fonts: 'public/assets/fonts/',
        lib: 'public/assets/lib/'
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

gulp.task('pug', function() {
    gulp.src(sourcePath.pug + '**/!(_)*.pug')
        .pipe(plumber({ errorHandler: reportError }))
        .pipe(pug({ pretty: true }))
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

gulp.task('copyFonts', function() {
    gulp.src(sourcePath.fonts + '**/*.{ttf,otf,woff,woff2,eof,svg}')
        .pipe(gulp.dest(destPath.fonts));
});

gulp.task('copyLib', function() {
    gulp.src(sourcePath.lib + '**/*')
        .pipe(gulp.dest(destPath.lib));
});

gulp.task('browserSyncConfig', function() {
    browserSync.init({
        port: 8080,
        server: './public',
        notify: false,
        files: [
            destPath.css + '**/*.css'
        ]
    });
});

gulp.task('watch', function() {
    gulp.watch(sourcePath.pug + '**/*.pug', ['pug']);
    gulp.watch(sourcePath.stylus + '**/*.styl', ['stylus']);
    gulp.watch(sourcePath.js + '**/*.js', ['js']);
    gulp.watch(sourcePath.img + '**/*.{jpg,png,gif}', ['img']);
    gulp.watch(sourcePath.fonts + '**/*.{ttf,otf,woff,woff2,eof,svg}', ['copyFonts']);
});

gulp.task('clean-build', function() {
    return del([
        destPath.html + '*.html',
        destPath.css + 'main.css',
        destPath.css + 'main.min.css',
        destPath.css + 'main.min.css.map',
        destPath.js + 'main.min.js',
        destPath.js + 'main.min.js.map',
        destPath.fonts + '*',
        destPath.img + '*',
        destPath.lib + '*'
    ])
});

gulp.task('build', ['pug', 'stylus', 'js', 'img', 'copyFonts', 'copyLib']);
gulp.task('re-build', gulpSequence(['clean-build','build']));

gulp.task('serve', ['browserSyncConfig', 'build', 'watch']);
gulp.task('default');