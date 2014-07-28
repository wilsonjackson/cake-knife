/* jshint strict: false */

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var through = require('through2');
var path = require('path');
var exec = require('child_process').exec;
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha-phantomjs');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var resourcePipeline = require('connect-resource-pipeline');
var htmlGlob = require('gulp-html-glob-expansion');
var sftp = require('gulp-sftp');

var config = {
	src: 'app',
	test: 'test',
	dist: 'dist',
	deploy: {
		host: 'euphoricsoup.com',
		user: 'magid',
		remotePath: '/home/magid/euphoricsoup.com/cake-knife'
	}
};

gulp.task('clean', function (cb) {
	del(config.dist, cb);
});

gulp.task('lint', function () {
	return gulp.src([config.src + '/scripts/**/*.js', config.test + '/spec/**/*.js'])
		.pipe(jshint())
		.on('error', console.error)
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
	return gulp.src(config.test + '/runner.html')
		.pipe(mocha())
		.on('error', function () {});
});

gulp.task('images', function () {
	return gulp.src([config.src + '/**/src/*.png'])
		.pipe(through.obj(function (file, enc, done) {
			var resized = file.clone();
			resized.path = path.join(path.dirname(path.dirname(file.path)), path.basename(file.path));
			exec('convert ' + file.path + ' -scale 400% ' + resized.path, function (err) {
				if (!err) {
					gutil.log(gutil.colors.magenta(file.relative), '->', gutil.colors.magenta(resized.relative));
				}
				done(err);
			});
		}));
});

gulp.task('compile', function () {
	return gulp.src(config.src + '/index.html')
		.pipe(usemin({
			js: [uglify(), rev()],
			css: [rev()]
		}))
		.pipe(gulp.dest(config.dist + '/'));
});

gulp.task('assets', function () {
	var assets = [
			config.src + '/assets/**/*',
			'!' + config.src + '/**/src/*',
			'!' + config.src + '/**/src'
		];
	return gulp.src(assets, {base: config.src + '/'})
		.pipe(gulp.dest(config.dist + '/'));
});

gulp.task('build', function (cb) {
	runSequence('clean', 'lint', 'test', ['compile', 'assets'], cb);
});

gulp.task('connect', function () {
	//noinspection JSUnusedGlobalSymbols
	connect.server({
		root: config.src,
		port: 9000,
		middleware: function (connect) {
			return [
				connect().use('/bower_components', connect.static('./bower_components')),
				connect().use(resourcePipeline({root: config.src}, [
					{url: '/index.html', factories: [htmlGlob]}
				]))
			];
		}
	});
});

gulp.task('serve', ['connect'], function () {
	gulp.watch([config.src + '/scripts/**/*.js', config.test + '/spec/**/*.js'], ['test']);
});

gulp.task('deploy', ['build'], function () {
	return gulp.src('dist/**/*')
		.pipe(sftp(config.deploy));
});

gulp.task('default', ['build']);
