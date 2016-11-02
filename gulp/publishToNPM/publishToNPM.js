var gulp = require("gulp");
var gulpTs = require("gulp-typescript");
var gulpSourcemaps = require("gulp-sourcemaps");
var gulpConcat = require("gulp-concat");
var merge = require("merge2");
var path = require("path");
var addModuleExports = require("./addModuleExports");
var config = require("../common/config");

// var tsFilePaths = config.tsFilePaths;

var tsconfigFile = config.tsconfigFile;


var distPath = config.distPath;

gulp.task('publishToNPM', function() {
    // var tsResult = gulp.src(tsFilePaths)
    //     .pipe(gulpSourcemaps.init())
    //     .pipe(gulpTs({
    //         declarationFiles: false,
    //         target: 'ES5',
    //         //module: "commonjs",
    //         //moduleResolution: "node",
    //         experimentalDecorators: true,
    //         noEmitOnError: false,
    //         typescript: require('typescript')
    //     }));



    var tsProject = gulpTs.createProject(path.join(process.cwd(), tsconfigFile), {
        declarationFiles: false,
        target: 'ES5',
        //module: "commonjs",
        //moduleResolution: "node",
        experimentalDecorators: true,
        noEmitOnError: false,
        // out: "wdCb.debug.js",
        typescript: require('typescript')
    });

    var tsResult = tsProject.src()
        .pipe(gulpSourcemaps.init())
        .pipe(tsProject());

    //
    // return merge([
    //     tsResult.js
    //         .pipe(gulpSourcemaps.write())
    //         .pipe(gulp.dest("dist/"))
    // ])
    //
    //


    return  merge([
        tsResult.dts
            .pipe(gulpConcat('wdCb.node.d.ts'))
            .pipe(gulp.dest(distPath)),
        tsResult.js
            .pipe(gulpConcat('wdCb.node.js'))
            .pipe(addModuleExports("wdCb"))
            .pipe(gulpSourcemaps.write())
            .pipe(gulp.dest(distPath))
    ])
});

