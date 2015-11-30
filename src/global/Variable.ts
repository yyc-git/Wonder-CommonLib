/// <reference path="../filePath.d.ts"/>

module wdCb{
    declare var global:any,window:any;

    export var root:any;
    Object.defineProperty(wdCb, "root", {
        get: function() {
            if(JudgeUtils.isNodeJs()){
                return global;
            }

            return window;
        }
    });
}
