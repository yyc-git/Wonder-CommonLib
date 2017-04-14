"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionUtils = (function () {
    function FunctionUtils() {
    }
    FunctionUtils.bind = function (object, func) {
        return function () {
            return func.apply(object, arguments);
        };
    };
    return FunctionUtils;
}());
exports.FunctionUtils = FunctionUtils;
//# sourceMappingURL=FunctionUtils.js.map