import { JudgeUtils } from "./JudgeUtils";
var ConvertUtils = (function () {
    function ConvertUtils() {
    }
    ConvertUtils.toString = function (obj) {
        if (JudgeUtils.isNumber(obj)) {
            return String(obj);
        }
        if (JudgeUtils.isFunction(obj)) {
            return this._convertCodeToString(obj);
        }
        if (JudgeUtils.isDirectObject(obj) || JudgeUtils.isArray(obj)) {
            return JSON.stringify(obj);
        }
        return String(obj);
    };
    ConvertUtils._convertCodeToString = function (fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
    };
    return ConvertUtils;
}());
export { ConvertUtils };
//# sourceMappingURL=ConvertUtils.js.map