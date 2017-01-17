var fs = require("fs-extra");
var path = require("path");
var config = require("../common/config");

var distPath = config.distPath;

module.exports = function convertToNodejs() {
    var varName = "wdCb";
    var moduleExportsAddition =
        '\nif (((typeof window != "undefined" && window.module) || (typeof module != "undefined")) && typeof module.exports != "undefined") {\n' +
        '    module.exports = ' + varName + ';\n' +
        '};\n';
    var filePath = path.join(distPath, "wdCb.js");

    fs.writeFileSync(
        filePath,
        fs.readFileSync(filePath) + moduleExportsAddition
    );
}

