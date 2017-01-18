var gulp = require("gulp");
var gulpTs = require("gulp-typescript");
var gulpSourcemaps = require("gulp-sourcemaps");
var gulpConcat = require("gulp-concat");
var del = require("del");
var gulpSync = require("gulp-sync")(gulp);
var merge = require("merge2");
var path = require("path");
var through = require("through-gulp");
var fs = require("fs-extra");


var addModuleExports = require("./lib/inner/Wonder-Package/build/gulp_task/package/addModuleExports").addModuleExports;
var browserify = require("./lib/inner/Wonder-Package/build/gulp_task/package/browserify").browserify;
var addModuleNameConverter = require("./lib/inner/Wonder-Package/build/gulp_task/package/addModuleNameConverter").addModuleNameConverter;


var config = require("./gulp/common/config");


var tsFilePaths = config.tsFilePaths;
var distPath = config.distPath;
var definitionsPath = config.definitionsPath;
var tsconfigFile = config.tsconfigFile;
var filePath = path.join(distPath, "wdCb.js");
var dtsFilePath = path.join(distPath, "wdCb.d.ts");


gulp.task('clean', function() {
    return del.sync([distPath], {
        force: true
    });
});



gulp.task("compileTs", function() {
    var tsProject = gulpTs.createProject(path.join(process.cwd(), tsconfigFile), {
        declaration: true,
        noEmitOnError: false,
        typescript: require('typescript')
    });

    var tsResult = tsProject.src()
        .pipe(tsProject());


    return merge([
        tsResult.dts
            .pipe(gulpConcat("wdCb.d.ts"))
            .pipe(gulp.dest("dist")),
        tsResult.js
            .pipe(gulpConcat("wdCb.js"))
            .pipe(gulp.dest("dist/"))
    ])
});

gulp.task("compileTsDebug", function() {
    var tsProject = gulpTs.createProject(path.join(process.cwd(), tsconfigFile), {
        out: "wdCb.debug.js",
        typescript: require('typescript')
    });

    var tsResult = tsProject.src()
        .pipe(gulpSourcemaps.init())
        .pipe(tsProject());


    return merge([
        tsResult.js
            .pipe(gulpSourcemaps.write())
            .pipe(gulp.dest("dist/"))
    ])
});


gulp.task("addModuleExports", function(done){
    addModuleExports(filePath, "wdCb");

    done();
});

gulp.task("browserify", function() {
    return browserify(filePath, distPath, "wdCb");
});

gulp.task("addNodejsVersion", function(done){
    fs.copySync(filePath, path.join(distPath, "wdCb.node.js"));

    var nodeDtsFilePath = path.join(distPath, "wdCb.node.d.ts");

    fs.copySync(dtsFilePath, nodeDtsFilePath);

    addModuleNameConverter(nodeDtsFilePath, "wdCb", "wdcb");

    done();
});



gulp.task("build", gulpSync.sync(["clean", "compileTs", "compileTsDebug", "addModuleExports", "addNodejsVersion", "browserify"]));



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

