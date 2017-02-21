import { JudgeUtils } from "./JudgeUtils";
var ArrayUtils = (function () {
    function ArrayUtils() {
    }
    ArrayUtils.removeRepeatItems = function (arr, isEqual) {
        if (isEqual === void 0) { isEqual = function (a, b) {
            return a === b;
        }; }
        var resultArr = [], self = this;
        arr.forEach(function (ele) {
            if (self.contain(resultArr, function (val) {
                return isEqual(val, ele);
            })) {
                return;
            }
            resultArr.push(ele);
        });
        return resultArr;
    };
    ArrayUtils.contain = function (arr, ele) {
        if (JudgeUtils.isFunction(ele)) {
            var func = ele;
            for (var i = 0, len = arr.length; i < len; i++) {
                var value = arr[i];
                if (!!func.call(null, value, i)) {
                    return true;
                }
            }
        }
        else {
            for (var i = 0, len = arr.length; i < len; i++) {
                var value = arr[i];
                if (ele === value || (value.contain && value.contain(ele))) {
                    return true;
                }
            }
        }
        return false;
    };
    ;
    return ArrayUtils;
}());
export { ArrayUtils };
//# sourceMappingURL=ArrayUtils.js.map