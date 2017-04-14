import { root } from "../global/Variable";

var SPLITPATH_REGEX =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

//reference from
//https://github.com/cookfront/learn-note/blob/master/blog-backup/2014/nodejs-path.md
export class PathUtils {
    public static basename(path: string, ext?: string) {
        var f = this._splitPath(path)[2];
        // TODO: make this comparison case-insensitive on windows?
        if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
        }
        return f;

    }

    public static changeExtname(pathStr: string, extname: string) {
        var extname = extname || "",
            index = pathStr.indexOf("?"),
            tempStr = "";

        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }

        index = pathStr.lastIndexOf(".");

        if (index < 0) {
            return pathStr + extname + tempStr;
        }

        return pathStr.substring(0, index) + extname + tempStr;
    }

    public static changeBasename(pathStr: string, basename: string, isSameExt: boolean = false) {
        var index = null,
            tempStr = null,
            ext = null;

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
    }

    public static extname(path: string) {
        return this._splitPath(path)[3];
    }

    public static dirname(path: string) {
        var result = this._splitPath(path),
            root = result[0],
            dir = result[1];

        if (!root && !dir) {
            //no dirname whatsoever
            return '.';
        }

        if (dir) {
            //it has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
    }

    private static _splitPath(fileName: string) {
        return SPLITPATH_REGEX.exec(fileName).slice(1);
    }
}