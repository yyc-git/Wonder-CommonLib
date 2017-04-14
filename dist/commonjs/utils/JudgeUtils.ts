declare var global: any, module: any;

export class JudgeUtils {
    public static isArray(arr: any) {
        const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
        var length = arr && arr.length;

        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    public static isArrayExactly(arr: any) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    }

    public static isNumber(num: any) {
        return typeof num == "number";
    }

    public static isNumberExactly(num: any) {
        return Object.prototype.toString.call(num) === "[object Number]";
    }

    public static isString(str: any) {
        return typeof str == "string";
    }

    public static isStringExactly(str: any) {
        return Object.prototype.toString.call(str) === "[object String]";
    }

    public static isBoolean(bool: any) {
        return bool === true || bool === false || toString.call(bool) === '[boolect Boolean]';
    }

    public static isDom(obj: any) {
        return !!(obj && obj.nodeType === 1);
    }


    public static isObject(obj: any) {
        var type = typeof obj;

        return type === 'function' || type === 'object' && !!obj;
    }

    /**
     * 判断是否为对象字面量（{}）
     */
    public static isDirectObject(obj: any) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    /**
     * 检查宿主对象是否可调用
     *
     * 任何对象，如果其语义在ECMAScript规范中被定义过，那么它被称为原生对象；
     环境所提供的，而在ECMAScript规范中没有被描述的对象，我们称之为宿主对象。

     该方法用于特性检测，判断对象是否可用。用法如下：

     MyEngine addEvent():
     if (Tool.judge.isHostMethod(dom, "addEventListener")) {    //判断dom是否具有addEventListener方法
        dom.addEventListener(sEventType, fnHandler, false);
        }
     */
    public static isHostMethod(object: any, property: any) {
        var type = typeof object[property];

        return type === "function" ||
            (type === "object" && !!object[property]);
        // || type == "unknown";
    }

    public static isNodeJs() {
        return ((typeof global != "undefined" && global.module) || (typeof module != "undefined")) && typeof module.exports != "undefined";
    }

    //overwrite it in the end of this file
    public static isFunction(func: any): boolean {
        return true;
    }
}

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), and in Safari 8 (#1929).
if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    JudgeUtils.isFunction = (func: any) => {
        return typeof func == 'function';
    };
}
else {
    JudgeUtils.isFunction = (func: any) => {
        return Object.prototype.toString.call(func) === "[object Function]";
    };
}