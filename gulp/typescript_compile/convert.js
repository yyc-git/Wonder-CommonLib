"use strict";
var ts = require("typescript");
var path = require("path");
//todo refactor
var fs = require("fs-extra");
var fileDataMap = {};
var exportDataMap = {};
var sourceFileMap = {};
var hasConfilctImportData = false;
var confilctImportDataMap = {};
var ArrayUtils = (function () {
    function ArrayUtils() {
    }
    ArrayUtils.removeRepeatItems = function (arr) {
        var resultArr = [], self = this;
        arr.forEach(function (ele) {
            if (self.contain(resultArr, ele)) {
                return;
            }
            resultArr.push(ele);
        });
        return resultArr;
    };
    ArrayUtils.contain = function (arr, ele) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var value = arr[i];
            if (ele === value || (value.contain && value.contain(ele))) {
                return true;
            }
        }
        return false;
    };
    ;
    return ArrayUtils;
}());
function _getAllSourceFiles(fileAbsolutePaths) {
    fileAbsolutePaths.forEach(function (filePath) {
        var sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(), ts.ScriptTarget.ES5);
        sourceFileMap[filePath] = sourceFile;
    });
}
function _visitExportData(node, exportData, filePath) {
    if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        var module_1 = node;
        if (_isModuleBlock(module_1.body)) {
            var block = module_1.body;
            for (var _i = 0, _a = block.statements; _i < _a.length; _i++) {
                var statement = _a[_i];
                if (!_isExported(statement)) {
                    continue;
                }
                switch (statement.kind) {
                    case ts.SyntaxKind.ClassDeclaration:
                    case ts.SyntaxKind.InterfaceDeclaration:
                    case ts.SyntaxKind.EnumDeclaration:
                    case ts.SyntaxKind.FunctionDeclaration:
                        var name_1 = _getName(statement);
                        exportData.push(name_1);
                        _append(exportDataMap, name_1, filePath);
                        break;
                    case ts.SyntaxKind.VariableStatement:
                        for (var _b = 0, _c = statement.declarationList.declarations; _b < _c.length; _b++) {
                            var n = _c[_b];
                            var name_2 = _getName(n);
                            exportData.push(name_2);
                            _append(exportDataMap, name_2, filePath);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
function _isModuleBlock(body) {
    return body.kind === ts.SyntaxKind.ModuleBlock;
}
function _append(obj, key, value) {
    if (_isArray(obj[key])) {
        obj[key].push(value);
    }
    else {
        obj[key] = [value];
    }
}
function _isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}
function _getName(node) {
    if (!node.name) {
        return null;
    }
    return node.name.text;
}
function _visitImportData(node, importData, filePath) {
    if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        var module_2 = node;
        if (_isModuleBlock(module_2.body)) {
            var block = module_2.body;
            ts.forEachChild(block, function (node) {
                _visit(node, importData, filePath);
            });
        }
    }
}
function _visit(node, importData, filePath) {
    if (!!node.text) {
        var name_3 = node.text, data = exportDataMap[name_3];
        if (_isArray(data)) {
            if (data.length > 1) {
                _recordConflictImport(name_3, data, filePath);
            }
            else {
                var importedFilePath = data[0];
                if (importedFilePath !== filePath) {
                    _append(importData, _getRelativePath(filePath, importedFilePath), name_3);
                }
            }
        }
    }
    ts.forEachChild(node, function (node) {
        _visit(node, importData, filePath);
    });
}
function _getRelativePath(from, to, isDir) {
    if (isDir === void 0) { isDir = false; }
    var relativePath = path.relative(isDir ? from : path.dirname(from), to);
    if (relativePath[0] !== ".") {
        relativePath = "./" + relativePath;
    }
    return relativePath;
}
function _recordConflictImport(name, data, filePath) {
    hasConfilctImportData = true;
    _append(confilctImportDataMap[filePath], name, data);
}
function _writeES2015Files(rootDir, destDir) {
    for (var filePath in fileDataMap) {
        if (fileDataMap.hasOwnProperty(filePath)) {
            var fileData = fileDataMap[filePath];
            var destFilePath = _getDestFilePath(destDir, rootDir, filePath);
            var fileContent = fileData.moduleBlockContent;
            fileContent = _addImport(fileData.importData, fileContent);
            fs.mkdirsSync(path.dirname(destFilePath));
            fs.writeFileSync(destFilePath, fileContent);
        }
    }
}
function _getDestFilePath(destDir, rootDir, filePath) {
    return path.join(destDir, _getRelativePath(rootDir, filePath, true));
}
function _generateIndexFile(fileDataMap, rootDir, destDir) {
    var indexFilePath = path.join(destDir, "index.ts");
    if (fs.existsSync(indexFilePath)) {
        throw new Error("already exist index file:" + indexFilePath + ", can't generate it!");
    }
    var content = "";
    for (var filePath in fileDataMap) {
        if (fileDataMap.hasOwnProperty(filePath)) {
            var fileData = fileDataMap[filePath], nameArr = fileData.exportData.nameArr;
            if (nameArr.length === 0) {
                continue;
            }
            content += "export {" + nameArr + "} from \"" + _getRelativePath(rootDir, filePath, true).replace(".ts", "") + "\";\n";
        }
    }
    fs.writeFileSync(indexFilePath, content);
}
function _addImport(importData, fileContent) {
    var importContent = "";
    for (var filePath in importData) {
        if (importData.hasOwnProperty(filePath)) {
            var nameArr = importData[filePath];
            importContent += "import {" + nameArr.join(',') + "} from \"" + filePath.replace(".ts", "") + "\";\n";
        }
    }
    if (importContent.length > 0) {
        return importContent + "\n" + fileContent;
    }
    return fileContent;
}
function _isExported(node) {
    return (node.flags === ts.NodeFlags.Export)
        || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}
function generateDocumentation(rootDir, sourceFileGlobArr, destDir, options) {
    // import * as glob from "glob";
    var glob = require("glob");
    for (var _i = 0, sourceFileGlobArr_1 = sourceFileGlobArr; _i < sourceFileGlobArr_1.length; _i++) {
        var filePath = sourceFileGlobArr_1[_i];
        var globCwd = "/", fileAbsolutePaths = glob.sync(path.join(rootDir, filePath), {
            cwd: globCwd
        });
        _getAllSourceFiles(fileAbsolutePaths);
        var _loop_1 = function (filePath_1) {
            if (sourceFileMap.hasOwnProperty(filePath_1)) {
                var sourceFile = sourceFileMap[filePath_1];
                var textLineArr = sourceFile.text.split('\n');
                var moduleBlockContent = null;
                var findLastBraceIndex = function (textLineArr) {
                    for (var i = textLineArr.length - 1; i >= 0; i--) {
                        if (textLineArr[i] === "}") {
                            return i;
                        }
                    }
                    throw new Error("} not exist in " + filePath_1);
                };
                var findModuleDeclarationIndex = function (textLineArr) {
                    for (var i = textLineArr.length - 1; i >= 0; i--) {
                        if (/\s*module\s[\w\d]+\s*\{/.test(textLineArr[i])) {
                            return i;
                        }
                    }
                    throw new Error("module declaration not exist in " + filePath_1);
                };
                var moduleDeclarationIndex = findModuleDeclarationIndex(textLineArr);
                if (moduleDeclarationIndex > 0) {
                    moduleBlockContent = textLineArr.slice(0).slice(0, moduleDeclarationIndex).join('\n');
                }
                else {
                    moduleBlockContent = "";
                }
                moduleBlockContent += textLineArr.slice(moduleDeclarationIndex + 1, findLastBraceIndex(textLineArr)).join('\n');
                var fileData = {};
                fileData["moduleBlockContent"] = moduleBlockContent;
                var exportData_1 = [];
                ts.forEachChild(sourceFile, function (node) {
                    _visitExportData(node, exportData_1, filePath_1);
                });
                fileData["exportData"] = {
                    nameArr: ArrayUtils.removeRepeatItems(exportData_1)
                };
                fileDataMap[filePath_1] = fileData;
            }
        };
        for (var filePath_1 in sourceFileMap) {
            _loop_1(filePath_1);
        }
        var _loop_2 = function (filePath_2) {
            if (sourceFileMap.hasOwnProperty(filePath_2)) {
                var sourceFile = sourceFileMap[filePath_2];
                var importData_1 = {};
                ts.forEachChild(sourceFile, function (node) {
                    _visitImportData(node, importData_1, filePath_2);
                });
                for (var filePath_3 in importData_1) {
                    if (importData_1.hasOwnProperty(filePath_3)) {
                        var nameArr = importData_1[filePath_3];
                        importData_1[filePath_3] = ArrayUtils.removeRepeatItems(nameArr);
                    }
                }
                var fileData = fileDataMap[filePath_2];
                fileData["importData"] = importData_1;
            }
        };
        for (var filePath_2 in sourceFileMap) {
            _loop_2(filePath_2);
        }
        _writeES2015Files(rootDir, destDir);
        _generateIndexFile(fileDataMap, rootDir, destDir);
        if (hasConfilctImportData) {
            console.log("hasConfilctImportData! the data is:");
            console.log(JSON.stringify(confilctImportDataMap));
        }
    }
    // console.log(JSON.stringify(fileDataMap));
    console.log("finish");
    return;
}
exports.generateDocumentation = generateDocumentation;
