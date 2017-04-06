"use strict"

var gulp       		 = require('gulp'),
	gulpConcat 		 = require('gulp-concat'),
	gulpSass   		 = require('gulp-sass'),
	gulpAutoprefixer = require('gulp-autoprefixer'),
	cleanCSS 		 = require('gulp-clean-css'),	
	bSync    	     = require('browser-sync').create(),
	unCSS			 = require('gulp-uncss'), // ! удаляет нужные стили
	uglifyJS         = require('gulp-uglify'),
	wiredep          = require('wiredep').stream,
	useref           = require('gulp-useref'),
	clean            = require('gulp-clean'),
	sftp			 = require('gulp-sftp'),
	gulpif           = require('gulp-if');


 
// CSS 
gulp.task('toCSS', function () {
  return gulp.src('app/sass/*.sass')
    .pipe(gulpSass.sync().on('error', gulpSass.logError)) // from SASS to CSS
    // .pipe(gulpConcat('style.css')) //concat CSS
    .pipe(gulpAutoprefixer({  // autoprefixer
            browsers: ['last 10 versions', 'ie 9'],
            cascade: false
        })) 
    .pipe(gulp.dest('app/css'))
    .pipe(bSync.stream());
})


// START WATCH
gulp.task('default', ['toCSS'], function() {

    bSync.init({
        server: "./app",
        notify: false
    });

    gulp.watch('app/sass/*.sass', ['toCSS']);
    gulp.watch('app/js/*.js')
    gulp.watch("app/*.html").on('change', bSync.reload);
});

// WIREDEP добавление библиотек

gulp.task('libs', function () {
  gulp.src('app/index.html')
    .pipe(wiredep({
      directory: "app/libs"
    }))
    .pipe(gulp.dest('app/'));
});

// BUILD

gulp.task('build', ['clean'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglifyJS()))
        // .pipe(gulpif('*.css', unCSS({
        //     html: ['dist/index.html'] 
        // })))
        .pipe(gulpif('*.css', cleanCSS({compatibility: 'ie9'})))
        .pipe(gulp.dest('dist'));
});

// CLEAN

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
 
// Выгрузка на сервер 
gulp.task('sftp', function () {
    return gulp.src('src/*')
        .pipe(sftp({
            host: 'website.com',
            user: 'johndoe',
            pass: '1234'
        }));
});