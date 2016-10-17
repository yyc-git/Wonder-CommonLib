var gulp = require("gulp");
var gulpTs = require("gulp-typescript");
var gulpSourcemaps = require("gulp-sourcemaps");
var gulpConcat = require("gulp-concat");
var del = require("del");
var gulpSync = require("gulp-sync")(gulp);
var merge = require("merge2");
var path = require("path");
var through = require("through-gulp");
var fs = require("fs");
var buildPublishFile = require("./gulp/publishToNPM/buildPublishFile");
var config = require("./gulp/common/config");

require("./gulp/publishToNPM/publishToNPM");

var tsFilePaths = config.tsFilePaths;
var distPath = config.distPath;
var definitionsPath = config.definitionsPath;
var tsconfigFile = config.tsconfigFile;


gulp.task('clean', function() {
    return del.sync([distPath], {
        force: true
    });
});



//todo move to yeoman-generator

gulp.task("compileTsConfig", function(){
    var mapFilePath = function(item){
        var result = /"([^"]+)"/g.exec(item)[1];

        if(result.indexOf(".d.ts") > -1){
            return result;
        }

        return result + ".ts";
    }

    var filterFilePath = function(item){
        return item !== "";
    }

    return gulp.src(tsconfigFile)
        .pipe(through(function (file, encoding, callback) {
            var arr = null,
                tsconfig = null,
                outputConfigStr = null;

            if (file.isNull()) {
                this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                return callback();
            }
            if (file.isBuffer()) {
                arr = fs.readFileSync(path.join(process.cwd(), definitionsPath), "utf8").split('\n').filter(filterFilePath).map(mapFilePath);

                tsconfig = JSON.parse(file.contents);
                tsconfig.files = arr;

                outputConfigStr = JSON.stringify(tsconfig,null,"\t");

                fs.writeFileSync(file.path,outputConfigStr);

                this.push(file);

                callback();
            }
            if (file.isStream()) {
                this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                return callback();
            }
        }, function (callback) {
            callback();
        }));
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





//gulp.task('compileTs', function() {
//    var tsResult = gulp.src(tsFilePaths)
//        //.pipe(gulpSourcemaps.init())
//        .pipe(gulpTs({
//            declarationFiles: true,
//            target: 'ES5',
//            sortOutput:true,
//            typescript: require('typescript')
//        }));
//
//
//    return  merge([
//        tsResult.dts
//            .pipe(gulpConcat('wdCb.d.ts'))
//            .pipe(gulp.dest('dist')),
//        tsResult.js
//            .pipe(gulpConcat('wdCb.js'))
//            //.pipe(gulpSourcemaps.write('./'))
//            //.pipe(gulpSourcemaps.write())
//            .pipe(gulp.dest('dist/'))
//    ])
//});
//
//
//gulp.task('compileTsDebug', function() {
//    var tsResult = gulp.src(tsFilePaths)
//        .pipe(gulpSourcemaps.init())
//        .pipe(gulpTs({
//            declarationFiles: true,
//            target: 'ES5',
//            sortOutput:true,
//            //noExternalResolve: true,
//            noEmitOnError: true,
//            typescript: require('typescript')
//        }));
//
//
//    return tsResult.js
//            .pipe(gulpConcat('wdCb.debug.js'))
//            .pipe(gulpSourcemaps.write())
//            .pipe(gulp.dest('dist/'));
//});



gulp.task("buildPublishFile", function(done){
    buildPublishFile();

    done();
});

gulp.task("build", gulpSync.sync(["clean", "compileTsConfig", "compileTs", "compileTsDebug", "publishToNPM", "buildPublishFile"]));



//var tsFilePaths = ["src/*.ts", "src/**/*.ts"];

gulp.task("watch", function(){
    gulp.watch(tsFilePaths, ["compileTsConfig", "compileTsDebug"]);
});




var karma = require("karma").server;
var karmaConfPath = path.join(process.cwd(), "test/karma.conf.js");



gulp.task("test", function (done) {
    karma.start({
        configFile: karmaConfPath
    }, done);
});

