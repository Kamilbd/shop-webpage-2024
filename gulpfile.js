const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const kit = require('gulp-kit');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const gulpConcat = require('gulp-concat');

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/**/*',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
};

function sassCompiler() {
	return src(paths.sass)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
}

function javaScript() {
	return src(paths.js)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
}

function convertImages() {
	return src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest));
}

function handleKits() {
	return src(paths.html).pipe(kit()).pipe(dest(paths.dist));
}

function cleanStuff() {
	return src(paths.dist, { allowEmpty: true }).pipe(clean());
}

function startBrowserSync() {
	browserSync.init({
		server: {
			baseDir: './',
		},
	});
}

function watchForChanges() {
	watch('./*.html').on('change', reload);
	watch([paths.html, paths.sass, paths.js], series(handleKits, sassCompiler, javaScript)).on('change', reload);
	watch(paths.img, convertImages).on('change', reload);
}

function concatScripts() {
	return src(['node_modules/slick-carousel/slick/slick.min.js']).pipe(gulpConcat('slick.js')).pipe(dest('dist/js'));
}

function minifySlickJS() {
	return src('node_modules/slick-carousel/slick/slick.js')
		.pipe(uglify())
		.pipe(rename('slick.min.js'))
		.pipe(dest('dist/js'));
}

exports.build = series(
	cleanStuff,
	parallel(handleKits, sassCompiler, javaScript, convertImages, concatScripts, minifySlickJS)
);
exports.default = series(exports.build, startBrowserSync, watchForChanges);
