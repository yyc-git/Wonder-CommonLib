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
            FUNC_NOT_EXIST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                args.unshift("not exist");
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
            return isDeep ? Collection.create(wdCb.ExtendUtils.extendDeep(this.children))
                : Collection.create(wdCb.ExtendUtils.extend([], this.children));
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
            var resultList = Collection.create();
            this.forEach(function (item) {
                if (resultList.hasChild(item)) {
                    return;
                }
                resultList.addChild(item);
            });
            return resultList;
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
                    if (!filter(parent[i], i)) {
                        continue;
                    }
                    type = toStr.call(parent[i]);
                    if (type === sArr || type === sOb) {
                        _child[i] = type === sArr ? [] : {};
                        arguments.callee(parent[i], _child[i]);
                    }
                    else {
                        _child[i] = parent[i];
                    }
                }
            }
            else if (toStr.call(parent) === sOb) {
                _child = child || {};
                for (i in parent) {
                    if (!filter(parent[i], i)) {
                        continue;
                    }
                    type = toStr.call(parent[i]);
                    if (type === sArr || type === sOb) {
                        _child[i] = type === sArr ? [] : {};
                        arguments.callee(parent[i], _child[i]);
                    }
                    else {
                        _child[i] = parent[i];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL0p1ZGdlVXRpbHMudHMiLCJnbG9iYWwvVmFyaWFibGUudHMiLCJnbG9iYWwvZXh0ZW5kLnRzIiwiZ2xvYmFsL0NvbnN0LnRzIiwiTG9nLnRzIiwiTGlzdC50cyIsIkNvbGxlY3Rpb24udHMiLCJIYXNoLnRzIiwiUXVldWUudHMiLCJTdGFjay50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0FycmF5VXRpbHMudHMiLCJ1dGlscy9Db252ZXJ0VXRpbHMudHMiLCJ1dGlscy9FdmVudFV0aWxzLnRzIiwidXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJ1dGlscy9QYXRoVXRpbHMudHMiLCJ1dGlscy9GdW5jdGlvblV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxJQUFJLENBaUdWO0FBakdELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFHVCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUM7UUFBQTtRQThFQSxDQUFDO1FBN0VpQixrQkFBTyxHQUFyQixVQUFzQixHQUFPO1lBQ3pCLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxPQUFPLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDO1FBQ2pGLENBQUM7UUFFYSx5QkFBYyxHQUE1QixVQUE2QixHQUFPO1lBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQWdCLENBQUM7UUFDcEUsQ0FBQztRQUVhLG1CQUFRLEdBQXRCLFVBQXVCLEdBQU87WUFDMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUNsQyxDQUFDO1FBRWEsMEJB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c0NvbnRlbnQiOlsibW9kdWxlIHdkQ2Ige1xuICAgIGRlY2xhcmUgdmFyIGdsb2JhbDphbnksIG1vZHVsZTphbnk7XG5cbiAgICBjb25zdCBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gICAgZXhwb3J0IGNsYXNzIEp1ZGdlVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQXJyYXkoYXJyOmFueSkge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyciAmJiBhcnIubGVuZ3RoO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5RXhhY3RseShhcnI6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOdW1iZXIobnVtOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBudW0gPT0gXCJudW1iZXJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOdW1iZXJFeGFjdGx5KG51bTphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobnVtKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcoc3RyOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBzdHIgPT0gXCJzdHJpbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNTdHJpbmdFeGFjdGx5KHN0cjphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RyKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNCb29sZWFuKGJvb2w6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKGJvb2wpID09PSAnW2Jvb2xlY3QgQm9vbGVhbl0nO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RvbShvYmo6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNPYmplY3Qob2JqOmFueSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKTmlq3mmK/lkKbkuLrlr7nosaHlrZfpnaLph4/vvIh7fe+8iVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RpcmVjdE9iamVjdChvYmo6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5qOA5p+l5a6/5Li75a+56LGh5piv5ZCm5Y+v6LCD55SoXG4gICAgICAgICAqXG4gICAgICAgICAqIOS7u+S9leWvueixoe+8jOWmguaenOWFtuivreS5ieWcqEVDTUFTY3JpcHTop4TojIPkuK3ooqvlrprkuYnov4fvvIzpgqPkuYjlroPooqvnp7DkuLrljp/nlJ/lr7nosaHvvJtcbiAgICAgICAgIOeOr+Wig+aJgOaPkOS+m+eahO+8jOiAjOWcqEVDTUFTY3JpcHTop4TojIPkuK3msqHmnInooqvmj4/ov7DnmoTlr7nosaHvvIzmiJHku6znp7DkuYvkuLrlrr/kuLvlr7nosaHjgIJcblxuICAgICAgICAg6K+l5pa55rOV55So5LqO54m55oCn5qOA5rWL77yM5Yik5pat5a+56LGh5piv5ZCm5Y+v55So44CC55So5rOV5aaC5LiL77yaXG5cbiAgICAgICAgIE15RW5naW5lIGFkZEV2ZW50KCk6XG4gICAgICAgICBpZiAoVG9vbC5qdWRnZS5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHsgICAgLy/liKTmlq1kb23mmK/lkKblhbfmnIlhZGRFdmVudExpc3RlbmVy5pa55rOVXG4gICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihzRXZlbnRUeXBlLCBmbkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNIb3N0TWV0aG9kKG9iamVjdDphbnksIHByb3BlcnR5OmFueSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgICAgICAgICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmICEhb2JqZWN0W3Byb3BlcnR5XSkgfHxcbiAgICAgICAgICAgICAgICB0eXBlID09PSBcInVua25vd25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOb2RlSnMoKXtcbiAgICAgICAgICAgIHJldHVybiAoKHR5cGVvZiBnbG9iYWwgIT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwubW9kdWxlKSB8fCAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiKSkgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9IFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvL292ZXJ3cml0ZSBpdCBpbiB0aGUgZW5kIG9mIHRoaXMgZmlsZVxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRnVuY3Rpb24oZnVuYzphbnkpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gICAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gICAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgICAgIEp1ZGdlVXRpbHMuaXNGdW5jdGlvbiA9IChmdW5jOmFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbic7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBKdWRnZVV0aWxzLmlzRnVuY3Rpb24gPSAoZnVuYzphbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBkZWNsYXJlIHZhciBnbG9iYWw6YW55LHdpbmRvdzphbnk7XG5cbiAgICBleHBvcnQgdmFyIHJvb3Q6YW55O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3ZENiLCBcInJvb3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc05vZGVKcygpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93O1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJtb2R1bGUgd2RDYntcbi8vIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbFxuXG4gICAgaWYgKCdwZXJmb3JtYW5jZScgaW4gcm9vdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcm9vdC5wZXJmb3JtYW5jZSA9IHt9O1xuICAgIH1cblxuLy8gSUUgOFxuICAgIERhdGUubm93ID0gKCBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9ICk7XG5cbiAgICBpZiAoJ25vdycgaW4gcm9vdC5wZXJmb3JtYW5jZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHJvb3QucGVyZm9ybWFuY2UudGltaW5nICYmIHJvb3QucGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCA/IHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgICAgICAgICAgIDogRGF0ZS5ub3coKTtcblxuICAgICAgICByb290LnBlcmZvcm1hbmNlLm5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gb2Zmc2V0O1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGV4cG9ydCBjb25zdCAkQlJFQUsgPSB7XG4gICAgICAgIGJyZWFrOnRydWVcbiAgICB9O1xuICAgIGV4cG9ydCBjb25zdCAkUkVNT1ZFID0gdm9pZCAwO1xufVxuXG5cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgTG9nIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbmZvID0ge1xuICAgICAgICAgICAgSU5WQUxJRF9QQVJBTTogXCJpbnZhbGlkIHBhcmFtZXRlclwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfQVRUUklCVVRFOiBcImFic3RyYWN0IGF0dHJpYnV0ZSBuZWVkIG92ZXJyaWRlXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9NRVRIT0Q6IFwiYWJzdHJhY3QgbWV0aG9kIG5lZWQgb3ZlcnJpZGVcIixcblxuICAgICAgICAgICAgaGVscGVyRnVuYzogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZyh2YWwpICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3NlcnRpb246IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVscGVyRnVuYyhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihhcmdzLmxlbmd0aCA9PT0gMyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJnc1sxXSwgYXJnc1swXSwgYXJnc1syXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3MubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiaW52YWxpZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1Q6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3Qgbm90IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU0hPVUxEOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInNob3VsZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRF9OT1Q6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwic2hvdWxkIG5vdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInN1cHBvcnRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfU1VQUE9SVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibm90IHN1cHBvcnRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0RFRklORTogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBkZWZpbmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3Qgbm90IGRlZmluZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VOS05PVzogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwidW5rbm93XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhQRUNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJleHBlY3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTkVYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwidW5leHBlY3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfRVhJU1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm5vdCBleGlzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3V0cHV0IERlYnVnIG1lc3NhZ2UuXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBsb2coLi4ubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLl9leGVjKFwibG9nXCIsIG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgIHJvb3QuYWxlcnQobWVzc2FnZXMuam9pbihcIixcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9leGVjKFwidHJhY2VcIiwgbWVzc2FnZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgLi4ubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9leGVjKFwiYXNzZXJ0XCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBlcnJvcihjb25kLCAuLi5tZXNzYWdlKTphbnkge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICAvKiFcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIHdpbGwgbm90IGludGVycnVwdCwgaXQgd2lsbCB0aHJvdyBlcnJvciBhbmQgY29udGludWUgZXhlYyB0aGUgbGVmdCBzdGF0ZW1lbnRzXG5cbiAgICAgICAgICAgICAgICBidXQgaGVyZSBuZWVkIGludGVycnVwdCEgc28gbm90IHVzZSBpdCBoZXJlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vaWYgKCF0aGlzLl9leGVjKFwiZXJyb3JcIiwgYXJndW1lbnRzLCAxKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5qb2luKFwiXFxuXCIpKTtcbiAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgd2FybiguLi5tZXNzYWdlKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fZXhlYyhcIndhcm5cIiwgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9leGVjKFwidHJhY2VcIiwgW1wid2FybiB0cmFjZVwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfZXhlYyhjb25zb2xlTWV0aG9kLCBhcmdzLCBzbGljZUJlZ2luID0gMCkge1xuICAgICAgICAgICAgaWYgKHJvb3QuY29uc29sZSAmJiByb290LmNvbnNvbGVbY29uc29sZU1ldGhvZF0pIHtcbiAgICAgICAgICAgICAgICByb290LmNvbnNvbGVbY29uc29sZU1ldGhvZF0uYXBwbHkocm9vdC5jb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCBzbGljZUJlZ2luKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGNoaWxkOmFueSk6Ym9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgYzphbnkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYyA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnVpZCAmJiBjLnVpZCAmJiBjaGlsZC51aWQgPT0gYy51aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoY2hpbGQgPT09IGMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZFdpdGhGdW5jKGZ1bmM6RnVuY3Rpb24pOmJvb2xlYW4ge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYoZnVuYyh0aGlzLmNoaWxkcmVuW2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6VCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOkFycmF5PFQ+fExpc3Q8VD58YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46QXJyYXk8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBMaXN0KXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46TGlzdDxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZDphbnkgPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdW5TaGlmdENoaWxkKGNoaWxkOlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2godGhpcy5jaGlsZHJlbiwgZnVuYywgY29udGV4dCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuXG4gICAgICAgIHB1YmxpYyB0b0FycmF5KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjb3B5Q2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNsaWNlKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlbW92ZUNoaWxkSGVscGVyKGFyZzphbnkpOkFycmF5PFQ+IHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCBmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFyZy51aWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID09PSBhcmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9mb3JFYWNoKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gY29udGV4dCB8fCByb290LFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIGxlbiA9IGFyci5sZW5ndGg7XG5cblxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoc2NvcGUsIGFycltpXSwgaSkgPT09ICRCUkVBSykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmVDaGlsZChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBudWxsLFxuICAgICAgICAgICAgICAgIHJlbW92ZWRFbGVtZW50QXJyID0gW10sXG4gICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyciA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoISFmdW5jLmNhbGwoc2VsZiwgZSkpe1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZW1haW5FbGVtZW50QXJyLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSByZW1haW5FbGVtZW50QXJyO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlZEVsZW1lbnRBcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgQ29sbGVjdGlvbjxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbG9uZSAoaXNEZWVwOmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRGVlcCA/IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2Upe1xuICAgICAgICAgICAgaWYoaXNTb3J0U2VsZil7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zb3J0KGZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPih0aGlzLmNvcHlDaGlsZHJlbigpLnNvcnQoZnVuYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyhlLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2UgJiYgZVtoYW5kbGVyTmFtZV0gJiYgZVtoYW5kbGVyTmFtZV0uYXBwbHkoY29udGV4dCB8fCBlLCB2YWx1ZUFycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPGFueT4ocmVzdWx0QXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVSZXBlYXRJdGVtcygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdExpc3QgPSAgQ29sbGVjdGlvbi5jcmVhdGU8VD4oKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChpdGVtOlQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0TGlzdC5oYXNDaGlsZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0TGlzdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWVzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGNoaWxkcmVuW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChrZXk6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShrZXk6c3RyaW5nLCB2YWx1ZTphbnkpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOnt9fEhhc2g8VD4pe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYoYXJnIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmcuZ2V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihpIGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaSwgY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNlbGYuX2NoaWxkcmVuW2tleV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHJlbltrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGQoa2V5OnN0cmluZyk6Ym9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XSAhPT0gdm9pZCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkV2l0aEZ1bmMoZnVuYzpGdW5jdGlvbik6Ym9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSl7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkcmVuW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmlsdGVyKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNoaWxkcmVuW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChjaGlsZHJlbiwgdmFsdWUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbmRPbmUoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWZ1bmMuY2FsbChzY29wZSwgdmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtrZXksIHNlbGYuZ2V0Q2hpbGQoa2V5KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0NvbGxlY3Rpb24oKTpDb2xsZWN0aW9uPGFueT57XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkcmVuKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZih2YWwgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICAvLyAgICBMb2cuZXJyb3IodHJ1ZSwgTG9nLmluZm8uRlVOQ19OT1RfU1VQUE9SVChcInRvQ29sbGVjdGlvblwiLCBcInZhbHVlIGlzIEhhc2hcIikpO1xuICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKTpBcnJheTxhbnk+e1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCh2YWwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBRdWV1ZTxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBmcm9udCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWFyKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBTdGFjazxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHVzaChlbGVtZW50OlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHBvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKXtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBBamF4VXRpbHN7XG4gICAgICAgIC8qIVxuICAgICAgICAg5a6e546wYWpheFxuXG4gICAgICAgICBhamF4KHtcbiAgICAgICAgIHR5cGU6XCJwb3N0XCIsLy9wb3N05oiW6ICFZ2V077yM6Z2e5b+F6aG7XG4gICAgICAgICB1cmw6XCJ0ZXN0LmpzcFwiLC8v5b+F6aG755qEXG4gICAgICAgICBkYXRhOlwibmFtZT1kaXBvbyZpbmZvPWdvb2RcIiwvL+mdnuW/hemhu1xuICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsLy90ZXh0L3htbC9qc29u77yM6Z2e5b+F6aG7XG4gICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpey8v5Zue6LCD5Ye95pWw77yM6Z2e5b+F6aG7XG4gICAgICAgICBhbGVydChkYXRhLm5hbWUpO1xuICAgICAgICAgfVxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhamF4KGNvbmYpe1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjb25mLnR5cGU7Ly90eXBl5Y+C5pWwLOWPr+mAiVxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmYudXJsOy8vdXJs5Y+C5pWw77yM5b+F5aGrXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGNvbmYuZGF0YTsvL2RhdGHlj4LmlbDlj6/pgInvvIzlj6rmnInlnKhwb3N06K+35rGC5pe26ZyA6KaBXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBjb25mLmRhdGFUeXBlOy8vZGF0YXR5cGXlj4LmlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY29uZi5zdWNjZXNzOy8v5Zue6LCD5Ye95pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjb25mLmVycm9yO1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBudWxsKSB7Ly90eXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6Z2V0XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IG51bGwpIHsvL2RhdGFUeXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6dGV4dFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhociA9IHRoaXMuX2NyZWF0ZUFqYXgoZXJyb3IpO1xuICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJHRVRcIiB8fCB0eXBlID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcIlBPU1RcIiB8fCB0eXBlID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxhamF46K6/6Zeu55qE5piv5pys5Zyw5paH5Lu277yM5YiZc3RhdHVz5Li6MFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCBzZWxmLl9pc0xvY2FsRmlsZSh4aHIuc3RhdHVzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZGF0YVR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aZrumAmuaWh+acrFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcInhtbFwiIHx8IGRhdGFUeXBlID09PSBcIlhNTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aOpeaUtnhtbOaWh+aho1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVhNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwianNvblwiIHx8IGRhdGFUeXBlID09PSBcIkpTT05cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhldmFsKFwiKFwiICsgeGhyLnJlc3BvbnNlVGV4dCArIFwiKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jcmVhdGVBamF4KGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7Ly9JReezu+WIl+a1j+iniOWZqFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwibWljcm9zb2Z0LnhtbGh0dHBcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7Ly/pnZ5JRea1j+iniOWZqFxuICAgICAgICAgICAgICAgICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih4aHIsIHttZXNzYWdlOiBcIuaCqOeahOa1j+iniOWZqOS4jeaUr+aMgWFqYXjvvIzor7fmm7TmjaLvvIFcIn0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGhyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzTG9jYWxGaWxlKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LlVSTC5jb250YWluKFwiZmlsZTovL1wiKSAmJiBzdGF0dXMgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNTb3VuZEZpbGUoZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhVHlwZSA9PT0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBBcnJheVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVSZXBlYXRJdGVtcyhhcnI6QXJyYXk8YW55PiwgaXNFcXVhbDooYTphbnksIGI6YW55KSA9PiBib29sZWFuID0gKGEsIGIpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnRhaW4ocmVzdWx0QXJyLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNFcXVhbCh2YWwsIGVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChlbGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRBcnI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRhaW4oYXJyOkFycmF5PGFueT4sIGVsZTphbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oZWxlKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jOkZ1bmN0aW9uID0gZWxlO1xuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWZ1bmMuY2FsbChudWxsLCB2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUgPT09IHZhbHVlIHx8ICh2YWx1ZS5jb250YWluICYmIHZhbHVlLmNvbnRhaW4oZWxlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFdmVudFV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kRXZlbnQoY29udGV4dCwgZnVuYykge1xuICAgICAgICAgICAgLy92YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAvLyAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZ1bi5hcHBseShvYmplY3QsIFtzZWxmLndyYXBFdmVudChldmVudCldLmNvbmNhdChhcmdzKSk7IC8v5a+55LqL5Lu25a+56LGh6L+b6KGM5YyF6KOFXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGFkZEV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhdHRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiZGV0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5kVXRpbHMge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rex5ou36LSdXG4gICAgICAgICAqXG4gICAgICAgICAqIOekuuS+i++8mlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrmlbDnu4TvvIzog73lpJ/miJDlip/mi7fotJ3vvIjkuI3mi7fotJ1BcnJheeWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiBleHBlY3QoZXh0ZW5kLmV4dGVuZERlZXAoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pKS50b0VxdWFsKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKTtcbiAgICAgICAgICpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65a+56LGh77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI6IO95ou36LSd5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICAgZnVuY3Rpb24gQSgpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEEucHJvdG90eXBlLmEgPSAxO1xuXG4gICAgICAgICBmdW5jdGlvbiBCKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQi5wcm90b3R5cGUgPSBuZXcgQSgpO1xuICAgICAgICAgQi5wcm90b3R5cGUuYiA9IHsgeDogMSwgeTogMSB9O1xuICAgICAgICAgQi5wcm90b3R5cGUuYyA9IFt7IHg6IDEgfSwgWzJdXTtcblxuICAgICAgICAgdmFyIHQgPSBuZXcgQigpO1xuXG4gICAgICAgICByZXN1bHQgPSBleHRlbmQuZXh0ZW5kRGVlcCh0KTtcblxuICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcbiAgICAgICAgIHtcbiAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgIGI6IHsgeDogMSwgeTogMSB9LFxuICAgICAgICAgICAgIGM6IFt7IHg6IDEgfSwgWzJdXVxuICAgICAgICAgfSk7XG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIGNoaWxkXG4gICAgICAgICAqIEByZXR1cm5zXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZERlZXAocGFyZW50LCBjaGlsZD8sZmlsdGVyPWZ1bmN0aW9uKHZhbCwgaSl7cmV0dXJuIHRydWU7fSkge1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGxlbiA9IDAsXG4gICAgICAgICAgICAgICAgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIHNBcnIgPSBcIltvYmplY3QgQXJyYXldXCIsXG4gICAgICAgICAgICAgICAgc09iID0gXCJbb2JqZWN0IE9iamVjdF1cIixcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJcIixcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBudWxsO1xuXG4gICAgICAgICAgICAvL+aVsOe7hOeahOivne+8jOS4jeiOt+W+l0FycmF55Y6f5Z6L5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzQXJyKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwgW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXJlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/lr7nosaHnmoTor53vvIzopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgILlm6DkuLrogIPomZHku6XkuIvmg4Xmma/vvJpcbiAgICAgICAgICAgIC8v57G7Qee7p+aJv+S6juexu0LvvIznjrDlnKjmg7PopoHmi7fotJ3nsbtB55qE5a6e5L6LYeeahOaIkOWRmO+8iOWMheaLrOS7juexu0Lnu6fmib/mnaXnmoTmiJDlkZjvvInvvIzpgqPkuYjlsLHpnIDopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc09iKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IHBhcmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9jaGlsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtYXmi7fotJ1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kKGRlc3RpbmF0aW9uOmFueSwgc291cmNlOmFueSkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gXCJcIjtcblxuICAgICAgICAgICAgZm9yIChwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjb3B5UHVibGljQXR0cmkoc291cmNlOmFueSl7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZXh0ZW5kRGVlcChzb3VyY2UsIGRlc3RpbmF0aW9uLCBmdW5jdGlvbihpdGVtLCBwcm9wZXJ0eSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnNsaWNlKDAsIDEpICE9PSBcIl9cIlxuICAgICAgICAgICAgICAgICAgICAmJiAhSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwibW9kdWxlIHdkQ2J7XG4gICAgdmFyIFNQTElUUEFUSF9SRUdFWCA9XG4gICAgICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xuXG4gICAgLy9yZWZlcmVuY2UgZnJvbVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2Nvb2tmcm9udC9sZWFybi1ub3RlL2Jsb2IvbWFzdGVyL2Jsb2ctYmFja3VwLzIwMTQvbm9kZWpzLXBhdGgubWRcbiAgICBleHBvcnQgY2xhc3MgUGF0aFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2VuYW1lKHBhdGg6c3RyaW5nLCBleHQ/OnN0cmluZyl7XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKVsyXTtcbiAgICAgICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgICAgICAgICAgIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgICAgICAgICAgICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZjtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjaGFuZ2VFeHRuYW1lKHBhdGhTdHI6c3RyaW5nLCBleHRuYW1lOnN0cmluZykge1xuICAgICAgICAgICAgdmFyIGV4dG5hbWUgPSBleHRuYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmluZGV4T2YoXCI/XCIpLFxuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgICAgICBwYXRoU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIubGFzdEluZGV4T2YoXCIuXCIpO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKXtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIgKyBleHRuYW1lICsgdGVtcFN0cjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGV4dG5hbWUgKyB0ZW1wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjaGFuZ2VCYXNlbmFtZShwYXRoU3RyOnN0cmluZywgYmFzZW5hbWU6c3RyaW5nLCBpc1NhbWVFeHQ6Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBudWxsLFxuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBudWxsLFxuICAgICAgICAgICAgICAgIGV4dCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChiYXNlbmFtZS5pbmRleE9mKFwiLlwiKSA9PSAwKXtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlRXh0bmFtZShwYXRoU3RyLCBiYXNlbmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5pbmRleE9mKFwiP1wiKTtcbiAgICAgICAgICAgIHRlbXBTdHIgPSBcIlwiO1xuICAgICAgICAgICAgZXh0ID0gaXNTYW1lRXh0ID8gdGhpcy5leHRuYW1lKHBhdGhTdHIpIDogXCJcIjtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBwYXRoU3RyLnN1YnN0cmluZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgcGF0aFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgICAgIGluZGV4ID0gaW5kZXggPD0gMCA/IDAgOiBpbmRleCArIDE7XG5cbiAgICAgICAgICAgIHJldHVybiBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCkgKyBiYXNlbmFtZSArIGV4dCArIHRlbXBTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dG5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwbGl0UGF0aChwYXRoKVszXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGlybmFtZShwYXRoOnN0cmluZyl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgICAgICAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICAgICAgICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gICAgICAgICAgICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgICAgICAgICAgICAgIC8vbm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRpcikge1xuICAgICAgICAgICAgICAgIC8vaXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICAgICAgICAgICAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJvb3QgKyBkaXI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfc3BsaXRQYXRoKGZpbGVOYW1lOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gU1BMSVRQQVRIX1JFR0VYLmV4ZWMoZmlsZU5hbWUpLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBGdW5jdGlvblV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kKG9iamVjdDphbnksIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkob2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBkZWNsYXJlIHZhciBkb2N1bWVudDphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgRG9tUXVlcnkge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoYXJnc1swXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9kb21zOkFycmF5PEhUTUxFbGVtZW50PiA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIGNvbnN0cnVjdG9yKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEb20oYXJnc1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW2FyZ3NbMF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9pc0RvbUVsZVN0cihhcmdzWzBdKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IFt0aGlzLl9idWlsZERvbShhcmdzWzBdKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmdzWzBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0KGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZG9tc1tpbmRleF07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgcHJlcGVuZChkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXREb206SFRNTEVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgICAgICB0YXJnZXREb20gPSB0aGlzLl9idWlsZERvbShhcmdzWzBdKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5pbnNlcnRCZWZvcmUodGFyZ2V0RG9tLCBkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kVG8oZWxlU3RyOnN0cmluZykge1xuICAgICAgICAgICAgdmFyIHRhcmdldERvbTpEb21RdWVyeSA9IG51bGw7XG5cbiAgICAgICAgICAgIHRhcmdldERvbSA9IERvbVF1ZXJ5LmNyZWF0ZShlbGVTdHIpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RG9tLnByZXBlbmQoZG9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZSgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbSAmJiBkb20ucGFyZW50Tm9kZSAmJiBkb20udGFnTmFtZSAhPSAnQk9EWScpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNzcyhwcm9wZXJ0eTpzdHJpbmcsIHZhbHVlOnN0cmluZyl7XG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGRvbS5zdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhdHRyKG5hbWU6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIGF0dHIobmFtZTpzdHJpbmcsIHZhbHVlOnN0cmluZyk7XG5cbiAgICAgICAgcHVibGljIGF0dHIoLi4uYXJncyl7XG4gICAgICAgICAgICBpZihhcmdzLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KDApLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFyZ3NbMV07XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9pc0RvbUVsZVN0cihlbGVTdHI6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiBlbGVTdHIubWF0Y2goLzwoXFx3KylbXj5dKj48XFwvXFwxPi8pICE9PSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oZWxlU3RyOnN0cmluZyk6SFRNTEVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKGRvbTpIVE1MSHRtbEVsZW1lbnQpOkhUTUxFbGVtZW50O1xuXG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKC4uLmFyZ3MpOkhUTUxFbGVtZW50IHtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnc1swXSkpe1xuICAgICAgICAgICAgICAgIGxldCBkaXYgPSB0aGlzLl9jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICAgICAgICAgICAgICBlbGVTdHI6c3RyaW5nID0gYXJnc1swXTtcblxuICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBlbGVTdHI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY3JlYXRlRWxlbWVudChlbGVTdHIpe1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlU3RyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9