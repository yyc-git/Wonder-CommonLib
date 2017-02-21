export declare class JudgeUtils {
    static isArray(arr: any): boolean;
    static isArrayExactly(arr: any): boolean;
    static isNumber(num: any): boolean;
    static isNumberExactly(num: any): boolean;
    static isString(str: any): boolean;
    static isStringExactly(str: any): boolean;
    static isBoolean(bool: any): boolean;
    static isDom(obj: any): boolean;
    static isObject(obj: any): boolean;
    static isDirectObject(obj: any): boolean;
    static isHostMethod(object: any, property: any): boolean;
    static isNodeJs(): boolean;
    static isFunction(func: any): boolean;
}
