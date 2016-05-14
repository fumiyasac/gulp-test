//必要なモジュールを読み込む
var gulp     = require('gulp');
var sass     = require('gulp-sass');
var plumber  = require('gulp-plumber');
var csslint  = require('gulp-csslint');
var htmlhint = require('gulp-htmlhint');
var browser  = require('browser-sync');

//ローカルサーバーを立ち上げるタスク
gulp.task('server', function() {
    browser({
        server: {baseDir: "./src"}
    });
});

//scssファイルをcssファイルに変換するタスク
gulp.task('sass', function() {
    gulp.src('./assets/scss/**/*.scss')
        .pipe(plumber()) //scssのエラー発生でも止まらないようにする
        .pipe(sass({outputStyle:'expanded'}))
        .pipe(gulp.dest('./src/css'));
});

//cssの文法チェックを行うタスク
gulp.task('css', function() {
    gulp.src('./src/css/**/*.css')
        .pipe(csslint()) //実際に処理を行う
        .pipe(csslint.reporter());
});

//htmlの文法チェックを行うタスク
gulp.task('html', function() {
    gulp.src('./src/**/*.html')
        .pipe(htmlhint()) //実際に処理を行う
        .pipe(htmlhint.reporter());
});

//scssファイル変更時に実行するタスク(デフォルトに追加)
gulp.task('sass-watch', ['sass'], function() {
    var watcher = gulp.watch('./assets/scss/**/*.scss', ['sass']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//cssファイル変更時に実行するタスク(デフォルトに追加)
gulp.task('css-watch', ['css'], function() {
    var csslint = gulp.watch('./src/css/**/*.css', ['css']);
    csslint.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//htmlファイル変更時に実行するタスク(デフォルトに追加)
gulp.task('html-watch', ['html'], function() {
    var htmlhint = gulp.watch('./src/**/*.html', ['html']);
    htmlhint.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//デフォルトで実行されるタスク
gulp.task('default', ['server', 'sass-watch', 'css-watch', 'html-watch']);
