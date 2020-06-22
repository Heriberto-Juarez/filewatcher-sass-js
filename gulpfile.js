const gulp = require('gulp');
const del = require('del');
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const cleanCSS = require("gulp-clean-css");

/**
 * Path to node_modules folder and target path where the files will be copied to
 * target path in codeigniter 4 is in the public folder but since we are copying node modules or in other words
 * libraries, we want to have a custom folder, eg: lib
 * In that way the target path would be ./public/lib
 * Do not use ./public as your target path
 * */

const nodeRoot = './node_modules/';
const targetPath = './public/lib';

// Clean the target path (Delete everything in the folder)
gulp.task('clean-target', async function () {
    return del([targetPath + '/**/*']);
});

/**
 * Copy libraries from node_modules
 * Here you must specify specific files, in that way you only deploy the useful files only
 * */
gulp.task('copy-to-target', async function () {
    gulp.src(nodeRoot + "bootstrap/dist/js/*.min.js").pipe(gulp.dest(targetPath + "/bootstrap"));
    gulp.src(nodeRoot + "bootstrap/dist/css/*.min.css").pipe(gulp.dest(targetPath + "/bootstrap"));
});



const src = './src/';  //Path from the src code you write
const dest = './public/'; //The path can be your public dir because you usually place your folders there (js, css, ...)

//Compress the core javascript This will output: /public/js/core.js
//The file to be compressed must be located at ./src/js/yourFile.js
gulp.task("core-js", async () => {
    compress_js(gulp.src(src + "js/*.js").pipe(concat("core.js")));
});
/**
 * Compress individual files
 * Sometimes you want to separate your javascript files into several files
 * To create individual javascript files. You must have the next path /src/js/individual/
 * */
gulp.task("individual-js", async () => {
    compress_js(gulp.src(src + "js/individual/*.js"));
});

/**
 * Transform sass to css and minify it
 * Files in ./src/scss/ will be transformed into css
 * Files will also be minified and placed in: ./public/css/yourCSSFile.css
 * */
gulp.task("sass", async () => {
    gulp.src(src + "scss/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest + "css/"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(dest + "css/"))
    ;
});
/**
 * Watch the files
 * */
gulp.task('watch', async () => {
    gulp.watch(src + 'js/*.js', gulp.parallel('core-js'));
    gulp.watch(src + 'js/independent/*.js', gulp.parallel('independent-js'));
    gulp.watch(src + 'scss/*.scss', gulp.parallel('sass'));
});

/**
 * Function to compress js code
 * */
function compress_js(e) {
    e.pipe(gulp.dest(dest + "js"))
        .pipe(terser())
        .pipe(gulp.dest(dest + "js"))
}