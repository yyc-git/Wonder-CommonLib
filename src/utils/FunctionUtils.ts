/// <reference path="../filePath.d.ts"/>
module wdCb {
    export class FunctionUtils {
        public static bind(object:any, func:Function) {
            return function () {
                return func.apply(object, arguments);
            };
        }
    }
}
