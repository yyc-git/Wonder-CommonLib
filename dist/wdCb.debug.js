var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wdCb;
(function (wdCb) {
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var JudgeUtils = (function () {
        function JudgeUtils() {
        }
        JudgeUtils.isArray = function (arr) {
            var length = arr && arr.length;
            return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
        };
        JudgeUtils.isArrayExactly = function (arr) {
            return Object.prototype.toString.call(arr) === "[object Array]";
        };
        JudgeUtils.isNumber = function (num) {
            return typeof num == "number";
        };
        JudgeUtils.isNumberExactly = function (num) {
            return Object.prototype.toString.call(num) === "[object Number]";
        };
        JudgeUtils.isString = function (str) {
            return typeof str == "string";
        };
        JudgeUtils.isStringExactly = function (str) {
            return Object.prototype.toString.call(str) === "[object String]";
        };
        JudgeUtils.isBoolean = function (bool) {
            return bool === true || bool === false || toString.call(bool) === '[boolect Boolean]';
        };
        JudgeUtils.isDom = function (obj) {
            return !!(obj && obj.nodeType === 1);
        };
        JudgeUtils.isObject = function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        };
        JudgeUtils.isDirectObject = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        };
        JudgeUtils.isHostMethod = function (object, property) {
            var type = typeof object[property];
            return type === "function" ||
                (type === "object" && !!object[property]) ||
                type === "unknown";
        };
        JudgeUtils.isNodeJs = function () {
            return ((typeof global != "undefined" && global.module) || (typeof module != "undefined")) && typeof module.exports != "undefined";
        };
        JudgeUtils.isFunction = function (func) {
            return true;
        };
        return JudgeUtils;
    }());
    wdCb.JudgeUtils = JudgeUtils;
    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
        JudgeUtils.isFunction = function (func) {
            return typeof func == 'function';
        };
    }
    else {
        JudgeUtils.isFunction = function (func) {
            return Object.prototype.toString.call(func) === "[object Function]";
        };
    }
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    if (wdCb.JudgeUtils.isNodeJs() && typeof global != "undefined") {
        wdCb.root = global;
    }
    else {
        wdCb.root = window;
    }
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    if ('performance' in wdCb.root === false) {
        wdCb.root.performance = {};
    }
    Date.now = (Date.now || function () {
        return new Date().getTime();
    });
    if ('now' in wdCb.root.performance === false) {
        var offset = wdCb.root.performance.timing && wdCb.root.performance.timing.navigationStart ? performance.timing.navigationStart
            : Date.now();
        wdCb.root.performance.now = function () {
            return Date.now() - offset;
        };
    }
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    wdCb.$BREAK = {
        break: true
    };
    wdCb.$REMOVE = void 0;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var Log = (function () {
        function Log() {
        }
        Log.log = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            if (!this._exec("log", messages)) {
                wdCb.root.alert(messages.join(","));
            }
            this._exec("trace", messages);
        };
        Log.assert = function (cond) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            if (cond) {
                if (!this._exec("assert", arguments, 1)) {
                    this.log.apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }
        };
        Log.error = function (cond) {
            var message = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                message[_i - 1] = arguments[_i];
            }
            if (cond) {
                throw new Error(Array.prototype.slice.call(arguments, 1).join("\n"));
            }
        };
        Log.warn = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i - 0] = arguments[_i];
            }
            var result = this._exec("warn", arguments);
            if (!result) {
                this.log.apply(this, arguments);
            }
            else {
                this._exec("trace", ["warn trace"]);
            }
        };
        Log._exec = function (consoleMethod, args, sliceBegin) {
            if (sliceBegin === void 0) { sliceBegin = 0; }
            if (wdCb.root.console && wdCb.root.console[consoleMethod]) {
                wdCb.root.console[consoleMethod].apply(wdCb.root.console, Array.prototype.slice.call(args, sliceBegin));
                return true;
            }
            return false;
        };
        Log.info = {
            INVALID_PARAM: "invalid parameter",
            helperFunc: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var result = "";
                args.forEach(function (val) {
                    result += String(val) + " ";
                });
                return result.slice(0, -1);
            },
            assertion: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (args.length === 2) {
                    return this.helperFunc(args[0], args[1]);
                }
                else if (args.length === 3) {
                    return this.helperFunc(args[1], args[0], args[2]);
                }
                else {
                    throw new Error("args.length must <= 3");
                }
            },
            FUNC_INVALID: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("invalid");
                return this.assertion.apply(this, args);
            },
            FUNC_MUST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("must");
                return this.assertion.apply(this, args);
            },
            FUNC_MUST_BE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("must be");
                return this.assertion.apply(this, args);
            },
            FUNC_MUST_NOT_BE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("must not be");
                return this.assertion.apply(this, args);
            },
            FUNC_SHOULD: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("should");
                return this.assertion.apply(this, args);
            },
            FUNC_SHOULD_NOT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("should not");
                return this.assertion.apply(this, args);
            },
            FUNC_SUPPORT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("support");
                return this.assertion.apply(this, args);
            },
            FUNC_NOT_SUPPORT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("not support");
                return this.assertion.apply(this, args);
            },
            FUNC_MUST_DEFINE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("must define");
                return this.assertion.apply(this, args);
            },
            FUNC_MUST_NOT_DEFINE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("must not define");
                return this.assertion.apply(this, args);
            },
            FUNC_UNKNOW: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("unknow");
                return this.assertion.apply(this, args);
            },
            FUNC_EXPECT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("expect");
                return this.assertion.apply(this, args);
            },
            FUNC_UNEXPECT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("unexpect");
                return this.assertion.apply(this, args);
            },
            FUNC_EXIST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("exist");
                return this.assertion.apply(this, args);
            },
            FUNC_NOT_EXIST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("not exist");
                return this.assertion.apply(this, args);
            },
            FUNC_ONLY: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("only");
                return this.assertion.apply(this, args);
            },
            FUNC_CAN_NOT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("can't");
                return this.assertion.apply(this, args);
            }
        };
        return Log;
    }());
    wdCb.Log = Log;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var List = (function () {
        function List() {
            this.children = null;
        }
        List.prototype.getCount = function () {
            return this.children.length;
        };
        List.prototype.hasChild = function (child) {
            var c = null, children = this.children;
            for (var i = 0, len = children.length; i < len; i++) {
                c = children[i];
                if (child.uid && c.uid && child.uid == c.uid) {
                    return true;
                }
                else if (child === c) {
                    return true;
                }
            }
            return false;
        };
        List.prototype.hasChildWithFunc = function (func) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                if (func(this.children[i], i)) {
                    return true;
                }
            }
            return false;
        };
        List.prototype.getChildren = function () {
            return this.children;
        };
        List.prototype.getChild = function (index) {
            return this.children[index];
        };
        List.prototype.addChild = function (child) {
            this.children.push(child);
            return this;
        };
        List.prototype.addChildren = function (arg) {
            if (wdCb.JudgeUtils.isArray(arg)) {
                var children = arg;
                this.children = this.children.concat(children);
            }
            else if (arg instanceof List) {
                var children = arg;
                this.children = this.children.concat(children.getChildren());
            }
            else {
                var child = arg;
                this.addChild(child);
            }
            return this;
        };
        List.prototype.setChildren = function (children) {
            this.children = children;
            return this;
        };
        List.prototype.unShiftChild = function (child) {
            this.children.unshift(child);
        };
        List.prototype.removeAllChildren = function () {
            this.children = [];
            return this;
        };
        List.prototype.forEach = function (func, context) {
            this._forEach(this.children, func, context);
            return this;
        };
        List.prototype.toArray = function () {
            return this.children;
        };
        List.prototype.copyChildren = function () {
            return this.children.slice(0);
        };
        List.prototype.removeChildHelper = function (arg) {
            var result = null;
            if (wdCb.JudgeUtils.isFunction(arg)) {
                var func = arg;
                result = this._removeChild(this.children, func);
            }
            else if (arg.uid) {
                result = this._removeChild(this.children, function (e) {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                result = this._removeChild(this.children, function (e) {
                    return e === arg;
                });
            }
            return result;
        };
        List.prototype._forEach = function (arr, func, context) {
            var scope = context, i = 0, len = arr.length;
            for (i = 0; i < len; i++) {
                if (func.call(scope, arr[i], i) === wdCb.$BREAK) {
                    break;
                }
            }
        };
        List.prototype._removeChild = function (arr, func) {
            var self = this, removedElementArr = [], remainElementArr = [];
            this._forEach(arr, function (e, index) {
                if (!!func.call(self, e)) {
                    removedElementArr.push(e);
                }
                else {
                    remainElementArr.push(e);
                }
            });
            this.children = remainElementArr;
            return removedElementArr;
        };
        return List;
    }());
    wdCb.List = List;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var Collection = (function (_super) {
        __extends(Collection, _super);
        function Collection(children) {
            if (children === void 0) { children = []; }
            _super.call(this);
            this.children = children;
        }
        Collection.create = function (children) {
            if (children === void 0) { children = []; }
            var obj = new this(children);
            return obj;
        };
        Collection.prototype.clone = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var target = null, isDeep = null;
            if (args.length === 0) {
                isDeep = false;
                target = Collection.create();
            }
            else if (args.length === 1) {
                if (wdCb.JudgeUtils.isBoolean(args[0])) {
                    target = Collection.create();
                    isDeep = args[0];
                }
                else {
                    target = args[0];
                    isDeep = false;
                }
            }
            else {
                target = args[0];
                isDeep = args[1];
            }
            if (isDeep === true) {
                target.setChildren(wdCb.ExtendUtils.extendDeep(this.children));
            }
            else {
                target.setChildren(wdCb.ExtendUtils.extend([], this.children));
            }
            return target;
        };
        Collection.prototype.filter = function (func) {
            var children = this.children, result = [], value = null;
            for (var i = 0, len = children.length; i < len; i++) {
                value = children[i];
                if (func.call(children, value, i)) {
                    result.push(value);
                }
            }
            return Collection.create(result);
        };
        Collection.prototype.findOne = function (func) {
            var scope = this.children, result = null;
            this.forEach(function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result = value;
                return wdCb.$BREAK;
            });
            return result;
        };
        Collection.prototype.reverse = function () {
            return Collection.create(this.copyChildren().reverse());
        };
        Collection.prototype.removeChild = function (arg) {
            return Collection.create(this.removeChildHelper(arg));
        };
        Collection.prototype.sort = function (func, isSortSelf) {
            if (isSortSelf === void 0) { isSortSelf = false; }
            if (isSortSelf) {
                this.children.sort(func);
                return this;
            }
            return Collection.create(this.copyChildren().sort(func));
        };
        Collection.prototype.map = function (func) {
            var resultArr = [];
            this.forEach(function (e, index) {
                var result = func(e, index);
                if (result !== wdCb.$REMOVE) {
                    resultArr.push(result);
                }
            });
            return Collection.create(resultArr);
        };
        Collection.prototype.removeRepeatItems = function () {
            var noRepeatList = Collection.create();
            this.forEach(function (item) {
                if (noRepeatList.hasChild(item)) {
                    return;
                }
                noRepeatList.addChild(item);
            });
            return noRepeatList;
        };
        Collection.prototype.hasRepeatItems = function () {
            var noRepeatList = Collection.create(), hasRepeat = false;
            this.forEach(function (item) {
                if (noRepeatList.hasChild(item)) {
                    hasRepeat = true;
                    return wdCb.$BREAK;
                }
                noRepeatList.addChild(item);
            });
            return hasRepeat;
        };
        return Collection;
    }(wdCb.List));
    wdCb.Collection = Collection;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var Hash = (function () {
        function Hash(children) {
            if (children === void 0) { children = {}; }
            this._children = null;
            this._children = children;
        }
        Hash.create = function (children) {
            if (children === void 0) { children = {}; }
            var obj = new this(children);
            return obj;
        };
        Hash.prototype.getChildren = function () {
            return this._children;
        };
        Hash.prototype.getCount = function () {
            var result = 0, children = this._children, key = null;
            for (key in children) {
                if (children.hasOwnProperty(key)) {
                    result++;
                }
            }
            return result;
        };
        Hash.prototype.getKeys = function () {
            var result = wdCb.Collection.create(), children = this._children, key = null;
            for (key in children) {
                if (children.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }
            return result;
        };
        Hash.prototype.getValues = function () {
            var result = wdCb.Collection.create(), children = this._children, key = null;
            for (key in children) {
                if (children.hasOwnProperty(key)) {
                    result.addChild(children[key]);
                }
            }
            return result;
        };
        Hash.prototype.getChild = function (key) {
            return this._children[key];
        };
        Hash.prototype.setValue = function (key, value) {
            this._children[key] = value;
            return this;
        };
        Hash.prototype.addChild = function (key, value) {
            this._children[key] = value;
            return this;
        };
        Hash.prototype.addChildren = function (arg) {
            var i = null, children = null;
            if (arg instanceof Hash) {
                children = arg.getChildren();
            }
            else {
                children = arg;
            }
            for (i in children) {
                if (children.hasOwnProperty(i)) {
                    this.addChild(i, children[i]);
                }
            }
            return this;
        };
        Hash.prototype.appendChild = function (key, value) {
            if (this._children[key] instanceof wdCb.Collection) {
                var c = (this._children[key]);
                c.addChild(value);
            }
            else {
                this._children[key] = (wdCb.Collection.create().addChild(value));
            }
            return this;
        };
        Hash.prototype.setChildren = function (children) {
            this._children = children;
        };
        Hash.prototype.removeChild = function (arg) {
            var result = [];
            if (wdCb.JudgeUtils.isString(arg)) {
                var key = arg;
                result.push(this._children[key]);
                this._children[key] = void 0;
                delete this._children[key];
            }
            else if (wdCb.JudgeUtils.isFunction(arg)) {
                var func_1 = arg, self_1 = this;
                this.forEach(function (val, key) {
                    if (func_1(val, key)) {
                        result.push(self_1._children[key]);
                        self_1._children[key] = void 0;
                        delete self_1._children[key];
                    }
                });
            }
            return wdCb.Collection.create(result);
        };
        Hash.prototype.removeAllChildren = function () {
            this._children = {};
        };
        Hash.prototype.hasChild = function (key) {
            return this._children[key] !== void 0;
        };
        Hash.prototype.hasChildWithFunc = function (func) {
            var result = false;
            this.forEach(function (val, key) {
                if (func(val, key)) {
                    result = true;
                    return wdCb.$BREAK;
                }
            });
            return result;
        };
        Hash.prototype.forEach = function (func, context) {
            var children = this._children;
            for (var i in children) {
                if (children.hasOwnProperty(i)) {
                    if (func.call(context, children[i], i) === wdCb.$BREAK) {
                        break;
                    }
                }
            }
            return this;
        };
        Hash.prototype.filter = function (func) {
            var result = {}, children = this._children, value = null;
            for (var key in children) {
                if (children.hasOwnProperty(key)) {
                    value = children[key];
                    if (func.call(children, value, key)) {
                        result[key] = value;
                    }
                }
            }
            return Hash.create(result);
        };
        Hash.prototype.findOne = function (func) {
            var result = [], self = this, scope = this._children;
            this.forEach(function (val, key) {
                if (!func.call(scope, val, key)) {
                    return;
                }
                result = [key, self.getChild(key)];
                return wdCb.$BREAK;
            });
            return result;
        };
        Hash.prototype.map = function (func) {
            var resultMap = {};
            this.forEach(function (val, key) {
                var result = func(val, key);
                if (result !== wdCb.$REMOVE) {
                    wdCb.Log.error(!wdCb.JudgeUtils.isArray(result) || result.length !== 2, wdCb.Log.info.FUNC_MUST_BE("iterator", "[key, value]"));
                    resultMap[result[0]] = result[1];
                }
            });
            return Hash.create(resultMap);
        };
        Hash.prototype.toCollection = function () {
            var result = wdCb.Collection.create();
            this.forEach(function (val, key) {
                if (val instanceof wdCb.Collection) {
                    result.addChildren(val);
                }
                else {
                    result.addChild(val);
                }
            });
            return result;
        };
        Hash.prototype.toArray = function () {
            var result = [];
            this.forEach(function (val, key) {
                if (val instanceof wdCb.Collection) {
                    result = result.concat(val.getChildren());
                }
                else {
                    result.push(val);
                }
            });
            return result;
        };
        Hash.prototype.clone = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var target = null, isDeep = null;
            if (args.length === 0) {
                isDeep = false;
                target = Hash.create();
            }
            else if (args.length === 1) {
                if (wdCb.JudgeUtils.isBoolean(args[0])) {
                    target = Hash.create();
                    isDeep = args[0];
                }
                else {
                    target = args[0];
                    isDeep = false;
                }
            }
            else {
                target = args[0];
                isDeep = args[1];
            }
            if (isDeep === true) {
                target.setChildren(wdCb.ExtendUtils.extendDeep(this._children));
            }
            else {
                target.setChildren(wdCb.ExtendUtils.extend({}, this._children));
            }
            return target;
        };
        return Hash;
    }());
    wdCb.Hash = Hash;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var Queue = (function (_super) {
        __extends(Queue, _super);
        function Queue(children) {
            if (children === void 0) { children = []; }
            _super.call(this);
            this.children = children;
        }
        Queue.create = function (children) {
            if (children === void 0) { children = []; }
            var obj = new this(children);
            return obj;
        };
        Object.defineProperty(Queue.prototype, "front", {
            get: function () {
                return this.children[this.children.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Queue.prototype, "rear", {
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Queue.prototype.push = function (element) {
            this.children.unshift(element);
        };
        Queue.prototype.pop = function () {
            return this.children.pop();
        };
        Queue.prototype.clear = function () {
            this.removeAllChildren();
        };
        return Queue;
    }(wdCb.List));
    wdCb.Queue = Queue;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var Stack = (function (_super) {
        __extends(Stack, _super);
        function Stack(children) {
            if (children === void 0) { children = []; }
            _super.call(this);
            this.children = children;
        }
        Stack.create = function (children) {
            if (children === void 0) { children = []; }
            var obj = new this(children);
            return obj;
        };
        Object.defineProperty(Stack.prototype, "top", {
            get: function () {
                return this.children[this.children.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Stack.prototype.push = function (element) {
            this.children.push(element);
        };
        Stack.prototype.pop = function () {
            return this.children.pop();
        };
        Stack.prototype.clear = function () {
            this.removeAllChildren();
        };
        Stack.prototype.clone = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var target = null, isDeep = null;
            if (args.length === 0) {
                isDeep = false;
                target = Stack.create();
            }
            else if (args.length === 1) {
                if (wdCb.JudgeUtils.isBoolean(args[0])) {
                    target = Stack.create();
                    isDeep = args[0];
                }
                else {
                    target = args[0];
                    isDeep = false;
                }
            }
            else {
                target = args[0];
                isDeep = args[1];
            }
            if (isDeep === true) {
                target.setChildren(wdCb.ExtendUtils.extendDeep(this.children));
            }
            else {
                target.setChildren(wdCb.ExtendUtils.extend([], this.children));
            }
            return target;
        };
        Stack.prototype.filter = function (func) {
            var children = this.children, result = [], value = null;
            for (var i = 0, len = children.length; i < len; i++) {
                value = children[i];
                if (func.call(children, value, i)) {
                    result.push(value);
                }
            }
            return wdCb.Collection.create(result);
        };
        Stack.prototype.findOne = function (func) {
            var scope = this.children, result = null;
            this.forEach(function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result = value;
                return wdCb.$BREAK;
            });
            return result;
        };
        Stack.prototype.reverse = function () {
            return wdCb.Collection.create(this.copyChildren().reverse());
        };
        Stack.prototype.removeChild = function (arg) {
            return wdCb.Collection.create(this.removeChildHelper(arg));
        };
        Stack.prototype.sort = function (func, isSortSelf) {
            if (isSortSelf === void 0) { isSortSelf = false; }
            if (isSortSelf) {
                this.children.sort(func);
                return this;
            }
            return wdCb.Collection.create(this.copyChildren().sort(func));
        };
        Stack.prototype.map = function (func) {
            var resultArr = [];
            this.forEach(function (e, index) {
                var result = func(e, index);
                if (result !== wdCb.$REMOVE) {
                    resultArr.push(result);
                }
            });
            return wdCb.Collection.create(resultArr);
        };
        Stack.prototype.removeRepeatItems = function () {
            var noRepeatList = wdCb.Collection.create();
            this.forEach(function (item) {
                if (noRepeatList.hasChild(item)) {
                    return;
                }
                noRepeatList.addChild(item);
            });
            return noRepeatList;
        };
        Stack.prototype.hasRepeatItems = function () {
            var noRepeatList = wdCb.Collection.create(), hasRepeat = false;
            this.forEach(function (item) {
                if (noRepeatList.hasChild(item)) {
                    hasRepeat = true;
                    return wdCb.$BREAK;
                }
                noRepeatList.addChild(item);
            });
            return hasRepeat;
        };
        return Stack;
    }(wdCb.List));
    wdCb.Stack = Stack;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var AjaxUtils = (function () {
        function AjaxUtils() {
        }
        AjaxUtils.ajax = function (conf) {
            var type = conf.type;
            var url = conf.url;
            var data = conf.data;
            var dataType = conf.dataType;
            var success = conf.success;
            var error = conf.error;
            var xhr = null;
            var self = this;
            if (type === null) {
                type = "get";
            }
            if (dataType === null) {
                dataType = "text";
            }
            xhr = this._createAjax(error);
            if (!xhr) {
                return;
            }
            try {
                xhr.open(type, url, true);
                if (this._isSoundFile(dataType)) {
                    xhr.responseType = "arraybuffer";
                }
                if (type === "GET" || type === "get") {
                    xhr.send(null);
                }
                else if (type === "POST" || type === "post") {
                    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                    xhr.send(data);
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4
                        && (xhr.status === 200 || self._isLocalFile(xhr.status))) {
                        if (dataType === "text" || dataType === "TEXT") {
                            if (success !== null) {
                                success(xhr.responseText);
                            }
                        }
                        else if (dataType === "xml" || dataType === "XML") {
                            if (success !== null) {
                                success(xhr.responseXML);
                            }
                        }
                        else if (dataType === "json" || dataType === "JSON") {
                            if (success !== null) {
                                success(eval("(" + xhr.responseText + ")"));
                            }
                        }
                        else if (self._isSoundFile(dataType)) {
                            if (success !== null) {
                                success(xhr.response);
                            }
                        }
                    }
                };
            }
            catch (e) {
                error(xhr, e);
            }
        };
        AjaxUtils._createAjax = function (error) {
            var xhr = null;
            try {
                xhr = new ActiveXObject("microsoft.xmlhttp");
            }
            catch (e1) {
                try {
                    xhr = new XMLHttpRequest();
                }
                catch (e2) {
                    error(xhr, { message: "您的浏览器不支持ajax，请更换！" });
                    return null;
                }
            }
            return xhr;
        };
        AjaxUtils._isLocalFile = function (status) {
            return document.URL.contain("file://") && status === 0;
        };
        AjaxUtils._isSoundFile = function (dataType) {
            return dataType === "arraybuffer";
        };
        return AjaxUtils;
    }());
    wdCb.AjaxUtils = AjaxUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
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
            if (wdCb.JudgeUtils.isFunction(ele)) {
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
    wdCb.ArrayUtils = ArrayUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var ConvertUtils = (function () {
        function ConvertUtils() {
        }
        ConvertUtils.toString = function (obj) {
            if (wdCb.JudgeUtils.isNumber(obj)) {
                return String(obj);
            }
            if (wdCb.JudgeUtils.isFunction(obj)) {
                return this._convertCodeToString(obj);
            }
            if (wdCb.JudgeUtils.isDirectObject(obj) || wdCb.JudgeUtils.isArray(obj)) {
                return JSON.stringify(obj);
            }
            return String(obj);
        };
        ConvertUtils._convertCodeToString = function (fn) {
            return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
        };
        return ConvertUtils;
    }());
    wdCb.ConvertUtils = ConvertUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var EventUtils = (function () {
        function EventUtils() {
        }
        EventUtils.bindEvent = function (context, func) {
            return function (event) {
                return func.call(context, event);
            };
        };
        EventUtils.addEvent = function (dom, eventName, handler) {
            if (wdCb.JudgeUtils.isHostMethod(dom, "addEventListener")) {
                dom.addEventListener(eventName, handler, false);
            }
            else if (wdCb.JudgeUtils.isHostMethod(dom, "attachEvent")) {
                dom.attachEvent("on" + eventName, handler);
            }
            else {
                dom["on" + eventName] = handler;
            }
        };
        EventUtils.removeEvent = function (dom, eventName, handler) {
            if (wdCb.JudgeUtils.isHostMethod(dom, "removeEventListener")) {
                dom.removeEventListener(eventName, handler, false);
            }
            else if (wdCb.JudgeUtils.isHostMethod(dom, "detachEvent")) {
                dom.detachEvent("on" + eventName, handler);
            }
            else {
                dom["on" + eventName] = null;
            }
        };
        return EventUtils;
    }());
    wdCb.EventUtils = EventUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
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
                destination[property] = source[property];
            }
            return destination;
        };
        ExtendUtils.copyPublicAttri = function (source) {
            var property = null, destination = {};
            this.extendDeep(source, destination, function (item, property) {
                return property.slice(0, 1) !== "_"
                    && !wdCb.JudgeUtils.isFunction(item);
            });
            return destination;
        };
        return ExtendUtils;
    }());
    wdCb.ExtendUtils = ExtendUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var SPLITPATH_REGEX = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var PathUtils = (function () {
        function PathUtils() {
        }
        PathUtils.basename = function (path, ext) {
            var f = this._splitPath(path)[2];
            if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
            }
            return f;
        };
        PathUtils.changeExtname = function (pathStr, extname) {
            var extname = extname || "", index = pathStr.indexOf("?"), tempStr = "";
            if (index > 0) {
                tempStr = pathStr.substring(index);
                pathStr = pathStr.substring(0, index);
            }
            index = pathStr.lastIndexOf(".");
            if (index < 0) {
                return pathStr + extname + tempStr;
            }
            return pathStr.substring(0, index) + extname + tempStr;
        };
        PathUtils.changeBasename = function (pathStr, basename, isSameExt) {
            if (isSameExt === void 0) { isSameExt = false; }
            var index = null, tempStr = null, ext = null;
            if (basename.indexOf(".") == 0) {
                return this.changeExtname(pathStr, basename);
            }
            index = pathStr.indexOf("?");
            tempStr = "";
            ext = isSameExt ? this.extname(pathStr) : "";
            if (index > 0) {
                tempStr = pathStr.substring(index);
                pathStr = pathStr.substring(0, index);
            }
            index = pathStr.lastIndexOf("/");
            index = index <= 0 ? 0 : index + 1;
            return pathStr.substring(0, index) + basename + ext + tempStr;
        };
        PathUtils.extname = function (path) {
            return this._splitPath(path)[3];
        };
        PathUtils.dirname = function (path) {
            var result = this._splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
                return '.';
            }
            if (dir) {
                dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
        };
        PathUtils._splitPath = function (fileName) {
            return SPLITPATH_REGEX.exec(fileName).slice(1);
        };
        return PathUtils;
    }());
    wdCb.PathUtils = PathUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
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
    wdCb.FunctionUtils = FunctionUtils;
})(wdCb || (wdCb = {}));
var wdCb;
(function (wdCb) {
    var DomQuery = (function () {
        function DomQuery() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._doms = null;
            if (wdCb.JudgeUtils.isDom(args[0])) {
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
                args[_i - 0] = arguments[_i];
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
                args[_i - 0] = arguments[_i];
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
                args[_i - 0] = arguments[_i];
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
        DomQuery.prototype._isDomEleStr = function (eleStr) {
            return eleStr.match(/<(\w+)[^>]*><\/\1>/) !== null;
        };
        DomQuery.prototype._buildDom = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (wdCb.JudgeUtils.isString(args[0])) {
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
    wdCb.DomQuery = DomQuery;
})(wdCb || (wdCb = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9KdWRnZVV0aWxzLnRzIiwic3JjL2dsb2JhbC9WYXJpYWJsZS50cyIsInNyYy9nbG9iYWwvZXh0ZW5kLnRzIiwic3JjL2dsb2JhbC9Db25zdC50cyIsInNyYy9Mb2cudHMiLCJzcmMvTGlzdC50cyIsInNyYy9Db2xsZWN0aW9uLnRzIiwic3JjL0hhc2gudHMiLCJzcmMvUXVldWUudHMiLCJzcmMvU3RhY2sudHMiLCJzcmMvdXRpbHMvQWpheFV0aWxzLnRzIiwic3JjL3V0aWxzL0FycmF5VXRpbHMudHMiLCJzcmMvdXRpbHMvQ29udmVydFV0aWxzLnRzIiwic3JjL3V0aWxzL0V2ZW50VXRpbHMudHMiLCJzcmMvdXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJzcmMvdXRpbHMvUGF0aFV0aWxzLnRzIiwic3JjL3V0aWxzL0Z1bmN0aW9uVXRpbHMudHMiLCJzcmMvdXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFPLElBQUksQ0FpR1Y7QUFqR0QsV0FBTyxJQUFJLEVBQUMsQ0FBQztJQUdULElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1QztRQUFBO1FBOEVBLENBQUM7UUE3RWlCLGtCQUFPLEdBQXJCLFVBQXNCLEdBQU87WUFDekIsSUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFFL0IsTUFBTSxDQUFDLE9BQU8sTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxlQUFlLENBQUM7UUFDakYsQ0FBQztRQUVhLHlCQUFjLEdBQTVCLFVBQTZCLEdBQU87WUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxnQkFBZ0IsQ0FBQztRQUNwRSxDQUFDO1FBRWEsbUJBQVEs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dEIsVUFBdUIsTUFBTTtZQUN6QixNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0wsZUFBQztJQUFELENBM0hBLEFBMkhDLElBQUE7SUEzSFksYUFBUSxXQTJIcEIsQ0FBQTtBQUNMLENBQUMsRUEvSE0sSUFBSSxLQUFKLElBQUksUUErSFYiLCJmaWxlIjoid2RDYi5kZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB3ZENiIHtcbiAgICBkZWNsYXJlIHZhciBnbG9iYWw6YW55LCBtb2R1bGU6YW55O1xuXG4gICAgY29uc3QgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAgIGV4cG9ydCBjbGFzcyBKdWRnZVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5KGFycjphbnkpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcnIgJiYgYXJyLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheUV4YWN0bHkoYXJyOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG51bTphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09IFwibnVtYmVyXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyRXhhY3RseShudW06YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG51bSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cjphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyID09IFwic3RyaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nRXhhY3RseShzdHI6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihib29sOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChib29sKSA9PT0gJ1tib29sZWN0IEJvb2xlYW5dJztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEb20ob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzT2JqZWN0KG9iajphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3Q6YW55LCBwcm9wZXJ0eTphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iamVjdFtwcm9wZXJ0eV0pIHx8XG4gICAgICAgICAgICAgICAgdHlwZSA9PT0gXCJ1bmtub3duXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTm9kZUpzKCl7XG4gICAgICAgICAgICByZXR1cm4gKCh0eXBlb2YgZ2xvYmFsICE9IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLm1vZHVsZSkgfHwgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIikpICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9vdmVyd3JpdGUgaXQgaW4gdGhlIGVuZCBvZiB0aGlzIGZpbGVcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmM6YW55KTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAgIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICAgIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgICAgICBKdWRnZVV0aWxzLmlzRnVuY3Rpb24gPSAoZnVuYzphbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgSnVkZ2VVdGlscy5pc0Z1bmN0aW9uID0gKGZ1bmM6YW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZGVjbGFyZSB2YXIgZ2xvYmFsOmFueSx3aW5kb3c6V2luZG93O1xuXG5tb2R1bGUgd2RDYntcbiAgICBleHBvcnQgdmFyIHJvb3Q6YW55O1xuXG4gICAgaWYoSnVkZ2VVdGlscy5pc05vZGVKcygpICYmIHR5cGVvZiBnbG9iYWwgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIHJvb3QgPSBnbG9iYWw7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIHJvb3QgPSB3aW5kb3c7XG4gICAgfVxufVxuXG5cbiIsIm1vZHVsZSB3ZENie1xuLy8gcGVyZm9ybWFuY2Uubm93IHBvbHlmaWxsXG5cbiAgICBpZiAoJ3BlcmZvcm1hbmNlJyBpbiByb290ID09PSBmYWxzZSkge1xuICAgICAgICByb290LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4vLyBJRSA4XG4gICAgRGF0ZS5ub3cgPSAoIERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0gKTtcblxuICAgIGlmICgnbm93JyBpbiByb290LnBlcmZvcm1hbmNlID09PSBmYWxzZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcgJiYgcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIHJvb3QucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBvZmZzZXQ7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZXhwb3J0IGNvbnN0ICRCUkVBSyA9IHtcbiAgICAgICAgYnJlYWs6dHJ1ZVxuICAgIH07XG4gICAgZXhwb3J0IGNvbnN0ICRSRU1PVkUgPSB2b2lkIDA7XG59XG5cblxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG5cbiAgICAgICAgICAgIGhlbHBlckZ1bmM6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcodmFsKSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNzZXJ0aW9uOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBpZihhcmdzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoYXJncy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3NbMV0sIGFyZ3NbMF0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmdzLmxlbmd0aCBtdXN0IDw9IDNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgRlVOQ19JTlZBTElEOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImludmFsaWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzaG91bGRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTERfTk9UOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInNob3VsZCBub3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm5vdCBzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgZGVmaW5lXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBkZWZpbmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVua25vd1wiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX0VYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVuZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhJU1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImV4aXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX0VYSVNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJub3QgZXhpc3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19PTkxZOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJvbmx5XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfQ0FOX05PVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiY2FuJ3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZighdGhpcy5fZXhlYyhcImxvZ1wiLCBtZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICByb290LmFsZXJ0KG1lc3NhZ2VzLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIG1lc3NhZ2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmlq3oqIDlpLHotKXml7bvvIzkvJrmj5DnpLrplJnor6/kv6Hmga/vvIzkvYbnqIvluo/kvJrnu6fnu63miafooYzkuIvljrtcbiAgICAgICAgICog5L2/55So5pat6KiA5o2V5o2J5LiN5bqU6K+l5Y+R55Sf55qE6Z2e5rOV5oOF5Ya144CC5LiN6KaB5re35reG6Z2e5rOV5oOF5Ya15LiO6ZSZ6K+v5oOF5Ya15LmL6Ze055qE5Yy65Yir77yM5ZCO6ICF5piv5b+F54S25a2Y5Zyo55qE5bm25LiU5piv5LiA5a6a6KaB5L2c5Ye65aSE55CG55qE44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIDHvvInlr7npnZ7pooTmnJ/plJnor6/kvb/nlKjmlq3oqIBcbiAgICAgICAgIOaWreiogOS4reeahOW4g+WwlOihqOi+vuW8j+eahOWPjemdouS4gOWumuimgeaPj+i/sOS4gOS4qumdnumihOacn+mUmeivr++8jOS4i+mdouaJgOi/sOeahOWcqOS4gOWumuaDheWGteS4i+S4uumdnumihOacn+mUmeivr+eahOS4gOS6m+S+i+WtkO+8mlxuICAgICAgICAg77yIMe+8ieepuuaMh+mSiOOAglxuICAgICAgICAg77yIMu+8iei+k+WFpeaIluiAhei+k+WHuuWPguaVsOeahOWAvOS4jeWcqOmihOacn+iMg+WbtOWGheOAglxuICAgICAgICAg77yIM++8ieaVsOe7hOeahOi2iueVjOOAglxuICAgICAgICAg6Z2e6aKE5pyf6ZSZ6K+v5a+55bqU55qE5bCx5piv6aKE5pyf6ZSZ6K+v77yM5oiR5Lus6YCa5bi45L2/55So6ZSZ6K+v5aSE55CG5Luj56CB5p2l5aSE55CG6aKE5pyf6ZSZ6K+v77yM6ICM5L2/55So5pat6KiA5aSE55CG6Z2e6aKE5pyf6ZSZ6K+v44CC5Zyo5Luj56CB5omn6KGM6L+H56iL5Lit77yM5pyJ5Lqb6ZSZ6K+v5rC46L+c5LiN5bqU6K+l5Y+R55Sf77yM6L+Z5qC355qE6ZSZ6K+v5piv6Z2e6aKE5pyf6ZSZ6K+v44CC5pat6KiA5Y+v5Lul6KKr55yL5oiQ5piv5LiA56eN5Y+v5omn6KGM55qE5rOo6YeK77yM5L2g5LiN6IO95L6d6LWW5a6D5p2l6K6p5Luj56CB5q2j5bi45bel5L2c77yI44CKQ29kZSBDb21wbGV0ZSAy44CL77yJ44CC5L6L5aaC77yaXG4gICAgICAgICBpbnQgblJlcyA9IGYoKTsgLy8gblJlcyDnlLEgZiDlh73mlbDmjqfliLbvvIwgZiDlh73mlbDkv53or4Hov5Tlm57lgLzkuIDlrprlnKggLTEwMCB+IDEwMFxuICAgICAgICAgQXNzZXJ0KC0xMDAgPD0gblJlcyAmJiBuUmVzIDw9IDEwMCk7IC8vIOaWreiogO+8jOS4gOS4quWPr+aJp+ihjOeahOazqOmHilxuICAgICAgICAg55Sx5LqOIGYg5Ye95pWw5L+d6K+B5LqG6L+U5Zue5YC85aSE5LqOIC0xMDAgfiAxMDDvvIzpgqPkuYjlpoLmnpzlh7rnjrDkuoYgblJlcyDkuI3lnKjov5nkuKrojIPlm7TnmoTlgLzml7bvvIzlsLHooajmmI7kuIDkuKrpnZ7pooTmnJ/plJnor6/nmoTlh7rnjrDjgILlkI7pnaLkvJrorrLliLDigJzpmpTmoI/igJ3vvIzpgqPml7bkvJrlr7nmlq3oqIDmnInmm7TliqDmt7HliLvnmoTnkIbop6PjgIJcbiAgICAgICAgIDLvvInkuI3opoHmiorpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK1cbiAgICAgICAgIOaWreiogOeUqOS6jui9r+S7tueahOW8gOWPkeWSjOe7tOaKpO+8jOiAjOmAmuW4uOS4jeWcqOWPkeihjOeJiOacrOS4reWMheWQq+aWreiogOOAglxuICAgICAgICAg6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5Lit5piv5LiN5q2j56Gu55qE77yM5Zug5Li65Zyo5Y+R6KGM54mI5pys5Lit77yM6L+Z5Lqb5Luj56CB6YCa5bi45LiN5Lya6KKr5omn6KGM77yM5L6L5aaC77yaXG4gICAgICAgICBBc3NlcnQoZigpKTsgLy8gZiDlh73mlbDpgJrluLjlnKjlj5HooYzniYjmnKzkuK3kuI3kvJrooqvmiafooYxcbiAgICAgICAgIOiAjOS9v+eUqOWmguS4i+aWueazleWImeavlOi+g+WuieWFqO+8mlxuICAgICAgICAgcmVzID0gZigpO1xuICAgICAgICAgQXNzZXJ0KHJlcyk7IC8vIOWuieWFqFxuICAgICAgICAgM++8ieWvueadpea6kOS6juWGhemDqOezu+e7n+eahOWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOiAjOS4jeimgeWvueWklumDqOS4jeWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOWvueS6juWklumDqOS4jeWPr+mdoOaVsOaNru+8jOW6lOivpeS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeOAglxuICAgICAgICAg5YaN5qyh5by66LCD77yM5oqK5pat6KiA55yL5oiQ5Y+v5omn6KGM55qE5rOo6YeK44CCXG4gICAgICAgICAqIEBwYXJhbSBjb25kIOWmguaenGNvbmTov5Tlm55mYWxzZe+8jOWImeaWreiogOWksei0pe+8jOaYvuekum1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXNzZXJ0KGNvbmQsIC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZiAoY29uZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZXhlYyhcImFzc2VydFwiLCBhcmd1bWVudHMsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgLi4ubWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgLyohXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciB3aWxsIG5vdCBpbnRlcnJ1cHQsIGl0IHdpbGwgdGhyb3cgZXJyb3IgYW5kIGNvbnRpbnVlIGV4ZWMgdGhlIGxlZnQgc3RhdGVtZW50c1xuXG4gICAgICAgICAgICAgICAgYnV0IGhlcmUgbmVlZCBpbnRlcnJ1cHQhIHNvIG5vdCB1c2UgaXQgaGVyZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL2lmICghdGhpcy5fZXhlYyhcImVycm9yXCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuam9pbihcIlxcblwiKSk7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhcm4oLi4ubWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2V4ZWMoXCJ3YXJuXCIsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIFtcIndhcm4gdHJhY2VcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2V4ZWMoY29uc29sZU1ldGhvZCwgYXJncywgc2xpY2VCZWdpbiA9IDApIHtcbiAgICAgICAgICAgIGlmIChyb290LmNvbnNvbGUgJiYgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdLmFwcGx5KHJvb3QuY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VCZWdpbikpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgTGlzdDxUPiB7XG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjpBcnJheTxUPiA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChjaGlsZDphbnkpOmJvb2xlYW4ge1xuICAgICAgICAgICAgdmFyIGM6YW55ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGMgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC51aWQgJiYgYy51aWQgJiYgY2hpbGQudWlkID09IGMudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGNoaWxkID09PSBjKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGZ1bmModGhpcy5jaGlsZHJlbltpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGluZGV4Om51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkOlQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKGFyZzpBcnJheTxUPnxMaXN0PFQ+fGFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkFycmF5PFQ+ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgTGlzdCl7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkxpc3Q8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4uZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQ6YW55ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90b2RvIHRlc3RcbiAgICAgICAgcHVibGljIHNldENoaWxkcmVuKGNoaWxkcmVuOkFycmF5PFQ+KSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHVuU2hpZnRDaGlsZChjaGlsZDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHVibGljIHJlbW92ZUNoaWxkQXQgKGluZGV4KSB7XG4gICAgICAgIC8vICAgIExvZy5lcnJvcihpbmRleCA8IDAsIFwi5bqP5Y+35b+F6aG75aSn5LqO562J5LqOMFwiKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgY29weUNoaWxkcmVuKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5zbGljZSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCByZW1vdmVDaGlsZEhlbHBlcihhcmc6YW55KTpBcnJheTxUPiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnVpZCA9PT0gYXJnLnVpZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sICAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZSA9PT0gYXJnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9yRWFjaChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGNvbnRleHQsXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChzY29wZSwgYXJyW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZUNoaWxkKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHJlbWFpbkVsZW1lbnRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCEhZnVuYy5jYWxsKHNlbGYsIGUpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEVsZW1lbnRBcnIucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gcmVtYWluRWxlbWVudEFycjtcblxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRFbGVtZW50QXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xvbmUoKTtcbiAgICAgICAgcHVibGljIGNsb25lKGlzRGVlcDogYm9vbGVhbik7XG4gICAgICAgIHB1YmxpYyBjbG9uZSh0YXJnZXQ6IENvbGxlY3Rpb248VD4pO1xuICAgICAgICBwdWJsaWMgY2xvbmUodGFyZ2V0OiBDb2xsZWN0aW9uPFQ+LCBpc0RlZXA6IGJvb2xlYW4pO1xuXG4gICAgICAgIHB1YmxpYyBjbG9uZSguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0OiBDb2xsZWN0aW9uPFQ+ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBpc0RlZXA6IGJvb2xlYW4gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBpc0RlZXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBDb2xsZWN0aW9uLmNyZWF0ZTxUPigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Jvb2xlYW4oYXJnc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gQ29sbGVjdGlvbi5jcmVhdGU8VD4oKTtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWVwID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIGlzRGVlcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgaXNEZWVwID0gYXJnc1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzRGVlcCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRDaGlsZHJlbihFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRDaGlsZHJlbihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2UpOkNvbGxlY3Rpb248VD57XG4gICAgICAgICAgICBpZihpc1NvcnRTZWxmKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYW55KXtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZSAmJiBlW2hhbmRsZXJOYW1lXSAmJiBlW2hhbmRsZXJOYW1lXS5hcHBseShjb250ZXh0IHx8IGUsIHZhbHVlQXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8YW55PihyZXN1bHRBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZVJlcGVhdEl0ZW1zKCl7XG4gICAgICAgICAgICB2YXIgbm9SZXBlYXRMaXN0ID0gIENvbGxlY3Rpb24uY3JlYXRlPFQ+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoaXRlbTpUKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5vUmVwZWF0TGlzdC5oYXNDaGlsZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbm9SZXBlYXRMaXN0LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBub1JlcGVhdExpc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzUmVwZWF0SXRlbXMoKXtcbiAgICAgICAgICAgIHZhciBub1JlcGVhdExpc3QgPSAgQ29sbGVjdGlvbi5jcmVhdGU8VD4oKSxcbiAgICAgICAgICAgICAgICBoYXNSZXBlYXQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGl0ZW06VCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub1JlcGVhdExpc3QuaGFzQ2hpbGQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzUmVwZWF0ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5vUmVwZWF0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGFzUmVwZWF0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBIYXNoPFQ+IHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSB7fSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPHsgW3M6c3RyaW5nXTpUIH0+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46eyBbczpzdHJpbmddOlQgfSA9IHt9KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbjp7XG4gICAgICAgICAgICBbczpzdHJpbmddOlRcbiAgICAgICAgfSA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0S2V5cygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IENvbGxlY3Rpb24uY3JlYXRlPHN0cmluZz4oKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFZhbHVlcygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IENvbGxlY3Rpb24uY3JlYXRlPFQ+KCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZChjaGlsZHJlbltrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoa2V5OnN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUoa2V5OnN0cmluZywgdmFsdWU6YW55KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoa2V5OnN0cmluZywgdmFsdWU6YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKGFyZzp7fXxIYXNoPFQ+KXtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmKGFyZyBpbnN0YW5jZW9mIEhhc2gpe1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gYXJnLmdldENoaWxkcmVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gYXJnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGksIGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFwcGVuZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuW2tleV0gaW5zdGFuY2VvZiBDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSA8YW55Pih0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIGMuYWRkQ2hpbGQoPFQ+dmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IDxhbnk+KENvbGxlY3Rpb24uY3JlYXRlPGFueT4oKS5hZGRDaGlsZCh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDaGlsZHJlbihjaGlsZHJlbjp7IFtzOnN0cmluZ106VCB9KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSk6Q29sbGVjdGlvbjxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmcpKXtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc2VsZi5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChrZXk6c3RyaW5nKTpib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldICE9PSB2b2lkIDA7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KXtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbik6SGFzaDxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltrZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBba2V5LCBzZWxmLmdldENoaWxkKGtleSldO1xuICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbik6SGFzaDxUPiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGU8VD4ocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0NvbGxlY3Rpb24oKTpDb2xsZWN0aW9uPGFueT57XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkcmVuKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZih2YWwgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICAvLyAgICBMb2cuZXJyb3IodHJ1ZSwgTG9nLmluZm8uRlVOQ19OT1RfU1VQUE9SVChcInRvQ29sbGVjdGlvblwiLCBcInZhbHVlIGlzIEhhc2hcIikpO1xuICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKTpBcnJheTxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodmFsIGluc3RhbmNlb2YgQ29sbGVjdGlvbil7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodmFsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsb25lKCk7XG4gICAgICAgIHB1YmxpYyBjbG9uZShpc0RlZXA6IGJvb2xlYW4pO1xuICAgICAgICBwdWJsaWMgY2xvbmUodGFyZ2V0OiBIYXNoPFQ+KTtcbiAgICAgICAgcHVibGljIGNsb25lKHRhcmdldDogSGFzaDxUPiwgaXNEZWVwOiBib29sZWFuKTtcblxuICAgICAgICBwdWJsaWMgY2xvbmUoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIHRhcmdldDogSGFzaDxUPiA9IG51bGwsXG4gICAgICAgICAgICAgICAgaXNEZWVwOiBib29sZWFuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaXNEZWVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gSGFzaC5jcmVhdGU8VD4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNCb29sZWFuKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IEhhc2guY3JlYXRlPFQ+KCk7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVlcCA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICBpc0RlZXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIGlzRGVlcCA9IGFyZ3NbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0RlZXAgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0Q2hpbGRyZW4oRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcCh0aGlzLl9jaGlsZHJlbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNldENoaWxkcmVuKEV4dGVuZFV0aWxzLmV4dGVuZCh7fSwgdGhpcy5fY2hpbGRyZW4pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFF1ZXVlPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZyb250KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlYXIoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHB1c2goZWxlbWVudDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwb3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsZWFyKCl7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFN0YWNrPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsb25lKCk7XG4gICAgICAgIHB1YmxpYyBjbG9uZShpc0RlZXA6IGJvb2xlYW4pO1xuICAgICAgICBwdWJsaWMgY2xvbmUodGFyZ2V0OiBTdGFjazxUPik7XG4gICAgICAgIHB1YmxpYyBjbG9uZSh0YXJnZXQ6IFN0YWNrPFQ+LCBpc0RlZXA6IGJvb2xlYW4pO1xuXG4gICAgICAgIHB1YmxpYyBjbG9uZSguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0OiBTdGFjazxUPiA9IG51bGwsXG4gICAgICAgICAgICAgICAgaXNEZWVwOiBib29sZWFuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaXNEZWVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gU3RhY2suY3JlYXRlPFQ+KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzQm9vbGVhbihhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBTdGFjay5jcmVhdGU8VD4oKTtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWVwID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIGlzRGVlcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgaXNEZWVwID0gYXJnc1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzRGVlcCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRDaGlsZHJlbihFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRDaGlsZHJlbihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2UpOkNvbGxlY3Rpb248VD57XG4gICAgICAgICAgICBpZihpc1NvcnRTZWxmKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYW55KXtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZSAmJiBlW2hhbmRsZXJOYW1lXSAmJiBlW2hhbmRsZXJOYW1lXS5hcHBseShjb250ZXh0IHx8IGUsIHZhbHVlQXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8YW55PihyZXN1bHRBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZVJlcGVhdEl0ZW1zKCl7XG4gICAgICAgICAgICB2YXIgbm9SZXBlYXRMaXN0ID0gIENvbGxlY3Rpb24uY3JlYXRlPFQ+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoaXRlbTpUKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5vUmVwZWF0TGlzdC5oYXNDaGlsZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbm9SZXBlYXRMaXN0LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBub1JlcGVhdExpc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzUmVwZWF0SXRlbXMoKXtcbiAgICAgICAgICAgIHZhciBub1JlcGVhdExpc3QgPSAgQ29sbGVjdGlvbi5jcmVhdGU8VD4oKSxcbiAgICAgICAgICAgICAgICBoYXNSZXBlYXQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGl0ZW06VCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub1JlcGVhdExpc3QuaGFzQ2hpbGQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzUmVwZWF0ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5vUmVwZWF0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGFzUmVwZWF0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIEFqYXhVdGlsc3tcbiAgICAgICAgLyohXG4gICAgICAgICDlrp7njrBhamF4XG5cbiAgICAgICAgIGFqYXgoe1xuICAgICAgICAgdHlwZTpcInBvc3RcIiwvL3Bvc3TmiJbogIVnZXTvvIzpnZ7lv4XpobtcbiAgICAgICAgIHVybDpcInRlc3QuanNwXCIsLy/lv4XpobvnmoRcbiAgICAgICAgIGRhdGE6XCJuYW1lPWRpcG9vJmluZm89Z29vZFwiLC8v6Z2e5b+F6aG7XG4gICAgICAgICBkYXRhVHlwZTpcImpzb25cIiwvL3RleHQveG1sL2pzb27vvIzpnZ7lv4XpobtcbiAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7Ly/lm57osIPlh73mlbDvvIzpnZ7lv4XpobtcbiAgICAgICAgIGFsZXJ0KGRhdGEubmFtZSk7XG4gICAgICAgICB9XG4gICAgICAgICB9KTsqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFqYXgoY29uZil7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNvbmYudHlwZTsvL3R5cGXlj4LmlbAs5Y+v6YCJXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZi51cmw7Ly91cmzlj4LmlbDvvIzlv4XloatcbiAgICAgICAgICAgIHZhciBkYXRhID0gY29uZi5kYXRhOy8vZGF0YeWPguaVsOWPr+mAie+8jOWPquacieWcqHBvc3Tor7fmsYLml7bpnIDopoFcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IGNvbmYuZGF0YVR5cGU7Ly9kYXRhdHlwZeWPguaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjb25mLnN1Y2Nlc3M7Ly/lm57osIPlh73mlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNvbmYuZXJyb3I7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHsvL3R5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLpnZXRcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJnZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gbnVsbCkgey8vZGF0YVR5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLp0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyID0gdGhpcy5fY3JlYXRlQWpheChlcnJvcik7XG4gICAgICAgICAgICBpZiAoIXhocikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkdFVFwiIHx8IHR5cGUgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwiUE9TVFwiIHx8IHR5cGUgPT09IFwicG9zdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenGFqYXjorr/pl67nmoTmmK/mnKzlnLDmlofku7bvvIzliJlzdGF0dXPkuLowXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHNlbGYuX2lzTG9jYWxGaWxlKHhoci5zdGF0dXMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBcInRleHRcIiB8fCBkYXRhVHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5pmu6YCa5paH5pysXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwieG1sXCIgfHwgZGF0YVR5cGUgPT09IFwiWE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5o6l5pS2eG1s5paH5qGjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJqc29uXCIgfHwgZGF0YVR5cGUgPT09IFwiSlNPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGV2YWwoXCIoXCIgKyB4aHIucmVzcG9uc2VUZXh0ICsgXCIpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZUFqYXgoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHsvL0lF57O75YiX5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJtaWNyb3NvZnQueG1saHR0cFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsvL+mdnklF5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHhociwge21lc3NhZ2U6IFwi5oKo55qE5rWP6KeI5Zmo5LiN5pSv5oyBYWpheO+8jOivt+abtOaNou+8gVwifSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNMb2NhbEZpbGUoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuVVJMLmNvbnRhaW4oXCJmaWxlOi8vXCIpICYmIHN0YXR1cyA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc1NvdW5kRmlsZShkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEFycmF5VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZVJlcGVhdEl0ZW1zKGFycjpBcnJheTxhbnk+LCBpc0VxdWFsOihhOmFueSwgYjphbnkpID0+IGJvb2xlYW4gPSAoYSwgYik9PiB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgICAgfSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29udGFpbihyZXN1bHRBcnIsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc0VxdWFsKHZhbCwgZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKGVsZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdEFycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udGFpbihhcnI6QXJyYXk8YW55PiwgZWxlOmFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihlbGUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmM6RnVuY3Rpb24gPSBlbGU7XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZnVuYy5jYWxsKG51bGwsIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZSA9PT0gdmFsdWUgfHwgKHZhbHVlLmNvbnRhaW4gJiYgdmFsdWUuY29udGFpbihlbGUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGV4cG9ydCBjbGFzcyBDb252ZXJ0VXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdG9TdHJpbmcob2JqOmFueSl7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc051bWJlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc2pRdWVyeShvYmopKSB7XG4gICAgICAgICAgICAvLyAgICByZXR1cm4gX2pxVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2RlVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRGlyZWN0T2JqZWN0KG9iaikgfHwgSnVkZ2VVdGlscy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jb252ZXJ0Q29kZVRvU3RyaW5nKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4udG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuc2xpY2UoMSwgLTEpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmRFdmVudChjb250ZXh0LCBmdW5jKSB7XG4gICAgICAgICAgICAvL3ZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIC8vICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZnVuLmFwcGx5KG9iamVjdCwgW3NlbGYud3JhcEV2ZW50KGV2ZW50KV0uY29uY2F0KGFyZ3MpKTsgLy/lr7nkuovku7blr7nosaHov5vooYzljIXoo4VcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImF0dGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJkZXRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFeHRlbmRVdGlscyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7Hmi7fotJ1cbiAgICAgICAgICpcbiAgICAgICAgICog56S65L6L77yaXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuaVsOe7hO+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOS4jeaLt+i0nUFycmF55Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIGV4cGVjdChleHRlbmQuZXh0ZW5kRGVlcChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSkpLnRvRXF1YWwoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pO1xuICAgICAgICAgKlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrlr7nosaHvvIzog73lpJ/miJDlip/mi7fotJ3vvIjog73mi7fotJ3ljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICBmdW5jdGlvbiBBKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQS5wcm90b3R5cGUuYSA9IDE7XG5cbiAgICAgICAgIGZ1bmN0aW9uIEIoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBCLnByb3RvdHlwZSA9IG5ldyBBKCk7XG4gICAgICAgICBCLnByb3RvdHlwZS5iID0geyB4OiAxLCB5OiAxIH07XG4gICAgICAgICBCLnByb3RvdHlwZS5jID0gW3sgeDogMSB9LCBbMl1dO1xuXG4gICAgICAgICB2YXIgdCA9IG5ldyBCKCk7XG5cbiAgICAgICAgIHJlc3VsdCA9IGV4dGVuZC5leHRlbmREZWVwKHQpO1xuXG4gICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFxuICAgICAgICAge1xuICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgYjogeyB4OiAxLCB5OiAxIH0sXG4gICAgICAgICAgICAgYzogW3sgeDogMSB9LCBbMl1dXG4gICAgICAgICB9KTtcbiAgICAgICAgICogQHBhcmFtIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgICAgICogQHJldHVybnNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kRGVlcChwYXJlbnQsIGNoaWxkPyxmaWx0ZXI9ZnVuY3Rpb24odmFsLCBpKXtyZXR1cm4gdHJ1ZTt9KSB7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuID0gMCxcbiAgICAgICAgICAgICAgICB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgc0FyciA9IFwiW29iamVjdCBBcnJheV1cIixcbiAgICAgICAgICAgICAgICBzT2IgPSBcIltvYmplY3QgT2JqZWN0XVwiLFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlwiLFxuICAgICAgICAgICAgICAgIF9jaGlsZCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8v5pWw57uE55qE6K+d77yM5LiN6I635b6XQXJyYXnljp/lnovkuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNBcnIpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHBhcmVudC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVyID0gcGFyZW50W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIobWVtYmVyLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKG1lbWJlci5jbG9uZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBtZW1iZXIuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwobWVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEV4dGVuZFV0aWxzLmV4dGVuZERlZXAobWVtYmVyLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gbWVtYmVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/lr7nosaHnmoTor53vvIzopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgILlm6DkuLrogIPomZHku6XkuIvmg4Xmma/vvJpcbiAgICAgICAgICAgIC8v57G7Qee7p+aJv+S6juexu0LvvIznjrDlnKjmg7PopoHmi7fotJ3nsbtB55qE5a6e5L6LYeeahOaIkOWRmO+8iOWMheaLrOS7juexu0Lnu6fmib/mnaXnmoTmiJDlkZjvvInvvIzpgqPkuYjlsLHpnIDopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc09iKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW1iZXIgPSBwYXJlbnRbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihtZW1iZXIsIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYobWVtYmVyLmNsb25lKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IG1lbWJlci5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChtZW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcChtZW1iZXIsIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBtZW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWF5ou36LSdXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29weVB1YmxpY0F0dHJpKHNvdXJjZTphbnkpe1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZERlZXAoc291cmNlLCBkZXN0aW5hdGlvbiwgZnVuY3Rpb24oaXRlbSwgcHJvcGVydHkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5zbGljZSgwLCAxKSAhPT0gXCJfXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgIUp1ZGdlVXRpbHMuaXNGdW5jdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIm1vZHVsZSB3ZENie1xuICAgIHZhciBTUExJVFBBVEhfUkVHRVggPVxuICAgICAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcblxuICAgIC8vcmVmZXJlbmNlIGZyb21cbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb29rZnJvbnQvbGVhcm4tbm90ZS9ibG9iL21hc3Rlci9ibG9nLWJhY2t1cC8yMDE0L25vZGVqcy1wYXRoLm1kXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhVdGlsc3tcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlbmFtZShwYXRoOnN0cmluZywgZXh0PzpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9zcGxpdFBhdGgocGF0aClbMl07XG4gICAgICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gICAgICAgICAgICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgICAgICAgICAgICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGY7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2hhbmdlRXh0bmFtZShwYXRoU3RyOnN0cmluZywgZXh0bmFtZTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBleHRuYW1lID0gZXh0bmFtZSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5pbmRleE9mKFwiP1wiKSxcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBwYXRoU3RyLnN1YnN0cmluZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgcGF0aFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiLlwiKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCl7XG4gICAgICAgICAgICAgIHJldHVybiBwYXRoU3RyICsgZXh0bmFtZSArIHRlbXBTdHI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCkgKyBleHRuYW1lICsgdGVtcFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2hhbmdlQmFzZW5hbWUocGF0aFN0cjpzdHJpbmcsIGJhc2VuYW1lOnN0cmluZywgaXNTYW1lRXh0OmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gbnVsbCxcbiAgICAgICAgICAgICAgICBleHQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoYmFzZW5hbWUuaW5kZXhPZihcIi5cIikgPT0gMCl7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUV4dG5hbWUocGF0aFN0ciwgYmFzZW5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIuaW5kZXhPZihcIj9cIik7XG4gICAgICAgICAgICB0ZW1wU3RyID0gXCJcIjtcbiAgICAgICAgICAgIGV4dCA9IGlzU2FtZUV4dCA/IHRoaXMuZXh0bmFtZShwYXRoU3RyKSA6IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoaW5kZXgpO1xuICAgICAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgICAgICBpbmRleCA9IGluZGV4IDw9IDAgPyAwIDogaW5kZXggKyAxO1xuXG4gICAgICAgICAgICByZXR1cm4gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpICsgYmFzZW5hbWUgKyBleHQgKyB0ZW1wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRuYW1lKHBhdGg6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGxpdFBhdGgocGF0aClbM107XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGRpcm5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKSxcbiAgICAgICAgICAgICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgICAgICAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICAgICAgICAgICAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAgICAgICAgICAgICAvL25vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgICAgICAgICAgICAgIHJldHVybiAnLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICAgICAgICAvL2l0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgICAgICAgICAgICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByb290ICsgZGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3NwbGl0UGF0aChmaWxlTmFtZTpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIFNQTElUUEFUSF9SRUdFWC5leGVjKGZpbGVOYW1lKS5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRnVuY3Rpb25VdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmluZChvYmplY3Q6YW55LCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KG9iamVjdCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIERvbVF1ZXJ5IHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKGFyZ3NbMF0pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZG9tczpBcnJheTxIVE1MRWxlbWVudD4gPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBjb25zdHJ1Y3Rvcihkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRG9tKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IFthcmdzWzBdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5faXNEb21FbGVTdHIoYXJnc1swXSkpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbdGhpcy5fYnVpbGREb20oYXJnc1swXSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJnc1swXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RvbXNbaW5kZXhdO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgcHJlcGVuZChlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIHByZXBlbmQoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBwdWJsaWMgcHJlcGVuZCguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RG9tOkhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgdGFyZ2V0RG9tID0gdGhpcy5fYnVpbGREb20oYXJnc1swXSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkb20uaW5zZXJ0QmVmb3JlKHRhcmdldERvbSwgZG9tLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHJlcGVuZFRvKGVsZVN0cjpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXREb206RG9tUXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICB0YXJnZXREb20gPSBEb21RdWVyeS5jcmVhdGUoZWxlU3RyKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldERvbS5wcmVwZW5kKGRvbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20gJiYgZG9tLnBhcmVudE5vZGUgJiYgZG9tLnRhZ05hbWUgIT0gJ0JPRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjc3MocHJvcGVydHk6c3RyaW5nLCB2YWx1ZTpzdHJpbmcpe1xuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBkb20uc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYXR0cihuYW1lOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBhdHRyKG5hbWU6c3RyaW5nLCB2YWx1ZTpzdHJpbmcpO1xuXG4gICAgICAgIHB1YmxpYyBhdHRyKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgaWYoYXJncy5sZW5ndGggPT09IDEpe1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJnc1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgwKS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhcmdzWzFdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaXNEb21FbGVTdHIoZWxlU3RyOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gZWxlU3RyLm1hdGNoKC88KFxcdyspW14+XSo+PFxcL1xcMT4vKSAhPT0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKGVsZVN0cjpzdHJpbmcpOkhUTUxFbGVtZW50O1xuICAgICAgICBwcml2YXRlIF9idWlsZERvbShkb206SFRNTEh0bWxFbGVtZW50KTpIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9idWlsZERvbSguLi5hcmdzKTpIVE1MRWxlbWVudCB7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzU3RyaW5nKGFyZ3NbMF0pKXtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gdGhpcy5fY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgICAgICAgICAgICAgZWxlU3RyOnN0cmluZyA9IGFyZ3NbMF07XG5cbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZWxlU3RyO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NyZWF0ZUVsZW1lbnQoZWxlU3RyKXtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZVN0cik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdfQ==
