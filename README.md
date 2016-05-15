# タスクランナー(Gulp)に関するメモ

### このサンプルの目的

node.js + Gulpを使ったフロントエンドの作業効率化をするためのサンプルです。

### 1.導入

__（node.jsインストール）__

まずはここからnode.jsのインストールをしてください。  
インストーラーを立ち上げてぽちぽち進んでいけばOKです。  
http://qiita.com/krtbk1d/items/9001ae194571feb63a5e

※ WindowsでGulpを使用する際は「コマンドプロンプト」・Macでは「ターミナルやiTerm」を使用してください。

### 2.タスクランナーとは？

必要な処理を自動でしてくれるようにするものの総称。

+ 自動でやってくれるツールの総称
+ node.jsで動くもので人気があるのは「Gulp」・「Grunt」の2つ
+ 他にもRuby製の「Middleman」もある

__（参考）__   
http://migo-media.com/tool/

__（その他）__   
まだまだ歴史が浅い(2009年ぐらい？)けれどもフロンドエンド界隈ではよく使用されています。

### 3.Gulpのメリット

フロントエンド作業（CSS・JSのコーディング）の効率化をするためのプラグインが用意されています。   
様々な便利プラグインやパッケージを利用してよりパワーアップして効率化が見込めます。

+ PCでローカルサーバーを立ち上げる
+ sass・coffeescript等のコンパイル
+ minify（圧縮）やlint（文法チェック）をする

__（Gulp導入コマンド）__   

```
//package.jsonの作成
$ npm init

//Gulpをグローバルインストール
$ npm install gulp -g

//Gulpをローカルインストール
$ npm install gulp --save-dev

//Gulpのバージョン確認
$ gulp -v

//新しくGulpfileを作成
$ touch gulpfile.js
```

gulpfile.js内にタスクを色々node.jsで記述していきます。   

※ package.jsonの作成時に色々聞かれると思いますが特にEnter連打でOK   
※ package.jsonにgulpのバージョンが記載されるので次回からは`$ npm install`コマンドを実行するだけでOK(このリポジトリをクローンした際も同様)   

__（参考）__   
http://daily.fumopan.com/2016/01/04/2593

__（その他）__   
・今さら聞けないフロントエンドタスクランナー   
http://qiita.com/syunk38/items/1e4ae893e78c3585dd07

### 4.SCSSを使ってCSSの作成を効率化する

Sassとは「Syntactically Awesome Style Sheets」の略   
※ CSSと共存可能な「.scss」を使用しています。   

__（SCSSに関しての部分はこちら）__   
・それほど便利ではないSass（SCSS）について語る   
https://tukumemo.com/sass-not-really/
・Sass(scss)の簡単な使い方まとめ   
http://designup.jp/sass-compass-install-86/
・Sass（SCSS）は難しくないよ！私なりの使い方をご紹介！   
http://www.tam-tam.co.jp/tipsnote/html_css/post5189.html

+ [gulp-sass](https://www.npmjs.com/package/gulp-sass)
+ [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)

__（scssをcssへ変換するためのプラグインをインストール）__   

```
//gulp-scssのインストール
$ npm install gulp-sass --save-dev

//gulp-plumberのインストール
$ npm install gulp-plumber --save-dev
```

__（scssをcssへ変換するためのタスクを記述）__   
scssをcssに変換するタスクをgulpfile.jsに記述します。   

```
//必要なモジュールを読み込む
var gulp     = require('gulp');
var sass     = require('gulp-sass');
var plumber  = require('gulp-plumber');

//scssファイルをcssファイルに変換するタスク
gulp.task('sass', function() {
    gulp.src('./assets/scss/**/*.scss')
        .pipe(plumber()) //scssのエラー発生でも止まらないようにする
        .pipe(sass({outputStyle:'expanded'}))
        .pipe(gulp.dest('./src/css'));
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

//デフォルトで実行されるタスク
gulp.task('default', ['sass-watch']);
```

`$ gulp`でGulpを実行すると作成したscssがcssに変換されます。   

__（参考）__   
・gulpでsassをコンパイルするタスクを作る   
http://yutapon.hatenablog.com/entry/2014/09/11/100000

### 5.HTML・CSSの文法チェックを行う

HTMLやCSSの記述が正しいかを検証するためのプラグインを入れて正しく記述できているかのチェックを行うプラグインを活用してみましょう。   
またGulpを立ち上げた際にローカルサーバーを立ち上げるプラグインも一緒に導入します。   

+ [gulp-csslint](https://www.npmjs.com/package/gulp-csslint)
+ [gulp-htmlhint](https://www.npmjs.com/package/gulp-htmlhint)
+ [browser-sync](https://www.npmjs.com/package/browser-sync)

__（HTML・CSSの文法チェック＆ローカルサーバー起動をするためのプラグインをインストール）__  

```
//gulp-csslintのインストール
$ npm install gulp-csslint --save-dev

//gulp-htmlhintのインストール
$ npm install gulp-htmlhint --save-dev

//browser-syncのインストール
$ npm install browser-sync --save-dev
```

__（今回のタスクを記述）__   
準備ができたら各タスクをgulpfile.jsに記述します。   

```
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
```

これでscss/css/htmlを修正した際に文法チェックができるようになりました。   
また`$ gulp`を実行した際にブラウザーが立ち上がるのでこれで検証もできます。   

__（参考）__   
・スマホでも使える！パフォーマンスアップの為のCSS記述方法   
http://all-web-blog.blogspot.jp/2011/07/css.html
・【保存版】クオリティアップ！gulp.jsで文法チェック！   
http://www.web-genba.com/entry/2015/05/28/003000

### Appendix.その他Gulpに関しての有益な情報まとめ

今回ピックアップしたものに関してはタスクランナーの結構ポピュラーなものですが、色々とプラグインや組み合わせ方を工夫すれば色々カスタマイズできるので下記の情報等を参考にして頂ければ幸いです。

（いろいろ知っていると便利かもしれないgulpのプラグインたち）   
・gulp.js その4 プラグイン一覧   
http://qiita.com/oreo3@github/items/0f037e7409be02336cb9

（gulpでの製作効率化に関してもっともっと深堀りしたい参考資料）   
・Gulp.js入門 – コーディングを10倍速くする環境を作る方法まとめ   
http://liginc.co.jp/web/tutorial/117900

（Scssに関してもっともっと知りたい場合はこちら）   
・とほほのSass入門   
http://www.tohoho-web.com/ex/sass.html

（JavaScriptの構文エラーを検知する）   
・JSHint使ってますか？JavaScriptをコンパイルで構文エラーを見つけてくれる！JSの精度を上げていこう！   
http://maplesystems.co.jp/blog/programming/9609.html
