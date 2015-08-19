/// <reference path="../definitions.d.ts"/>
module dyCb{
    var SPLITPATH_REGEX =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

    //todo refer to https://github.com/cookfront/learn-note/blob/master/blog-backup/2014/nodejs-path.md
    export class PathUtils{
        public static basename(path:string, ext?:string){
            var f = this._splitPath(path)[2];
            // TODO: make this comparison case-insensitive on windows?
            if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
            }
            return f;

        }

        public static extname(path:string){
            return this._splitPath(path)[3];
        }

        private static _splitPath(fileName:string){
            return SPLITPATH_REGEX.exec(fileName).slice(1);
        }
    }
}
