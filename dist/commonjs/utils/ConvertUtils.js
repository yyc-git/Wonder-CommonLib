"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JudgeUtils_1 = require("./JudgeUtils");
var ConvertUtils = (function () {
    function ConvertUtils() {
    }
    ConvertUtils.toString = function (obj) {
        if (JudgeUtils_1.JudgeUtils.isNumber(obj)) {
            return String(obj);
        }
        if (JudgeUtils_1.JudgeUtils.isFunction(obj)) {
            return this._convertCodeToString(obj);
        }
        if (JudgeUtils_1.JudgeUtils.isDirectObject(obj) || JudgeUtils_1.JudgeUtils.isArray(obj)) {
            return JSON.stringify(obj);
        }
        return String(obj);
    };
    ConvertUtils._convertCodeToString = function (fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
    };
    return ConvertUtils;
}());
exports.ConvertUtils = ConvertUtils;
//# sourceMappingURL=ConvertUtils.js.map