var gulp = require("gulp");
var del = require("del");
var gulpSync = require("gulp-sync")(gulp);
var path = require("path");


var wonderPackage = require("wonder-package");

var bundleDTS = wonderPackage.bundleDTS;
var compileTs = wonderPackage.compileTs;
var package = wonderPackage.package;
var format = wonderPackage.format;


var config = require("./gulp/common/config");




var tsFilePaths = config.tsFilePaths;
var distPath = config.distPath;
var tsconfigFile = config.tsconfigFile;
var indexFileDir = config.indexFileDir;


gulp.task('clean', function() {
    return del.sync([distPath], {
        force: true
    });
});


gulp.task("compileTsES2015", function(done) {
    compileTs.compileTsES2015(path.join(process.cwd(), tsconfigFile), {
        sourceDir: "./src",
        cwd:"./",
        targetDir:"./dist/es2015/"
    }, done);
});

gulp.task("compileTsCommonjs", function(done) {
    compileTs.compileTsCommonjs(path.join(process.cwd(), tsconfigFile), {
        sourceDir: "./src",
        cwd:"./",
        targetDir:"./dist/commonjs/"
    }, done);
});

gulp.task("generateDTS", function(done) {
    var indexDTSPath = path.join(indexFileDir, "index.d.ts");

    bundleDTS.generateES2015DTS(indexDTSPath, "wonder-commonlib/dist/es2015", path.join(distPath, "wdCb.es2015.d.ts"));
    bundleDTS.generateCommonjsDTS(indexDTSPath, "wonder-commonlib/dist/commonjs", path.join(distPath, "wdCb.commonjs.d.ts"));

    done();
});

gulp.task("rollup", function(done) {
    package.rollup(path.join(process.cwd(), "./rollup.config.js"), done);
});

gulp.task("formatTs", function(done) {
    format.formatTs(tsFilePaths, "/", done);
});



var generateIndex = require("wonder-tool-generate_es2015_index").generate;
var ts = require("typescript");

gulp.task("generateIndex", function(done) {
    var rootDir = path.join(process.cwd(), "src"),
        destDir = "./src/";

    generateIndex("/", rootDir, ["*.ts", "**/*.ts"], destDir, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.System
    }, {
    });

    done();
});






gulp.task("build", gulpSync.sync(["clean", "generateIndex", "compileTsES2015", "compileTsCommonjs", "generateDTS", "rollup", "formatTs"]));



gulp.task("watch", function(){
    gulp.watch(tsFilePaths, gulpSync.sync(["generateIndex", "compileTsES2015", "rollup"]));
});




var karma = require("karma").server;
var karmaConfPath = path.join(process.cwd(), "test/karma.conf.js");



gulp.task("test", function (done) {
    karma.start({
        configFile: karmaConfPath
    }, done);
});

