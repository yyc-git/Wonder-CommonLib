var gulp = require("gulp");
var fs = require("fs-extra");

var convert = require("./convert.js").generateDocumentation;
var ts = require("typescript");


//todo move to wonder-package
function parseOption(name) {
    var value = null,
        i = process.argv.indexOf(name);

    if (i > -1) {
        value = process.argv[i + 1];
    }

    return value;
}

// function isDefinOption(name) {
//     return process.argv.indexOf(name) > -1;
// }
//
// module.exports = {
//     parseOption: parseOption,
//     isDefinOption: isDefinOption
// }



gulp.task("convertToES2015", function (done) {
    var rootDir = parseOption("--rootDir"),
        sourceFileGlobArr = parseOption("--sourceFileGlob").split(','),
        destDir = parseOption("--destDir") || "./dest/";


    fs.removeSync(destDir);

    convert(rootDir, sourceFileGlobArr, destDir, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.System
    });

    done();
});

