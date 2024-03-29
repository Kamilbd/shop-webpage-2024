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

function errorHandler(err) {
	console.error(err.message);
	this.emit('end');
}

function sassCompiler(done) {
	src(paths.sass)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass().on('error', errorHandler))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
	done();
}

function javaScript(done) {
	src(paths.js)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
	done();
}

function convertImages(done) {
	src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest));
	done();
}

function handleKits(done) {
	src(paths.html).pipe(kit()).pipe(dest(paths.dist));
	done();
}

function cleanStuff(done) {
	src(paths.dist, { allowEmpty: true }).pipe(clean());
	done();
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	});
	done();
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload);
	watch([paths.html, paths.sass, paths.js], parallel(handleKits, sassCompiler, javaScript)).on('change', reload);
	watch(paths.img, convertImages).on('change', reload);
	done();
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

const mainFunctions = parallel(handleKits, sassCompiler, javaScript, convertImages, concatScripts, minifySlickJS);
exports.cleanStuff = cleanStuff;
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
