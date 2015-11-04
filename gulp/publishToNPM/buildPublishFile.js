var fs = require("fs-extra");
var path = require("path");
var combineInnerLib = require("../common/combineInnerLib");
var addModuleNameConverter = require("./addModuleNameConverter");
var config = require("../common/config");

var distPath = config.distPath;

module.exports = function buildPublishFile() {
    fs.copySync(path.join(distPath, "dyCb.d.ts"), path.join(distPath, "dyCb.node.d.ts"));

    addModuleNameConverter(path.join(distPath, "dyCb.node.d.ts"), "dyCb", "dycb");
}

