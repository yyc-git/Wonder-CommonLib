/// <reference path="../filePath.d.ts"/>
module dyCb{
    var SPLITPATH_REGEX =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

    //reference from
    //https://github.com/cookfront/learn-note/blob/master/blog-backup/2014/nodejs-path.md
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

        public static dirname(path:string){
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

        private static _splitPath(fileName:string){
            return SPLITPATH_REGEX.exec(fileName).slice(1);
        }
    }
}
