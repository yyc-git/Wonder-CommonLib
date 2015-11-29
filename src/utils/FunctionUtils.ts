/// <reference path="../filePath.d.ts"/>
module dyCb {
    export class FunctionUtils {
        public static bind(object:any, func:Function) {
            return function () {
                return func.apply(object, arguments);
            };
        }
    }
}
