var gulp = require('gulp');
var gulpTs = require('gulp-typescript');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpConcat = require('gulp-concat');
var del = require('del');
var gulpSync = require('gulp-sync')(gulp);
var merge = require('merge2');
var path = require('path');
var buildPublishFile = require("./gulp/publishToNPM/buildPublishFile");
var config = require("./gulp/common/config");

require("./gulp/publishToNPM/publishToNPM");

var tsFilePaths = config.tsFilePaths;
var distPath = config.distPath;

gulp.task('clean', function() {
    return del.sync([distPath], {
        force: true
    });
});

gulp.task('compileTs', function() {
    var tsResult = gulp.src(tsFilePaths)
        //.pipe(gulpSourcemaps.init())
        .pipe(gulpTs({
            declarationFiles: true,
            target: 'ES5',
            sortOutput:true,
            typescript: require('typescript')
        }));


    return  merge([
        tsResult.dts
            .pipe(gulpConcat('wdCb.d.ts'))
            .pipe(gulp.dest('dist')),
        tsResult.js
            .pipe(gulpConcat('wdCb.js'))
            //.pipe(gulpSourcemaps.write('./'))
            //.pipe(gulpSourcemaps.write())
            .pipe(gulp.dest('dist/'))
    ])
});


gulp.task('compileTsDebug', function() {
    var tsResult = gulp.src(tsFilePaths)
        .pipe(gulpSourcemaps.init())
        .pipe(gulpTs({
            declarationFiles: true,
            target: 'ES5',
            sortOutput:true,
            //noExternalResolve: true,
            noEmitOnError: true,
            typescript: require('typescript')
        }));


    return tsResult.js
            .pipe(gulpConcat('wdCb.debug.js'))
            .pipe(gulpSourcemaps.write())
            .pipe(gulp.dest('dist/'));
});



gulp.task("buildPublishFile", function(done){
    buildPublishFile();

    done();
});

gulp.task("build", gulpSync.sync(["clean", "compileTs", "compileTsDebug", "publishToNPM", "buildPublishFile"]));



var tsFilePaths = ["src/*.ts", "src/**/*.ts"];

gulp.task("watch", function(){
    gulp.watch(tsFilePaths, ["compileTsDebug"]);
});




var karma = require("karma").server;
var karmaConfPath = path.join(process.cwd(), "test/karma.conf.js");



gulp.task("test", function (done) {
    karma.start({
        configFile: karmaConfPath
    }, done);
});

