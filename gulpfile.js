var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var uglify = require('gulp-uglify');
var sourcemaps = require("gulp-sourcemaps");
var gutil = require('gulp-util');
var watchify = require("watchify");


function scripts(watch) {
	var bundler, rebundle;

	var bundler = browserify({
		entries: ["./app/Booter.jsx"],
		extensions: [".js", ".jsx"],
		debug: true,
		cache: {}, // required for watchify
		packageCache: {}, // required for watchify
		fullPaths: watch // required to be true only for watchify
	});

	if (watch) {
		bundler = watchify(bundler);
	}

	bundler.transform(babelify);

	rebundle = function() {
		gutil.log('Building...');

		var stream = bundler.bundle();
		var start = new Date().getTime();

		stream.on('error', function(error) {
			gutil.log(error.message);
		});

		stream = stream.pipe(source('application.js'));
		return stream.pipe(gulp.dest('./dist/assets/scripts/')).on('end', function() {
			gutil.log('Finished after', gutil.colors.magenta(new Date().getTime() - start, 'ms'));
		});
	};

	bundler.on('update', rebundle);
	return rebundle();
}

gulp.task('scripts', function() {
	return scripts(false);
});

gulp.task('watchScripts', function() {
	return scripts(true);
});