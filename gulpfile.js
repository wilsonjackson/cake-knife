/* jshint strict: false */

var gulp = require('gulp');
var rimraf = require('rimraf');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha-phantomjs');
var connect = require('gulp-connect');
var preprocess = require('connect-preprocess');
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
	rimraf(config.dist, cb);
});

gulp.task('lint', function () {
	return gulp.src([config.src + '/scripts/**/*.js', config.test + '/spec/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('error', console.error);
});

gulp.task('test', ['lint'], function () {
	return gulp.src(config.test + '/runner.html')
		.pipe(mocha())
		.on('error', console.error);
});

gulp.task('build', ['clean', 'test'], function () {
	return gulp.src(config.src + '/index.html')
		.pipe(usemin({
			js: [uglify(), rev()],
			css: [rev()]
		}))
		.pipe(gulp.dest(config.dist + '/'));
});

gulp.task('connect', function () {
	//noinspection JSUnusedGlobalSymbols
	connect.server({
		root: config.src,
		port: 9000,
		middleware: function (connect) {
			return [
				connect().use('/bower_components', connect.static('./bower_components')),
				connect().use(preprocess({root: config.src}, [
					{url: '/index.html', factories: [usemin.resolveGlobs]}
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

gulp.task('default', ['clean', 'lint', 'test', 'build']);
