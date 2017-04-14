"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JudgeUtils_1 = require("./JudgeUtils");
var DomQuery = (function () {
    function DomQuery() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._doms = null;
        if (JudgeUtils_1.JudgeUtils.isDom(args[0])) {
            this._doms = [args[0]];
        }
        else if (this._isDomEleStr(args[0])) {
            this._doms = [this._buildDom(args[0])];
        }
        else {
            this._doms = document.querySelectorAll(args[0]);
        }
        return this;
    }
    DomQuery.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var obj = new this(args[0]);
        return obj;
    };
    DomQuery.prototype.get = function (index) {
        return this._doms[index];
    };
    DomQuery.prototype.prepend = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var targetDom = null;
        targetDom = this._buildDom(args[0]);
        for (var _a = 0, _b = this._doms; _a < _b.length; _a++) {
            var dom = _b[_a];
            if (dom.nodeType === 1) {
                dom.insertBefore(targetDom, dom.firstChild);
            }
        }
        return this;
    };
    DomQuery.prototype.prependTo = function (eleStr) {
        var targetDom = null;
        targetDom = DomQuery.create(eleStr);
        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
            var dom = _a[_i];
            if (dom.nodeType === 1) {
                targetDom.prepend(dom);
            }
        }
        return this;
    };
    DomQuery.prototype.remove = function () {
        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
            var dom = _a[_i];
            if (dom && dom.parentNode && dom.tagName != 'BODY') {
                dom.parentNode.removeChild(dom);
            }
        }
        return this;
    };
    DomQuery.prototype.css = function (property, value) {
        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
            var dom = _a[_i];
            dom.style[property] = value;
        }
    };
    DomQuery.prototype.attr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1) {
            var name_1 = args[0];
            return this.get(0).getAttribute(name_1);
        }
        else {
            var name_2 = args[0], value = args[1];
            for (var _a = 0, _b = this._doms; _a < _b.length; _a++) {
                var dom = _b[_a];
                dom.setAttribute(name_2, value);
            }
        }
    };
    DomQuery.prototype.text = function (str) {
        var dom = this.get(0);
        if (str !== void 0) {
            if (dom.textContent !== void 0) {
                dom.textContent = str;
            }
            else {
                dom.innerText = str;
            }
        }
        else {
            return dom.textContent !== void 0 ? dom.textContent : dom.innerText;
        }
    };
    DomQuery.prototype._isDomEleStr = function (eleStr) {
        return eleStr.match(/<(\w+)[^>]*><\/\1>/) !== null;
    };
    DomQuery.prototype._buildDom = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (JudgeUtils_1.JudgeUtils.isString(args[0])) {
            var div = this._createElement("div"), eleStr = args[0];
            div.innerHTML = eleStr;
            return div.firstChild;
        }
        return args[0];
    };
    DomQuery.prototype._createElement = function (eleStr) {
        return document.createElement(eleStr);
    };
    return DomQuery;
}());
exports.DomQuery = DomQuery;
//# sourceMappingURL=DomQuery.js.map