/// <reference path="../definitions.d.ts"/>

module dyCb{
    declare var global:any,window:any;

    export var root:any;
    Object.defineProperty(dyCb, "root", {
        get: function() {
            if(JudgeUtils.isNodeJs()){
                return global;
            }

            return window;
        }
    });
}
