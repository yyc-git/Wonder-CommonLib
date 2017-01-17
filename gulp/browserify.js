var gulp = require("gulp");
var gulpBrowserify = require("gulp-browserify");

function browserify(wdFilePath, distPath) {
    return gulp.src(wdFilePath)
        .pipe(gulpBrowserify({
            basedir: distPath,
            insertGlobals:true,
            bare:true,
            standalone:"wd"
        }))
        .pipe(gulp.dest(distPath));
}


module.exports = {
    browserify: browserify
};
