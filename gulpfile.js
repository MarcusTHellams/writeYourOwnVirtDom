var gulp = require('gulp'),
	babel = require('gulp-babel'),
	rename = require('gulp-rename'),
	webserver = require('gulp-webserver'),
	plumber = require('gulp-plumber');

gulp.task('babel', function() {
	return gulp.src('./public/app.jsx')
		.pipe(plumber({
			handleError: function(err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(babel({
			plugins: ['transform-react-jsx'],
			presets: ['es2015']
		}))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('./public'));
});

gulp.task('webserver', ['watch'], function() {
	gulp.src('public/')
		.pipe(webserver({
			livereload: true,
			open: true
		}));
});


gulp.task('watch', function() {
	gulp.watch('./public/app.jsx', ['babel']);
});