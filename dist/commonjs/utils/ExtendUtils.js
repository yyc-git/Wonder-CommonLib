"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JudgeUtils_1 = require("./JudgeUtils");
var ExtendUtils = (function () {
    function ExtendUtils() {
    }
    ExtendUtils.extendDeep = function (parent, child, filter) {
        if (filter === void 0) { filter = function (val, i) { return true; }; }
        var i = null, len = 0, toStr = Object.prototype.toString, sArr = "[object Array]", sOb = "[object Object]", type = "", _child = null;
        if (toStr.call(parent) === sArr) {
            _child = child || [];
            for (i = 0, len = parent.length; i < len; i++) {
                var member = parent[i];
                if (!filter(member, i)) {
                    continue;
                }
                if (member.clone) {
                    _child[i] = member.clone();
                    continue;
                }
                type = toStr.call(member);
                if (type === sArr || type === sOb) {
                    _child[i] = type === sArr ? [] : {};
                    ExtendUtils.extendDeep(member, _child[i]);
                }
                else {
                    _child[i] = member;
                }
            }
        }
        else if (toStr.call(parent) === sOb) {
            _child = child || {};
            for (i in parent) {
                var member = parent[i];
                if (!filter(member, i)) {
                    continue;
                }
                if (member.clone) {
                    _child[i] = member.clone();
                    continue;
                }
                type = toStr.call(member);
                if (type === sArr || type === sOb) {
                    _child[i] = type === sArr ? [] : {};
                    ExtendUtils.extendDeep(member, _child[i]);
                }
                else {
                    _child[i] = member;
                }
            }
        }
        else {
            _child = parent;
        }
        return _child;
    };
    ExtendUtils.extend = function (destination, source) {
        var property = "";
        for (property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    };
    ExtendUtils.assign = function (source, target) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                if (target[property] === void 0 || target[property] === null) {
                    target[property] = source[property];
                }
            }
        }
        return target;
    };
    ExtendUtils.copyPublicAttri = function (source) {
        var property = null, destination = {};
        this.extendDeep(source, destination, function (item, property) {
            return property.slice(0, 1) !== "_"
                && !JudgeUtils_1.JudgeUtils.isFunction(item);
        });
        return destination;
    };
    return ExtendUtils;
}());
exports.ExtendUtils = ExtendUtils;
//# sourceMappingURL=ExtendUtils.js.map