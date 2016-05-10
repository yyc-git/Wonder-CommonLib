declare var global:any,window:Window;

module wdCb{
    export var root:any;

    if(JudgeUtils.isNodeJs()){
        root = global;
    }
    else{
        root = window;
    }
}


