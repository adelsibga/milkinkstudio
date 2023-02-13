'use strict'

const {src, dest} = require('gulp')
const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const removeComments = require('gulp-strip-css-comments')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const gcmq = require('gulp-group-css-media-queries')
const sourcemaps = require('gulp-sourcemaps') // TODO: sourcemaps для js
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const nunjucks = require('gulp-nunjucks')
const imagemin = require('gulp-imagemin')
const del = require('del')
const notify = require('gulp-notify')
const rigger = require('gulp-rigger')
const browserSync = require('browser-sync').create()

const srcPath = 'src/'
const buildPath = 'build/'

const path = {
    build: {
        html: buildPath,
        css: buildPath + 'css/',
        js: buildPath + 'js/',
        images: buildPath + 'images/',
        fonts: buildPath + 'fonts/'
    },
    src: {
        html: srcPath + '*.html',
        css: srcPath + 'scss/**/*.scss',
        js: srcPath + 'js/**/*.js',
        images: srcPath + 'images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
        fonts: srcPath + 'fonts/**/*.{eot.woff,woff2,ttf,svg}'
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'scss/**/*.scss',
        js: srcPath + 'js/**/*.js',
        images: srcPath + 'images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
        fonts: srcPath + 'fonts/**/*.{eot.woff,woff2,ttf,svg}'
    },
    clean: './' + buildPath
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './' + buildPath,
            open: false
        }
    })
}

function html() {
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(nunjucks.compile())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css, {base: srcPath + 'scss/'})
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: 'SCSS',
                    subtitle: 'Error',
                    message: 'Error: <%= error.message %>',
                    sound: 'Beep'
                })(err)
                this.emit('end')
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(gcmq())
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(sourcemaps.init())
        .pipe(cssnano({
            zIndex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function js() {
    return src(path.src.js, {base: srcPath + 'js/'})
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: 'JS',
                    subtitle: 'Error',
                    message: 'Error: <%= error.message %>',
                    sound: 'Beep'
                })(err)
                this.emit('end')
            }
        }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function images() { // TODO: configure images compression
    return src(path.src.images, {base: srcPath + 'images/'})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 80, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(path.build.images))
        .pipe(browserSync.stream())
}

function fonts() {
    return src(path.src.fonts, {base: srcPath + 'fonts/'})
        .pipe(browserSync.stream())
}

function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts))
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch
