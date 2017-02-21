var SPLITPATH_REGEX = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var PathUtils = (function () {
    function PathUtils() {
    }
    PathUtils.basename = function (path, ext) {
        var f = this._splitPath(path)[2];
        if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
        }
        return f;
    };
    PathUtils.changeExtname = function (pathStr, extname) {
        var extname = extname || "", index = pathStr.indexOf("?"), tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf(".");
        if (index < 0) {
            return pathStr + extname + tempStr;
        }
        return pathStr.substring(0, index) + extname + tempStr;
    };
    PathUtils.changeBasename = function (pathStr, basename, isSameExt) {
        if (isSameExt === void 0) { isSameExt = false; }
        var index = null, tempStr = null, ext = null;
        if (basename.indexOf(".") == 0) {
            return this.changeExtname(pathStr, basename);
        }
        index = pathStr.indexOf("?");
        tempStr = "";
        ext = isSameExt ? this.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr;
    };
    PathUtils.extname = function (path) {
        return this._splitPath(path)[3];
    };
    PathUtils.dirname = function (path) {
        var result = this._splitPath(path), root = result[0], dir = result[1];
        if (!root && !dir) {
            return '.';
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
    };
    PathUtils._splitPath = function (fileName) {
        return SPLITPATH_REGEX.exec(fileName).slice(1);
    };
    return PathUtils;
}());
export { PathUtils };
//# sourceMappingURL=PathUtils.js.map