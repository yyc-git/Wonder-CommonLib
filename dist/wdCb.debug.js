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
    })();
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
    Object.defineProperty(wdCb, "root", {
        get: function () {
            if (wdCb.JudgeUtils.isNodeJs()) {
                return global;
            }
            return window;
        }
    });
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
            ABSTRACT_ATTRIBUTE: "abstract attribute need override",
            ABSTRACT_METHOD: "abstract method need override",
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
    })();
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
            var scope = context || wdCb.root, i = 0, len = arr.length;
            for (i = 0; i < len; i++) {
                if (func.call(scope, arr[i], i) === wdCb.$BREAK) {
                    break;
                }
            }
        };
        List.prototype._removeChild = function (arr, func) {
            var self = this, index = null, removedElementArr = [], remainElementArr = [];
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
    })();
    wdCb.List = List;
})(wdCb || (wdCb = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        Collection.prototype.clone = function (isDeep) {
            if (isDeep === void 0) { isDeep = false; }
            if (isDeep) {
                return Collection.create(wdCb.ExtendUtils.extendDeep(this.children));
            }
            return Collection.create().addChildren(this.children);
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
        Collection.prototype.insertSort = function (compareFunc, isSortSelf) {
            if (isSortSelf === void 0) { isSortSelf = false; }
            var children = null;
            if (isSortSelf) {
                children = this.children;
            }
            else {
                children = wdCb.ExtendUtils.extend([], this.children);
            }
            for (var i = 1, len = this.getCount(); i < len; i++) {
                for (var j = i; j > 0 && compareFunc(children[j], children[j - 1]); j--) {
                    this._swap(children, j - 1, j);
                }
            }
            if (isSortSelf) {
                return this;
            }
            else {
                return Collection.create(children);
            }
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
        Collection.prototype._swap = function (children, i, j) {
            var t = null;
            t = children[i];
            children[i] = children[j];
            children[j] = t;
        };
        return Collection;
    })(wdCb.List);
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
        Hash.prototype.removeChild = function (arg) {
            var result = [];
            if (wdCb.JudgeUtils.isString(arg)) {
                var key = arg;
                result.push(this._children[key]);
                this._children[key] = void 0;
                delete this._children[key];
            }
            else if (wdCb.JudgeUtils.isFunction(arg)) {
                var func = arg, self_1 = this;
                this.forEach(function (val, key) {
                    if (func(val, key)) {
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
        Hash.prototype.clone = function (isDeep) {
            if (isDeep === void 0) { isDeep = false; }
            if (isDeep) {
                return Hash.create(wdCb.ExtendUtils.extendDeep(this._children));
            }
            return Hash.create().addChildren(this._children);
        };
        return Hash;
    })();
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
    })(wdCb.List);
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
        Stack.prototype.clone = function (isDeep) {
            if (isDeep === void 0) { isDeep = false; }
            if (isDeep) {
                return Stack.create(wdCb.ExtendUtils.extendDeep(this.children));
            }
            return Stack.create([].concat(this.children));
        };
        return Stack;
    })(wdCb.List);
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
    })();
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
    })();
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
    })();
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
    })();
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
                        arguments.callee(member, _child[i]);
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
                        arguments.callee(member, _child[i]);
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
    })();
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
    })();
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
    })();
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
    })();
    wdCb.DomQuery = DomQuery;
})(wdCb || (wdCb = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL0p1ZGdlVXRpbHMudHMiLCJnbG9iYWwvVmFyaWFibGUudHMiLCJnbG9iYWwvZXh0ZW5kLnRzIiwiZ2xvYmFsL0NvbnN0LnRzIiwiTG9nLnRzIiwiTGlzdC50cyIsIkNvbGxlY3Rpb24udHMiLCJIYXNoLnRzIiwiUXVldWUudHMiLCJTdGFjay50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0FycmF5VXRpbHMudHMiLCJ1dGlscy9Db252ZXJ0VXRpbHMudHMiLCJ1dGlscy9FdmVudFV0aWxzLnRzIiwidXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJ1dGlscy9QYXRoVXRpbHMudHMiLCJ1dGlscy9GdW5jdGlvblV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxJQUFJLENBaUdWO0FBakdELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFHVCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUM7UUFBQTtRQThFQSxDQUFDO1FBN0VpQixrQkFBTyxHQUFyQixVQUFzQixHQUFPO1lBQ3pCLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxPQUFPLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDO1FBQ2pGLENBQUM7UUFFYSx5QkFBYyxHQUE1QixVQUE2QixHQUFPO1lBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQWdCLENBQUM7UUFDcEUsQ0FBQztRQUVhLG1CQUFRLEdBQXRCLFVBQXVCLEdBQU87WUFDMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUNsQyxDQUFDO1FBRWEsMEJB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LENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0wsZUFBQztJQUFELENBM0hBLEFBMkhDLElBQUE7SUEzSFksYUFBUSxXQTJIcEIsQ0FBQTtBQUNMLENBQUMsRUEvSE0sSUFBSSxLQUFKLElBQUksUUErSFYiLCJmaWxlIjoid2RDYi5kZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB3ZENiIHtcbiAgICBkZWNsYXJlIHZhciBnbG9iYWw6YW55LCBtb2R1bGU6YW55O1xuXG4gICAgY29uc3QgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAgIGV4cG9ydCBjbGFzcyBKdWRnZVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5KGFycjphbnkpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcnIgJiYgYXJyLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheUV4YWN0bHkoYXJyOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG51bTphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09IFwibnVtYmVyXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyRXhhY3RseShudW06YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG51bSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cjphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyID09IFwic3RyaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nRXhhY3RseShzdHI6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihib29sOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChib29sKSA9PT0gJ1tib29sZWN0IEJvb2xlYW5dJztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEb20ob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzT2JqZWN0KG9iajphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3Q6YW55LCBwcm9wZXJ0eTphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iamVjdFtwcm9wZXJ0eV0pIHx8XG4gICAgICAgICAgICAgICAgdHlwZSA9PT0gXCJ1bmtub3duXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTm9kZUpzKCl7XG4gICAgICAgICAgICByZXR1cm4gKCh0eXBlb2YgZ2xvYmFsICE9IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLm1vZHVsZSkgfHwgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIikpICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9vdmVyd3JpdGUgaXQgaW4gdGhlIGVuZCBvZiB0aGlzIGZpbGVcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmM6YW55KTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAgIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICAgIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgICAgICBKdWRnZVV0aWxzLmlzRnVuY3Rpb24gPSAoZnVuYzphbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgSnVkZ2VVdGlscy5pc0Z1bmN0aW9uID0gKGZ1bmM6YW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZGVjbGFyZSB2YXIgZ2xvYmFsOmFueSx3aW5kb3c6YW55O1xuXG4gICAgZXhwb3J0IHZhciByb290OmFueTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2RDYiwgXCJyb290XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNOb2RlSnMoKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwibW9kdWxlIHdkQ2J7XG4vLyBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGxcblxuICAgIGlmICgncGVyZm9ybWFuY2UnIGluIHJvb3QgPT09IGZhbHNlKSB7XG4gICAgICAgIHJvb3QucGVyZm9ybWFuY2UgPSB7fTtcbiAgICB9XG5cbi8vIElFIDhcbiAgICBEYXRlLm5vdyA9ICggRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfSApO1xuXG4gICAgaWYgKCdub3cnIGluIHJvb3QucGVyZm9ybWFuY2UgPT09IGZhbHNlKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSByb290LnBlcmZvcm1hbmNlLnRpbWluZyAmJiByb290LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgPyBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gICAgICAgICAgICA6IERhdGUubm93KCk7XG5cbiAgICAgICAgcm9vdC5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG9mZnNldDtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBleHBvcnQgY29uc3QgJEJSRUFLID0ge1xuICAgICAgICBicmVhazp0cnVlXG4gICAgfTtcbiAgICBleHBvcnQgY29uc3QgJFJFTU9WRSA9IHZvaWQgMDtcbn1cblxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIExvZyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW5mbyA9IHtcbiAgICAgICAgICAgIElOVkFMSURfUEFSQU06IFwiaW52YWxpZCBwYXJhbWV0ZXJcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX0FUVFJJQlVURTogXCJhYnN0cmFjdCBhdHRyaWJ1dGUgbmVlZCBvdmVycmlkZVwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfTUVUSE9EOiBcImFic3RyYWN0IG1ldGhvZCBuZWVkIG92ZXJyaWRlXCIsXG5cbiAgICAgICAgICAgIGhlbHBlckZ1bmM6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcodmFsKSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNzZXJ0aW9uOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBpZihhcmdzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoYXJncy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3NbMV0sIGFyZ3NbMF0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmdzLmxlbmd0aCBtdXN0IDw9IDNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgRlVOQ19JTlZBTElEOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImludmFsaWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzaG91bGRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTERfTk9UOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInNob3VsZCBub3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm5vdCBzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgZGVmaW5lXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBkZWZpbmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVua25vd1wiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX0VYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVuZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhJU1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImV4aXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX0VYSVNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJub3QgZXhpc3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19PTkxZOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJvbmx5XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfQ0FOX05PVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiY2FuJ3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZighdGhpcy5fZXhlYyhcImxvZ1wiLCBtZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICByb290LmFsZXJ0KG1lc3NhZ2VzLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIG1lc3NhZ2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmlq3oqIDlpLHotKXml7bvvIzkvJrmj5DnpLrplJnor6/kv6Hmga/vvIzkvYbnqIvluo/kvJrnu6fnu63miafooYzkuIvljrtcbiAgICAgICAgICog5L2/55So5pat6KiA5o2V5o2J5LiN5bqU6K+l5Y+R55Sf55qE6Z2e5rOV5oOF5Ya144CC5LiN6KaB5re35reG6Z2e5rOV5oOF5Ya15LiO6ZSZ6K+v5oOF5Ya15LmL6Ze055qE5Yy65Yir77yM5ZCO6ICF5piv5b+F54S25a2Y5Zyo55qE5bm25LiU5piv5LiA5a6a6KaB5L2c5Ye65aSE55CG55qE44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIDHvvInlr7npnZ7pooTmnJ/plJnor6/kvb/nlKjmlq3oqIBcbiAgICAgICAgIOaWreiogOS4reeahOW4g+WwlOihqOi+vuW8j+eahOWPjemdouS4gOWumuimgeaPj+i/sOS4gOS4qumdnumihOacn+mUmeivr++8jOS4i+mdouaJgOi/sOeahOWcqOS4gOWumuaDheWGteS4i+S4uumdnumihOacn+mUmeivr+eahOS4gOS6m+S+i+WtkO+8mlxuICAgICAgICAg77yIMe+8ieepuuaMh+mSiOOAglxuICAgICAgICAg77yIMu+8iei+k+WFpeaIluiAhei+k+WHuuWPguaVsOeahOWAvOS4jeWcqOmihOacn+iMg+WbtOWGheOAglxuICAgICAgICAg77yIM++8ieaVsOe7hOeahOi2iueVjOOAglxuICAgICAgICAg6Z2e6aKE5pyf6ZSZ6K+v5a+55bqU55qE5bCx5piv6aKE5pyf6ZSZ6K+v77yM5oiR5Lus6YCa5bi45L2/55So6ZSZ6K+v5aSE55CG5Luj56CB5p2l5aSE55CG6aKE5pyf6ZSZ6K+v77yM6ICM5L2/55So5pat6KiA5aSE55CG6Z2e6aKE5pyf6ZSZ6K+v44CC5Zyo5Luj56CB5omn6KGM6L+H56iL5Lit77yM5pyJ5Lqb6ZSZ6K+v5rC46L+c5LiN5bqU6K+l5Y+R55Sf77yM6L+Z5qC355qE6ZSZ6K+v5piv6Z2e6aKE5pyf6ZSZ6K+v44CC5pat6KiA5Y+v5Lul6KKr55yL5oiQ5piv5LiA56eN5Y+v5omn6KGM55qE5rOo6YeK77yM5L2g5LiN6IO95L6d6LWW5a6D5p2l6K6p5Luj56CB5q2j5bi45bel5L2c77yI44CKQ29kZSBDb21wbGV0ZSAy44CL77yJ44CC5L6L5aaC77yaXG4gICAgICAgICBpbnQgblJlcyA9IGYoKTsgLy8gblJlcyDnlLEgZiDlh73mlbDmjqfliLbvvIwgZiDlh73mlbDkv53or4Hov5Tlm57lgLzkuIDlrprlnKggLTEwMCB+IDEwMFxuICAgICAgICAgQXNzZXJ0KC0xMDAgPD0gblJlcyAmJiBuUmVzIDw9IDEwMCk7IC8vIOaWreiogO+8jOS4gOS4quWPr+aJp+ihjOeahOazqOmHilxuICAgICAgICAg55Sx5LqOIGYg5Ye95pWw5L+d6K+B5LqG6L+U5Zue5YC85aSE5LqOIC0xMDAgfiAxMDDvvIzpgqPkuYjlpoLmnpzlh7rnjrDkuoYgblJlcyDkuI3lnKjov5nkuKrojIPlm7TnmoTlgLzml7bvvIzlsLHooajmmI7kuIDkuKrpnZ7pooTmnJ/plJnor6/nmoTlh7rnjrDjgILlkI7pnaLkvJrorrLliLDigJzpmpTmoI/igJ3vvIzpgqPml7bkvJrlr7nmlq3oqIDmnInmm7TliqDmt7HliLvnmoTnkIbop6PjgIJcbiAgICAgICAgIDLvvInkuI3opoHmiorpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK1cbiAgICAgICAgIOaWreiogOeUqOS6jui9r+S7tueahOW8gOWPkeWSjOe7tOaKpO+8jOiAjOmAmuW4uOS4jeWcqOWPkeihjOeJiOacrOS4reWMheWQq+aWreiogOOAglxuICAgICAgICAg6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5Lit5piv5LiN5q2j56Gu55qE77yM5Zug5Li65Zyo5Y+R6KGM54mI5pys5Lit77yM6L+Z5Lqb5Luj56CB6YCa5bi45LiN5Lya6KKr5omn6KGM77yM5L6L5aaC77yaXG4gICAgICAgICBBc3NlcnQoZigpKTsgLy8gZiDlh73mlbDpgJrluLjlnKjlj5HooYzniYjmnKzkuK3kuI3kvJrooqvmiafooYxcbiAgICAgICAgIOiAjOS9v+eUqOWmguS4i+aWueazleWImeavlOi+g+WuieWFqO+8mlxuICAgICAgICAgcmVzID0gZigpO1xuICAgICAgICAgQXNzZXJ0KHJlcyk7IC8vIOWuieWFqFxuICAgICAgICAgM++8ieWvueadpea6kOS6juWGhemDqOezu+e7n+eahOWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOiAjOS4jeimgeWvueWklumDqOS4jeWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOWvueS6juWklumDqOS4jeWPr+mdoOaVsOaNru+8jOW6lOivpeS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeOAglxuICAgICAgICAg5YaN5qyh5by66LCD77yM5oqK5pat6KiA55yL5oiQ5Y+v5omn6KGM55qE5rOo6YeK44CCXG4gICAgICAgICAqIEBwYXJhbSBjb25kIOWmguaenGNvbmTov5Tlm55mYWxzZe+8jOWImeaWreiogOWksei0pe+8jOaYvuekum1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXNzZXJ0KGNvbmQsIC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZiAoY29uZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZXhlYyhcImFzc2VydFwiLCBhcmd1bWVudHMsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgLi4ubWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgLyohXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciB3aWxsIG5vdCBpbnRlcnJ1cHQsIGl0IHdpbGwgdGhyb3cgZXJyb3IgYW5kIGNvbnRpbnVlIGV4ZWMgdGhlIGxlZnQgc3RhdGVtZW50c1xuXG4gICAgICAgICAgICAgICAgYnV0IGhlcmUgbmVlZCBpbnRlcnJ1cHQhIHNvIG5vdCB1c2UgaXQgaGVyZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL2lmICghdGhpcy5fZXhlYyhcImVycm9yXCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuam9pbihcIlxcblwiKSk7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhcm4oLi4ubWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2V4ZWMoXCJ3YXJuXCIsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIFtcIndhcm4gdHJhY2VcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2V4ZWMoY29uc29sZU1ldGhvZCwgYXJncywgc2xpY2VCZWdpbiA9IDApIHtcbiAgICAgICAgICAgIGlmIChyb290LmNvbnNvbGUgJiYgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdLmFwcGx5KHJvb3QuY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VCZWdpbikpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgTGlzdDxUPiB7XG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjpBcnJheTxUPiA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChjaGlsZDphbnkpOmJvb2xlYW4ge1xuICAgICAgICAgICAgdmFyIGM6YW55ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGMgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC51aWQgJiYgYy51aWQgJiYgY2hpbGQudWlkID09IGMudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGNoaWxkID09PSBjKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGZ1bmModGhpcy5jaGlsZHJlbltpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGluZGV4Om51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkOlQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKGFyZzpBcnJheTxUPnxMaXN0PFQ+fGFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkFycmF5PFQ+ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgTGlzdCl7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkxpc3Q8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4uZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQ6YW55ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHVuU2hpZnRDaGlsZChjaGlsZDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHVibGljIHJlbW92ZUNoaWxkQXQgKGluZGV4KSB7XG4gICAgICAgIC8vICAgIExvZy5lcnJvcihpbmRleCA8IDAsIFwi5bqP5Y+35b+F6aG75aSn5LqO562J5LqOMFwiKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgY29weUNoaWxkcmVuKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5zbGljZSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCByZW1vdmVDaGlsZEhlbHBlcihhcmc6YW55KTpBcnJheTxUPiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnVpZCA9PT0gYXJnLnVpZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sICAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZSA9PT0gYXJnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9yRWFjaChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGNvbnRleHQgfHwgcm9vdCxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlQ2hpbGQoYXJyOlRbXSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHJlbWFpbkVsZW1lbnRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCEhZnVuYy5jYWxsKHNlbGYsIGUpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEVsZW1lbnRBcnIucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gcmVtYWluRWxlbWVudEFycjtcblxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRFbGVtZW50QXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xvbmUgKGlzRGVlcDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmKGlzRGVlcCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4oKS5hZGRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2UpOkNvbGxlY3Rpb248VD57XG4gICAgICAgICAgICBpZihpc1NvcnRTZWxmKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaW5zZXJ0U29ydChjb21wYXJlRnVuYzooYTpULCBiOlQpID0+IGJvb2xlYW4sIGlzU29ydFNlbGYgPSBmYWxzZSk6Q29sbGVjdGlvbjxUPntcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmKGlzU29ydFNlbGYpe1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAxLCBsZW4gPSB0aGlzLmdldENvdW50KCk7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBqID0gaTsgaiA+IDAgJiYgY29tcGFyZUZ1bmMoY2hpbGRyZW5bal0sIGNoaWxkcmVuW2ogLSAxXSk7IGotLSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N3YXAoY2hpbGRyZW4sIGogLSAxLCBqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGlzU29ydFNlbGYpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4oY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyhlLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2UgJiYgZVtoYW5kbGVyTmFtZV0gJiYgZVtoYW5kbGVyTmFtZV0uYXBwbHkoY29udGV4dCB8fCBlLCB2YWx1ZUFycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPGFueT4ocmVzdWx0QXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVSZXBlYXRJdGVtcygpe1xuICAgICAgICAgICAgdmFyIG5vUmVwZWF0TGlzdCA9ICBDb2xsZWN0aW9uLmNyZWF0ZTxUPigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGl0ZW06VCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub1JlcGVhdExpc3QuaGFzQ2hpbGQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5vUmVwZWF0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9SZXBlYXRMaXN0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc1JlcGVhdEl0ZW1zKCl7XG4gICAgICAgICAgICB2YXIgbm9SZXBlYXRMaXN0ID0gIENvbGxlY3Rpb24uY3JlYXRlPFQ+KCksXG4gICAgICAgICAgICAgICAgaGFzUmVwZWF0OmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChpdGVtOlQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobm9SZXBlYXRMaXN0Lmhhc0NoaWxkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc1JlcGVhdCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBub1JlcGVhdExpc3QuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGhhc1JlcGVhdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3N3YXAoY2hpbGRyZW46QXJyYXk8VD4sIGk6bnVtYmVyLCBqOm51bWJlcil7XG4gICAgICAgICAgICB2YXIgdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGRyZW5baV0gPSBjaGlsZHJlbltqXTtcbiAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZTxzdHJpbmc+KCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZTxUPigpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoY2hpbGRyZW5ba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGtleTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFZhbHVlKGtleTpzdHJpbmcsIHZhbHVlOmFueSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbihhcmc6e318SGFzaDxUPil7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBudWxsO1xuXG4gICAgICAgICAgICBpZihhcmcgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGFyZy5nZXRDaGlsZHJlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGFyZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChpLCBjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSk6Q29sbGVjdGlvbjxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmcpKXtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc2VsZi5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChrZXk6c3RyaW5nKTpib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldICE9PSB2b2lkIDA7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KXtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbik6SGFzaDxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltrZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBba2V5LCBzZWxmLmdldENoaWxkKGtleSldO1xuICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbik6SGFzaDxUPiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGU8VD4ocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0NvbGxlY3Rpb24oKTpDb2xsZWN0aW9uPGFueT57XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkcmVuKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZih2YWwgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICAvLyAgICBMb2cuZXJyb3IodHJ1ZSwgTG9nLmluZm8uRlVOQ19OT1RfU1VQUE9SVChcInRvQ29sbGVjdGlvblwiLCBcInZhbHVlIGlzIEhhc2hcIikpO1xuICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKTpBcnJheTxUPntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodmFsIGluc3RhbmNlb2YgQ29sbGVjdGlvbil7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodmFsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsb25lKGlzRGVlcDpib29sZWFuID0gZmFsc2UpOkhhc2g8VD57XG4gICAgICAgICAgICBpZihpc0RlZXApe1xuICAgICAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuX2NoaWxkcmVuKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZTxUPigpLmFkZENoaWxkcmVuKHRoaXMuX2NoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFF1ZXVlPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZyb250KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlYXIoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHB1c2goZWxlbWVudDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwb3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsZWFyKCl7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFN0YWNrPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsb25lIChpc0RlZXA6Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICBpZihpc0RlZXApe1xuICAgICAgICAgICAgICAgIHJldHVybiBTdGFjay5jcmVhdGU8VD4oRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcCh0aGlzLmNoaWxkcmVuKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBTdGFjay5jcmVhdGU8VD4oW10uY29uY2F0KHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBBamF4VXRpbHN7XG4gICAgICAgIC8qIVxuICAgICAgICAg5a6e546wYWpheFxuXG4gICAgICAgICBhamF4KHtcbiAgICAgICAgIHR5cGU6XCJwb3N0XCIsLy9wb3N05oiW6ICFZ2V077yM6Z2e5b+F6aG7XG4gICAgICAgICB1cmw6XCJ0ZXN0LmpzcFwiLC8v5b+F6aG755qEXG4gICAgICAgICBkYXRhOlwibmFtZT1kaXBvbyZpbmZvPWdvb2RcIiwvL+mdnuW/hemhu1xuICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsLy90ZXh0L3htbC9qc29u77yM6Z2e5b+F6aG7XG4gICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpey8v5Zue6LCD5Ye95pWw77yM6Z2e5b+F6aG7XG4gICAgICAgICBhbGVydChkYXRhLm5hbWUpO1xuICAgICAgICAgfVxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhamF4KGNvbmYpe1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjb25mLnR5cGU7Ly90eXBl5Y+C5pWwLOWPr+mAiVxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmYudXJsOy8vdXJs5Y+C5pWw77yM5b+F5aGrXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGNvbmYuZGF0YTsvL2RhdGHlj4LmlbDlj6/pgInvvIzlj6rmnInlnKhwb3N06K+35rGC5pe26ZyA6KaBXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBjb25mLmRhdGFUeXBlOy8vZGF0YXR5cGXlj4LmlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY29uZi5zdWNjZXNzOy8v5Zue6LCD5Ye95pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjb25mLmVycm9yO1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBudWxsKSB7Ly90eXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6Z2V0XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IG51bGwpIHsvL2RhdGFUeXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6dGV4dFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhociA9IHRoaXMuX2NyZWF0ZUFqYXgoZXJyb3IpO1xuICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJHRVRcIiB8fCB0eXBlID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcIlBPU1RcIiB8fCB0eXBlID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxhamF46K6/6Zeu55qE5piv5pys5Zyw5paH5Lu277yM5YiZc3RhdHVz5Li6MFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCBzZWxmLl9pc0xvY2FsRmlsZSh4aHIuc3RhdHVzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZGF0YVR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aZrumAmuaWh+acrFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcInhtbFwiIHx8IGRhdGFUeXBlID09PSBcIlhNTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aOpeaUtnhtbOaWh+aho1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVhNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwianNvblwiIHx8IGRhdGFUeXBlID09PSBcIkpTT05cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhldmFsKFwiKFwiICsgeGhyLnJlc3BvbnNlVGV4dCArIFwiKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jcmVhdGVBamF4KGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7Ly9JReezu+WIl+a1j+iniOWZqFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwibWljcm9zb2Z0LnhtbGh0dHBcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7Ly/pnZ5JRea1j+iniOWZqFxuICAgICAgICAgICAgICAgICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih4aHIsIHttZXNzYWdlOiBcIuaCqOeahOa1j+iniOWZqOS4jeaUr+aMgWFqYXjvvIzor7fmm7TmjaLvvIFcIn0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGhyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzTG9jYWxGaWxlKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LlVSTC5jb250YWluKFwiZmlsZTovL1wiKSAmJiBzdGF0dXMgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNTb3VuZEZpbGUoZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhVHlwZSA9PT0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBBcnJheVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVSZXBlYXRJdGVtcyhhcnI6QXJyYXk8YW55PiwgaXNFcXVhbDooYTphbnksIGI6YW55KSA9PiBib29sZWFuID0gKGEsIGIpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnRhaW4ocmVzdWx0QXJyLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNFcXVhbCh2YWwsIGVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChlbGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRBcnI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRhaW4oYXJyOkFycmF5PGFueT4sIGVsZTphbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oZWxlKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jOkZ1bmN0aW9uID0gZWxlO1xuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWZ1bmMuY2FsbChudWxsLCB2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUgPT09IHZhbHVlIHx8ICh2YWx1ZS5jb250YWluICYmIHZhbHVlLmNvbnRhaW4oZWxlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFdmVudFV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kRXZlbnQoY29udGV4dCwgZnVuYykge1xuICAgICAgICAgICAgLy92YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAvLyAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZ1bi5hcHBseShvYmplY3QsIFtzZWxmLndyYXBFdmVudChldmVudCldLmNvbmNhdChhcmdzKSk7IC8v5a+55LqL5Lu25a+56LGh6L+b6KGM5YyF6KOFXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGFkZEV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhdHRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiZGV0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5kVXRpbHMge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rex5ou36LSdXG4gICAgICAgICAqXG4gICAgICAgICAqIOekuuS+i++8mlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrmlbDnu4TvvIzog73lpJ/miJDlip/mi7fotJ3vvIjkuI3mi7fotJ1BcnJheeWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiBleHBlY3QoZXh0ZW5kLmV4dGVuZERlZXAoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pKS50b0VxdWFsKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKTtcbiAgICAgICAgICpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65a+56LGh77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI6IO95ou36LSd5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICAgZnVuY3Rpb24gQSgpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEEucHJvdG90eXBlLmEgPSAxO1xuXG4gICAgICAgICBmdW5jdGlvbiBCKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQi5wcm90b3R5cGUgPSBuZXcgQSgpO1xuICAgICAgICAgQi5wcm90b3R5cGUuYiA9IHsgeDogMSwgeTogMSB9O1xuICAgICAgICAgQi5wcm90b3R5cGUuYyA9IFt7IHg6IDEgfSwgWzJdXTtcblxuICAgICAgICAgdmFyIHQgPSBuZXcgQigpO1xuXG4gICAgICAgICByZXN1bHQgPSBleHRlbmQuZXh0ZW5kRGVlcCh0KTtcblxuICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcbiAgICAgICAgIHtcbiAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgIGI6IHsgeDogMSwgeTogMSB9LFxuICAgICAgICAgICAgIGM6IFt7IHg6IDEgfSwgWzJdXVxuICAgICAgICAgfSk7XG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIGNoaWxkXG4gICAgICAgICAqIEByZXR1cm5zXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZERlZXAocGFyZW50LCBjaGlsZD8sZmlsdGVyPWZ1bmN0aW9uKHZhbCwgaSl7cmV0dXJuIHRydWU7fSkge1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGxlbiA9IDAsXG4gICAgICAgICAgICAgICAgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIHNBcnIgPSBcIltvYmplY3QgQXJyYXldXCIsXG4gICAgICAgICAgICAgICAgc09iID0gXCJbb2JqZWN0IE9iamVjdF1cIixcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJcIixcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBudWxsO1xuXG4gICAgICAgICAgICAvL+aVsOe7hOeahOivne+8jOS4jeiOt+W+l0FycmF55Y6f5Z6L5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzQXJyKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwgW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXJlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbWJlciA9IHBhcmVudFtpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKG1lbWJlciwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihtZW1iZXIuY2xvbmUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gbWVtYmVyLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKG1lbWJlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKG1lbWJlciwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IG1lbWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a+56LGh55qE6K+d77yM6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CC5Zug5Li66ICD6JmR5Lul5LiL5oOF5pmv77yaXG4gICAgICAgICAgICAvL+exu0Hnu6fmib/kuo7nsbtC77yM546w5Zyo5oOz6KaB5ou36LSd57G7QeeahOWunuS+i2HnmoTmiJDlkZjvvIjljIXmi6zku47nsbtC57un5om/5p2l55qE5oiQ5ZGY77yJ77yM6YKj5LmI5bCx6ZyA6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBlbHNlIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNPYikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVyID0gcGFyZW50W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIobWVtYmVyLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKG1lbWJlci5jbG9uZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBtZW1iZXIuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwobWVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUobWVtYmVyLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gbWVtYmVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gcGFyZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1heaLt+i0nVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQoZGVzdGluYXRpb246YW55LCBzb3VyY2U6YW55KSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBcIlwiO1xuXG4gICAgICAgICAgICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvcHlQdWJsaWNBdHRyaShzb3VyY2U6YW55KXtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGwsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5leHRlbmREZWVwKHNvdXJjZSwgZGVzdGluYXRpb24sIGZ1bmN0aW9uKGl0ZW0sIHByb3BlcnR5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuc2xpY2UoMCwgMSkgIT09IFwiX1wiXG4gICAgICAgICAgICAgICAgICAgICYmICFKdWRnZVV0aWxzLmlzRnVuY3Rpb24oaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgd2RDYntcbiAgICB2YXIgU1BMSVRQQVRIX1JFR0VYID1cbiAgICAgICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG5cbiAgICAvL3JlZmVyZW5jZSBmcm9tXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vY29va2Zyb250L2xlYXJuLW5vdGUvYmxvYi9tYXN0ZXIvYmxvZy1iYWNrdXAvMjAxNC9ub2RlanMtcGF0aC5tZFxuICAgIGV4cG9ydCBjbGFzcyBQYXRoVXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZW5hbWUocGF0aDpzdHJpbmcsIGV4dD86c3RyaW5nKXtcbiAgICAgICAgICAgIHZhciBmID0gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAgICAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICAgICAgICAgICAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICAgICAgICAgICAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNoYW5nZUV4dG5hbWUocGF0aFN0cjpzdHJpbmcsIGV4dG5hbWU6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgZXh0bmFtZSA9IGV4dG5hbWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIuaW5kZXhPZihcIj9cIiksXG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoaW5kZXgpO1xuICAgICAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5sYXN0SW5kZXhPZihcIi5cIik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApe1xuICAgICAgICAgICAgICByZXR1cm4gcGF0aFN0ciArIGV4dG5hbWUgKyB0ZW1wU3RyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpICsgZXh0bmFtZSArIHRlbXBTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNoYW5nZUJhc2VuYW1lKHBhdGhTdHI6c3RyaW5nLCBiYXNlbmFtZTpzdHJpbmcsIGlzU2FtZUV4dDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IG51bGwsXG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IG51bGwsXG4gICAgICAgICAgICAgICAgZXh0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGJhc2VuYW1lLmluZGV4T2YoXCIuXCIpID09IDApe1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VFeHRuYW1lKHBhdGhTdHIsIGJhc2VuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmluZGV4T2YoXCI/XCIpO1xuICAgICAgICAgICAgdGVtcFN0ciA9IFwiXCI7XG4gICAgICAgICAgICBleHQgPSBpc1NhbWVFeHQgPyB0aGlzLmV4dG5hbWUocGF0aFN0cikgOiBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgICAgICBwYXRoU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8PSAwID8gMCA6IGluZGV4ICsgMTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGJhc2VuYW1lICsgZXh0ICsgdGVtcFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0bmFtZShwYXRoOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBkaXJuYW1lKHBhdGg6c3RyaW5nKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9zcGxpdFBhdGgocGF0aCksXG4gICAgICAgICAgICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgICAgICAgICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgICAgICAgICAgIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgICAgICAgICAgICAgLy9ubyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGlyKSB7XG4gICAgICAgICAgICAgICAgLy9pdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgICAgICAgICAgICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcm9vdCArIGRpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9zcGxpdFBhdGgoZmlsZU5hbWU6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiBTUExJVFBBVEhfUkVHRVguZXhlYyhmaWxlTmFtZSkuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmQob2JqZWN0OmFueSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShvYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBEb21RdWVyeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhhcmdzWzBdKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6QXJyYXk8SFRNTEVsZW1lbnQ+ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgY29uc3RydWN0b3IoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RvbShhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbYXJnc1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2lzRG9tRWxlU3RyKGFyZ3NbMF0pKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW3RoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3NbMF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIHRhcmdldERvbTpIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRhcmdldERvbSA9IHRoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLmluc2VydEJlZm9yZSh0YXJnZXREb20sIGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHByZXBlbmRUbyhlbGVTdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RG9tOkRvbVF1ZXJ5ID0gbnVsbDtcblxuICAgICAgICAgICAgdGFyZ2V0RG9tID0gRG9tUXVlcnkuY3JlYXRlKGVsZVN0cik7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXREb20ucHJlcGVuZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tICYmIGRvbS5wYXJlbnROb2RlICYmIGRvbS50YWdOYW1lICE9ICdCT0RZJykge1xuICAgICAgICAgICAgICAgICAgICBkb20ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3NzKHByb3BlcnR5OnN0cmluZywgdmFsdWU6c3RyaW5nKXtcbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgZG9tLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGF0dHIobmFtZTpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgYXR0cihuYW1lOnN0cmluZywgdmFsdWU6c3RyaW5nKTtcblxuICAgICAgICBwdWJsaWMgYXR0ciguLi5hcmdzKXtcbiAgICAgICAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3NbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoMCkuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJnc1sxXTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2lzRG9tRWxlU3RyKGVsZVN0cjpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIGVsZVN0ci5tYXRjaCgvPChcXHcrKVtePl0qPjxcXC9cXDE+LykgIT09IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9idWlsZERvbShlbGVTdHI6c3RyaW5nKTpIVE1MRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oZG9tOkhUTUxIdG1sRWxlbWVudCk6SFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oLi4uYXJncyk6SFRNTEVsZW1lbnQge1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmdzWzBdKSl7XG4gICAgICAgICAgICAgICAgbGV0IGRpdiA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICAgICAgICAgIGVsZVN0cjpzdHJpbmcgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGVsZVN0cjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jcmVhdGVFbGVtZW50KGVsZVN0cil7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVTdHIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=