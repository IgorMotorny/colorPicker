var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var removeLogs = require('gulp-removelogs');
var uglify = require('gulp-uglify');
// npm install --save-dev gulp-sass gulp-watch gulp-removelogs gulp-autoprefixer gulp-uglify gulp-connect

gulp.task('default', ['copy', 'connect', 'watch']);

gulp.task('copy', function () {

    gulp.src('js/**/*.js')
        .pipe(removeLogs())
        .pipe(gulp.dest('./dist/js'));

    gulp.src('./*.html')
        .pipe(gulp.dest('./dist/'));
    
    gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'));
     

});



gulp.task('scss', function () {

    gulp.src('./scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
     /*   .pipe(uncss({
             html: ['./dist/*.html']
         }))*/
        .pipe(gulp.dest('./dist/css'));

});

gulp.task('connect', function () {
    return connect.server({
        root: 'dist',
        livereload: true
    });

});

gulp.task('img', function () {
    return gulp.src(['./images/**/*.svg', './images/**/*.png', './images/**/*.jpg'])
        .pipe(gulp.dest('./dist/images'));
});


gulp.task('watch', function () {

    gulp.watch('./scss/**/*.scss', ['scss']);

    gulp.watch('./js/**/*.js', function () {
        return gulp.src('./js/**/*.js')
            .pipe(gulp.dest('./dist/js'));
    });



    gulp.watch(['./images/**/*.svg', './images/**/*.png', './images/**/*.jpg'], ['img']);

    gulp.watch('./*.html', function () {
        return gulp.src('./*.html')
            .pipe(gulp.dest('./dist/'));
    });

    gulp.watch(['./dist/**/*.*'], function () {
        return gulp.src('./dist/**/*.*')
            .pipe(connect.reload());
    });

});