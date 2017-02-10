import * as ts from "typescript";
import * as path from "path";

//todo refactor
var fs = require("fs-extra");


interface IFileData {
    importData: IImportData;
    exportData: IExportData;
    moduleBlockContent: string;
}

interface IFileDataMap {
    [filePath: string]: IFileData
}


interface IImportData {
    [importFilePath: string]: Array<string>
}

interface IExportData {
    nameArr: Array<string>;
}


interface IExportDataMap {
    [exportTargetName: string]: Array<string>
}

interface IConfilctImportDataMap {
    [filePath: string]: {
        [importTargetName: string]: Array<string>
    }
}

var fileDataMap: IFileDataMap = <IFileDataMap>{};

var exportDataMap: IExportDataMap = <IExportDataMap>{};

var sourceFileMap = {};


var hasConfilctImportData = false;

var confilctImportDataMap = {};


class ArrayUtils {
    public static removeRepeatItems(arr: Array<any>) {
        var resultArr = [],
            self = this;

        arr.forEach(function (ele) {
            if (self.contain(resultArr, ele)) {
                return;
            }

            resultArr.push(ele);
        });

        return resultArr;
    }

    public static contain(arr: Array<any>, ele: any) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let value = arr[i];

            if (ele === value || (value.contain && value.contain(ele))) {
                return true;
            }
        }

        return false;
    };

}


function _getAllSourceFiles(fileAbsolutePaths) {
    fileAbsolutePaths.forEach((filePath: string) => {
        let sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(), ts.ScriptTarget.ES5);

        sourceFileMap[filePath] = sourceFile;
    });
}

function _visitExportData(node: ts.Node, exportData: Array<string>, filePath) {
    if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        let module = <ts.ModuleDeclaration>node;

        if (_isModuleBlock(module.body)) {
            let block = <ts.ModuleBlock>module.body;

            for (let statement of block.statements) {
                if (!_isExported(statement)) {
                    continue;
                }

                switch (statement.kind) {
                    case ts.SyntaxKind.ClassDeclaration:
                    case ts.SyntaxKind.InterfaceDeclaration:
                    case ts.SyntaxKind.EnumDeclaration:
                    case ts.SyntaxKind.FunctionDeclaration:
                        let name = _getName(statement);

                        exportData.push(name);

                        _append(exportDataMap, name, filePath);
                        break;
                    case ts.SyntaxKind.VariableStatement:
                        for (let n of (<ts.VariableStatement>statement).declarationList.declarations) {
                            let name = _getName(n);

                            exportData.push(name);
                            _append(exportDataMap, name, filePath);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

function _isModuleBlock(body: ts.Node) {
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

function _isArray(arr: any) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

function _getName(node: any) {
    if (!node.name) {
        return null;
    }

    return node.name.text;
}

function _visitImportData(node: ts.Node, importData, filePath) {
    if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        let module = <ts.ModuleDeclaration>node;

        if (_isModuleBlock(module.body)) {
            let block = <ts.ModuleBlock>module.body;

            ts.forEachChild(block, (node: ts.Node) => {
                _visit(node, importData, filePath);
            });
        }
    }
}

function _visit(node: any, importData, filePath) {
    if (!!node.text) {
        let name = node.text,
            data = exportDataMap[name];

        if (_isArray(data)) {
            if (data.length > 1) {
                _recordConflictImport(name, data, filePath);
            }
            else {
                let importedFilePath = data[0];

                if (importedFilePath !== filePath) {
                    _append(importData, _getRelativePath(filePath, importedFilePath), name);
                }
            }
        }
    }

    ts.forEachChild(node, (node: ts.Node) => {
        _visit(node, importData, filePath);
    });
}

function _getRelativePath(from, to, isDir: boolean = false) {
    var relativePath = path.relative(isDir ? from : path.dirname(from), to);

    if (relativePath[0] !== ".") {
        relativePath = `./${relativePath}`;
    }

    return relativePath;
}

function _recordConflictImport(name, data, filePath) {
    hasConfilctImportData = true;
    _append(confilctImportDataMap[filePath], name, data);
}

function _writeES2015Files(rootDir, destDir) {
    for (let filePath in fileDataMap) {
        if (fileDataMap.hasOwnProperty(filePath)) {
            let fileData = fileDataMap[filePath];

            let destFilePath = _getDestFilePath(destDir, rootDir, filePath);

            let fileContent = fileData.moduleBlockContent;

            fileContent = _addImport(fileData.importData, fileContent);

            fs.mkdirsSync(path.dirname(destFilePath));
            fs.writeFileSync(destFilePath, fileContent);
        }
    }
}

function _getDestFilePath(destDir, rootDir, filePath) {
    return path.join(destDir, _getRelativePath(rootDir, filePath, true));
}

function _generateIndexFile(fileDataMap: IFileDataMap, rootDir, destDir) {
    var indexFilePath = path.join(destDir, "index.ts");

    if (fs.existsSync(indexFilePath)) {
        throw new Error(`already exist index file:${indexFilePath}, can't generate it!`);
    }

    let content = "";

    for (let filePath in fileDataMap) {
        if (fileDataMap.hasOwnProperty(filePath)) {
            let fileData: IFileData = fileDataMap[filePath],
                nameArr = fileData.exportData.nameArr;

            if (nameArr.length === 0) {
                continue;
            }

            content += `export {${nameArr}} from "${_getRelativePath(rootDir, filePath, true)}";\n`;
        }
    }

    fs.writeFileSync(indexFilePath, content);
}

function _addImport(importData: IImportData, fileContent: string) {
    var importContent = "";

    for (let filePath in importData) {
        if (importData.hasOwnProperty(filePath)) {
            let nameArr = importData[filePath];

            importContent += `import {${nameArr.join(',')}} from "${filePath.replace(".ts", "")}";\n`;
        }
    }

    if (importContent.length > 0) {
        return `${importContent}\n${fileContent}`;
    }

    return fileContent;
}


function _isExported(node: ts.Node): boolean {
    return (node.flags === ts.NodeFlags.Export)
        || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}


export function generateDocumentation(rootDir, sourceFileGlobArr, destDir, options: ts.CompilerOptions): void {
    // import * as glob from "glob";
    var glob = require("glob");

    for (let filePath of sourceFileGlobArr) {
        let globCwd = "/",
            fileAbsolutePaths = glob.sync(path.join(rootDir, filePath), {
                cwd: globCwd
            });

        _getAllSourceFiles(fileAbsolutePaths);


        for (let filePath in sourceFileMap) {
            if (sourceFileMap.hasOwnProperty(filePath)) {
                let sourceFile = sourceFileMap[filePath];

                let textLineArr = sourceFile.text.split('\n');

                let moduleBlockContent = null;

                let findLastBraceIndex = (textLineArr) => {
                    for (let i = textLineArr.length - 1; i >= 0; i--) {
                        if (textLineArr[i] === "}") {
                            return i;
                        }
                    }

                    throw new Error(`} not exist in ${filePath}`);
                };


                let findModuleDeclarationIndex = (textLineArr) => {
                    for (let i = textLineArr.length - 1; i >= 0; i--) {
                        if (/\s*module\s[\w\d]+\s*\{/.test(textLineArr[i])) {
                            return i;
                        }
                    }

                    throw new Error(`module declaration not exist in ${filePath}`);
                };

                let moduleDeclarationIndex = findModuleDeclarationIndex(textLineArr);

                if (moduleDeclarationIndex > 0) {
                    moduleBlockContent = textLineArr.slice(0).slice(0, moduleDeclarationIndex).join('\n');
                }
                else {
                    moduleBlockContent = "";
                }

                moduleBlockContent += textLineArr.slice(moduleDeclarationIndex + 1, findLastBraceIndex(textLineArr)).join('\n');


                let fileData: IFileData = <IFileData>{};


                fileData["moduleBlockContent"] = moduleBlockContent;

                let exportData: Array<string> = [];


                ts.forEachChild(sourceFile, (node: ts.Node) => {
                    _visitExportData(node, exportData, filePath)
                });

                fileData["exportData"] = {
                    nameArr: ArrayUtils.removeRepeatItems(exportData)
                };

                fileDataMap[filePath] = fileData;
            }
        }

        for (let filePath in sourceFileMap) {
            if (sourceFileMap.hasOwnProperty(filePath)) {
                let sourceFile = sourceFileMap[filePath];

                let importData = {};

                ts.forEachChild(sourceFile, (node: ts.Node) => {
                    _visitImportData(node, importData, filePath);
                });

                for (let filePath in importData) {
                    if (importData.hasOwnProperty(filePath)) {
                        let nameArr = importData[filePath];

                        importData[filePath] = ArrayUtils.removeRepeatItems(nameArr);
                    }
                }


                let fileData = fileDataMap[filePath];

                fileData["importData"] = importData;
            }
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
