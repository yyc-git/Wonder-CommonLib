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
        Collection.prototype.copy = function (isDeep) {
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
                else if (val instanceof Hash) {
                    wdCb.Log.error(true, wdCb.Log.info.FUNC_NOT_SUPPORT("toCollection", "value is Hash"));
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
                result.push(val);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL0p1ZGdlVXRpbHMudHMiLCJnbG9iYWwvVmFyaWFibGUudHMiLCJnbG9iYWwvZXh0ZW5kLnRzIiwiZ2xvYmFsL0NvbnN0LnRzIiwiTG9nLnRzIiwiTGlzdC50cyIsIkNvbGxlY3Rpb24udHMiLCJIYXNoLnRzIiwiUXVldWUudHMiLCJTdGFjay50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0FycmF5VXRpbHMudHMiLCJ1dGlscy9Db252ZXJ0VXRpbHMudHMiLCJ1dGlscy9FdmVudFV0aWxzLnRzIiwidXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJ1dGlscy9QYXRoVXRpbHMudHMiLCJ1dGlscy9GdW5jdGlvblV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxJQUFJLENBaUdWO0FBakdELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFHVCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUM7UUFBQTtRQThFQSxDQUFDO1FBN0VpQixrQkFBTyxHQUFyQixVQUFzQixHQUFPO1lBQ3pCLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxPQUFPLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDO1FBQ2pGLENBQUM7UUFFYSx5QkFBYyxHQUE1QixVQUE2QixHQUFPO1lBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQWdCLENBQUM7UUFDcEUsQ0FBQztRQUVhLG1CQUFRLEdBQXRCLFVBQXVCLEdBQU87WUFDMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUNsQyxDQUFDO1FBRWEsMEJB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cyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB3ZENiIHtcbiAgICBkZWNsYXJlIHZhciBnbG9iYWw6YW55LCBtb2R1bGU6YW55O1xuXG4gICAgY29uc3QgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAgIGV4cG9ydCBjbGFzcyBKdWRnZVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5KGFycjphbnkpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcnIgJiYgYXJyLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheUV4YWN0bHkoYXJyOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG51bTphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09IFwibnVtYmVyXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyRXhhY3RseShudW06YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG51bSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cjphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyID09IFwic3RyaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nRXhhY3RseShzdHI6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihib29sOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChib29sKSA9PT0gJ1tib29sZWN0IEJvb2xlYW5dJztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEb20ob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzT2JqZWN0KG9iajphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3Q6YW55LCBwcm9wZXJ0eTphbnkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iamVjdFtwcm9wZXJ0eV0pIHx8XG4gICAgICAgICAgICAgICAgdHlwZSA9PT0gXCJ1bmtub3duXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTm9kZUpzKCl7XG4gICAgICAgICAgICByZXR1cm4gKCh0eXBlb2YgZ2xvYmFsICE9IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLm1vZHVsZSkgfHwgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIikpICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9vdmVyd3JpdGUgaXQgaW4gdGhlIGVuZCBvZiB0aGlzIGZpbGVcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmM6YW55KTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAgIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICAgIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgICAgICBKdWRnZVV0aWxzLmlzRnVuY3Rpb24gPSAoZnVuYzphbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgSnVkZ2VVdGlscy5pc0Z1bmN0aW9uID0gKGZ1bmM6YW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZGVjbGFyZSB2YXIgZ2xvYmFsOmFueSx3aW5kb3c6YW55O1xuXG4gICAgZXhwb3J0IHZhciByb290OmFueTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2RDYiwgXCJyb290XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNOb2RlSnMoKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwibW9kdWxlIHdkQ2J7XG4vLyBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGxcblxuICAgIGlmICgncGVyZm9ybWFuY2UnIGluIHJvb3QgPT09IGZhbHNlKSB7XG4gICAgICAgIHJvb3QucGVyZm9ybWFuY2UgPSB7fTtcbiAgICB9XG5cbi8vIElFIDhcbiAgICBEYXRlLm5vdyA9ICggRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfSApO1xuXG4gICAgaWYgKCdub3cnIGluIHJvb3QucGVyZm9ybWFuY2UgPT09IGZhbHNlKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSByb290LnBlcmZvcm1hbmNlLnRpbWluZyAmJiByb290LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgPyBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gICAgICAgICAgICA6IERhdGUubm93KCk7XG5cbiAgICAgICAgcm9vdC5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG9mZnNldDtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBleHBvcnQgY29uc3QgJEJSRUFLID0ge1xuICAgICAgICBicmVhazp0cnVlXG4gICAgfTtcbiAgICBleHBvcnQgY29uc3QgJFJFTU9WRSA9IHZvaWQgMDtcbn1cblxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIExvZyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW5mbyA9IHtcbiAgICAgICAgICAgIElOVkFMSURfUEFSQU06IFwiaW52YWxpZCBwYXJhbWV0ZXJcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX0FUVFJJQlVURTogXCJhYnN0cmFjdCBhdHRyaWJ1dGUgbmVlZCBvdmVycmlkZVwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfTUVUSE9EOiBcImFic3RyYWN0IG1ldGhvZCBuZWVkIG92ZXJyaWRlXCIsXG5cbiAgICAgICAgICAgIGhlbHBlckZ1bmM6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcodmFsKSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNzZXJ0aW9uOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBpZihhcmdzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoYXJncy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3NbMV0sIGFyZ3NbMF0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmdzLmxlbmd0aCBtdXN0IDw9IDNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgRlVOQ19JTlZBTElEOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImludmFsaWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzaG91bGRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTERfTk9UOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInNob3VsZCBub3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm5vdCBzdXBwb3J0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3QgZGVmaW5lXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IG5vdCBkZWZpbmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVua25vd1wiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX0VYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInVuZXhwZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX0VYSVNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJub3QgZXhpc3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZighdGhpcy5fZXhlYyhcImxvZ1wiLCBtZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICByb290LmFsZXJ0KG1lc3NhZ2VzLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIG1lc3NhZ2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmlq3oqIDlpLHotKXml7bvvIzkvJrmj5DnpLrplJnor6/kv6Hmga/vvIzkvYbnqIvluo/kvJrnu6fnu63miafooYzkuIvljrtcbiAgICAgICAgICog5L2/55So5pat6KiA5o2V5o2J5LiN5bqU6K+l5Y+R55Sf55qE6Z2e5rOV5oOF5Ya144CC5LiN6KaB5re35reG6Z2e5rOV5oOF5Ya15LiO6ZSZ6K+v5oOF5Ya15LmL6Ze055qE5Yy65Yir77yM5ZCO6ICF5piv5b+F54S25a2Y5Zyo55qE5bm25LiU5piv5LiA5a6a6KaB5L2c5Ye65aSE55CG55qE44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIDHvvInlr7npnZ7pooTmnJ/plJnor6/kvb/nlKjmlq3oqIBcbiAgICAgICAgIOaWreiogOS4reeahOW4g+WwlOihqOi+vuW8j+eahOWPjemdouS4gOWumuimgeaPj+i/sOS4gOS4qumdnumihOacn+mUmeivr++8jOS4i+mdouaJgOi/sOeahOWcqOS4gOWumuaDheWGteS4i+S4uumdnumihOacn+mUmeivr+eahOS4gOS6m+S+i+WtkO+8mlxuICAgICAgICAg77yIMe+8ieepuuaMh+mSiOOAglxuICAgICAgICAg77yIMu+8iei+k+WFpeaIluiAhei+k+WHuuWPguaVsOeahOWAvOS4jeWcqOmihOacn+iMg+WbtOWGheOAglxuICAgICAgICAg77yIM++8ieaVsOe7hOeahOi2iueVjOOAglxuICAgICAgICAg6Z2e6aKE5pyf6ZSZ6K+v5a+55bqU55qE5bCx5piv6aKE5pyf6ZSZ6K+v77yM5oiR5Lus6YCa5bi45L2/55So6ZSZ6K+v5aSE55CG5Luj56CB5p2l5aSE55CG6aKE5pyf6ZSZ6K+v77yM6ICM5L2/55So5pat6KiA5aSE55CG6Z2e6aKE5pyf6ZSZ6K+v44CC5Zyo5Luj56CB5omn6KGM6L+H56iL5Lit77yM5pyJ5Lqb6ZSZ6K+v5rC46L+c5LiN5bqU6K+l5Y+R55Sf77yM6L+Z5qC355qE6ZSZ6K+v5piv6Z2e6aKE5pyf6ZSZ6K+v44CC5pat6KiA5Y+v5Lul6KKr55yL5oiQ5piv5LiA56eN5Y+v5omn6KGM55qE5rOo6YeK77yM5L2g5LiN6IO95L6d6LWW5a6D5p2l6K6p5Luj56CB5q2j5bi45bel5L2c77yI44CKQ29kZSBDb21wbGV0ZSAy44CL77yJ44CC5L6L5aaC77yaXG4gICAgICAgICBpbnQgblJlcyA9IGYoKTsgLy8gblJlcyDnlLEgZiDlh73mlbDmjqfliLbvvIwgZiDlh73mlbDkv53or4Hov5Tlm57lgLzkuIDlrprlnKggLTEwMCB+IDEwMFxuICAgICAgICAgQXNzZXJ0KC0xMDAgPD0gblJlcyAmJiBuUmVzIDw9IDEwMCk7IC8vIOaWreiogO+8jOS4gOS4quWPr+aJp+ihjOeahOazqOmHilxuICAgICAgICAg55Sx5LqOIGYg5Ye95pWw5L+d6K+B5LqG6L+U5Zue5YC85aSE5LqOIC0xMDAgfiAxMDDvvIzpgqPkuYjlpoLmnpzlh7rnjrDkuoYgblJlcyDkuI3lnKjov5nkuKrojIPlm7TnmoTlgLzml7bvvIzlsLHooajmmI7kuIDkuKrpnZ7pooTmnJ/plJnor6/nmoTlh7rnjrDjgILlkI7pnaLkvJrorrLliLDigJzpmpTmoI/igJ3vvIzpgqPml7bkvJrlr7nmlq3oqIDmnInmm7TliqDmt7HliLvnmoTnkIbop6PjgIJcbiAgICAgICAgIDLvvInkuI3opoHmiorpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK1cbiAgICAgICAgIOaWreiogOeUqOS6jui9r+S7tueahOW8gOWPkeWSjOe7tOaKpO+8jOiAjOmAmuW4uOS4jeWcqOWPkeihjOeJiOacrOS4reWMheWQq+aWreiogOOAglxuICAgICAgICAg6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5Lit5piv5LiN5q2j56Gu55qE77yM5Zug5Li65Zyo5Y+R6KGM54mI5pys5Lit77yM6L+Z5Lqb5Luj56CB6YCa5bi45LiN5Lya6KKr5omn6KGM77yM5L6L5aaC77yaXG4gICAgICAgICBBc3NlcnQoZigpKTsgLy8gZiDlh73mlbDpgJrluLjlnKjlj5HooYzniYjmnKzkuK3kuI3kvJrooqvmiafooYxcbiAgICAgICAgIOiAjOS9v+eUqOWmguS4i+aWueazleWImeavlOi+g+WuieWFqO+8mlxuICAgICAgICAgcmVzID0gZigpO1xuICAgICAgICAgQXNzZXJ0KHJlcyk7IC8vIOWuieWFqFxuICAgICAgICAgM++8ieWvueadpea6kOS6juWGhemDqOezu+e7n+eahOWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOiAjOS4jeimgeWvueWklumDqOS4jeWPr+mdoOeahOaVsOaNruS9v+eUqOaWreiogO+8jOWvueS6juWklumDqOS4jeWPr+mdoOaVsOaNru+8jOW6lOivpeS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeOAglxuICAgICAgICAg5YaN5qyh5by66LCD77yM5oqK5pat6KiA55yL5oiQ5Y+v5omn6KGM55qE5rOo6YeK44CCXG4gICAgICAgICAqIEBwYXJhbSBjb25kIOWmguaenGNvbmTov5Tlm55mYWxzZe+8jOWImeaWreiogOWksei0pe+8jOaYvuekum1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXNzZXJ0KGNvbmQsIC4uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBpZiAoY29uZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZXhlYyhcImFzc2VydFwiLCBhcmd1bWVudHMsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgLi4ubWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgLyohXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciB3aWxsIG5vdCBpbnRlcnJ1cHQsIGl0IHdpbGwgdGhyb3cgZXJyb3IgYW5kIGNvbnRpbnVlIGV4ZWMgdGhlIGxlZnQgc3RhdGVtZW50c1xuXG4gICAgICAgICAgICAgICAgYnV0IGhlcmUgbmVlZCBpbnRlcnJ1cHQhIHNvIG5vdCB1c2UgaXQgaGVyZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL2lmICghdGhpcy5fZXhlYyhcImVycm9yXCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuam9pbihcIlxcblwiKSk7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhcm4oLi4ubWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2V4ZWMoXCJ3YXJuXCIsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIFtcIndhcm4gdHJhY2VcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2V4ZWMoY29uc29sZU1ldGhvZCwgYXJncywgc2xpY2VCZWdpbiA9IDApIHtcbiAgICAgICAgICAgIGlmIChyb290LmNvbnNvbGUgJiYgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdLmFwcGx5KHJvb3QuY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VCZWdpbikpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgTGlzdDxUPiB7XG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjpBcnJheTxUPiA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChjaGlsZDphbnkpOmJvb2xlYW4ge1xuICAgICAgICAgICAgdmFyIGM6YW55ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGMgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC51aWQgJiYgYy51aWQgJiYgY2hpbGQudWlkID09IGMudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGNoaWxkID09PSBjKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGZ1bmModGhpcy5jaGlsZHJlbltpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGluZGV4Om51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkOlQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKGFyZzpBcnJheTxUPnxMaXN0PFQ+fGFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkFycmF5PFQ+ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgTGlzdCl7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkxpc3Q8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4uZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQ6YW55ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHVuU2hpZnRDaGlsZChjaGlsZDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHVibGljIHJlbW92ZUNoaWxkQXQgKGluZGV4KSB7XG4gICAgICAgIC8vICAgIExvZy5lcnJvcihpbmRleCA8IDAsIFwi5bqP5Y+35b+F6aG75aSn5LqO562J5LqOMFwiKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgY29weUNoaWxkcmVuKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5zbGljZSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCByZW1vdmVDaGlsZEhlbHBlcihhcmc6YW55KTpBcnJheTxUPiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnVpZCA9PT0gYXJnLnVpZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sICAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZSA9PT0gYXJnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9yRWFjaChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGNvbnRleHQgfHwgcm9vdCxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlQ2hpbGQoYXJyOlRbXSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHJlbWFpbkVsZW1lbnRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCEhZnVuYy5jYWxsKHNlbGYsIGUpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEVsZW1lbnRBcnIucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gcmVtYWluRWxlbWVudEFycjtcblxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRFbGVtZW50QXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY29weSAoaXNEZWVwOmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRGVlcCA/IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY2hpbGRyZW4sIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2Upe1xuICAgICAgICAgICAgaWYoaXNTb3J0U2VsZil7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zb3J0KGZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPih0aGlzLmNvcHlDaGlsZHJlbigpLnNvcnQoZnVuYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyhlLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2UgJiYgZVtoYW5kbGVyTmFtZV0gJiYgZVtoYW5kbGVyTmFtZV0uYXBwbHkoY29udGV4dCB8fCBlLCB2YWx1ZUFycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPGFueT4ocmVzdWx0QXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVSZXBlYXRJdGVtcygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdExpc3QgPSAgQ29sbGVjdGlvbi5jcmVhdGU8VD4oKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChpdGVtOlQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0TGlzdC5oYXNDaGlsZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0TGlzdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWVzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGNoaWxkcmVuW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChrZXk6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShrZXk6c3RyaW5nLCB2YWx1ZTphbnkpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOnt9fEhhc2g8VD4pe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYoYXJnIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmcuZ2V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihpIGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaSwgY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNlbGYuX2NoaWxkcmVuW2tleV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHJlbltrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGQoa2V5OnN0cmluZyk6Ym9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XSAhPT0gdm9pZCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkV2l0aEZ1bmMoZnVuYzpGdW5jdGlvbik6Ym9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSl7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkcmVuW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmlsdGVyKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNoaWxkcmVuW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChjaGlsZHJlbiwgdmFsdWUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbmRPbmUoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWZ1bmMuY2FsbChzY29wZSwgdmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtrZXksIHNlbGYuZ2V0Q2hpbGQoa2V5KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0NvbGxlY3Rpb24oKTpDb2xsZWN0aW9uPGFueT57XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkcmVuKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcih0cnVlLCBMb2cuaW5mby5GVU5DX05PVF9TVVBQT1JUKFwidG9Db2xsZWN0aW9uXCIsIFwidmFsdWUgaXMgSGFzaFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKTpBcnJheTxhbnk+e1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBRdWV1ZTxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBmcm9udCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWFyKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBTdGFjazxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHVzaChlbGVtZW50OlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHBvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKXtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBBamF4VXRpbHN7XG4gICAgICAgIC8qIVxuICAgICAgICAg5a6e546wYWpheFxuXG4gICAgICAgICBhamF4KHtcbiAgICAgICAgIHR5cGU6XCJwb3N0XCIsLy9wb3N05oiW6ICFZ2V077yM6Z2e5b+F6aG7XG4gICAgICAgICB1cmw6XCJ0ZXN0LmpzcFwiLC8v5b+F6aG755qEXG4gICAgICAgICBkYXRhOlwibmFtZT1kaXBvbyZpbmZvPWdvb2RcIiwvL+mdnuW/hemhu1xuICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsLy90ZXh0L3htbC9qc29u77yM6Z2e5b+F6aG7XG4gICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpey8v5Zue6LCD5Ye95pWw77yM6Z2e5b+F6aG7XG4gICAgICAgICBhbGVydChkYXRhLm5hbWUpO1xuICAgICAgICAgfVxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhamF4KGNvbmYpe1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjb25mLnR5cGU7Ly90eXBl5Y+C5pWwLOWPr+mAiVxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmYudXJsOy8vdXJs5Y+C5pWw77yM5b+F5aGrXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGNvbmYuZGF0YTsvL2RhdGHlj4LmlbDlj6/pgInvvIzlj6rmnInlnKhwb3N06K+35rGC5pe26ZyA6KaBXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBjb25mLmRhdGFUeXBlOy8vZGF0YXR5cGXlj4LmlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY29uZi5zdWNjZXNzOy8v5Zue6LCD5Ye95pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjb25mLmVycm9yO1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBudWxsKSB7Ly90eXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6Z2V0XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IG51bGwpIHsvL2RhdGFUeXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6dGV4dFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhociA9IHRoaXMuX2NyZWF0ZUFqYXgoZXJyb3IpO1xuICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJHRVRcIiB8fCB0eXBlID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcIlBPU1RcIiB8fCB0eXBlID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxhamF46K6/6Zeu55qE5piv5pys5Zyw5paH5Lu277yM5YiZc3RhdHVz5Li6MFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCBzZWxmLl9pc0xvY2FsRmlsZSh4aHIuc3RhdHVzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZGF0YVR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aZrumAmuaWh+acrFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcInhtbFwiIHx8IGRhdGFUeXBlID09PSBcIlhNTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aOpeaUtnhtbOaWh+aho1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVhNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwianNvblwiIHx8IGRhdGFUeXBlID09PSBcIkpTT05cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhldmFsKFwiKFwiICsgeGhyLnJlc3BvbnNlVGV4dCArIFwiKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jcmVhdGVBamF4KGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7Ly9JReezu+WIl+a1j+iniOWZqFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwibWljcm9zb2Z0LnhtbGh0dHBcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7Ly/pnZ5JRea1j+iniOWZqFxuICAgICAgICAgICAgICAgICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih4aHIsIHttZXNzYWdlOiBcIuaCqOeahOa1j+iniOWZqOS4jeaUr+aMgWFqYXjvvIzor7fmm7TmjaLvvIFcIn0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGhyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzTG9jYWxGaWxlKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LlVSTC5jb250YWluKFwiZmlsZTovL1wiKSAmJiBzdGF0dXMgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNTb3VuZEZpbGUoZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhVHlwZSA9PT0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBBcnJheVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVSZXBlYXRJdGVtcyhhcnI6QXJyYXk8YW55PiwgaXNFcXVhbDooYTphbnksIGI6YW55KSA9PiBib29sZWFuID0gKGEsIGIpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnRhaW4ocmVzdWx0QXJyLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNFcXVhbCh2YWwsIGVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChlbGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRBcnI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRhaW4oYXJyOkFycmF5PGFueT4sIGVsZTphbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oZWxlKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jOkZ1bmN0aW9uID0gZWxlO1xuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWZ1bmMuY2FsbChudWxsLCB2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUgPT09IHZhbHVlIHx8ICh2YWx1ZS5jb250YWluICYmIHZhbHVlLmNvbnRhaW4oZWxlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFdmVudFV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kRXZlbnQoY29udGV4dCwgZnVuYykge1xuICAgICAgICAgICAgLy92YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAvLyAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZ1bi5hcHBseShvYmplY3QsIFtzZWxmLndyYXBFdmVudChldmVudCldLmNvbmNhdChhcmdzKSk7IC8v5a+55LqL5Lu25a+56LGh6L+b6KGM5YyF6KOFXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGFkZEV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhdHRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiZGV0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5kVXRpbHMge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rex5ou36LSdXG4gICAgICAgICAqXG4gICAgICAgICAqIOekuuS+i++8mlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrmlbDnu4TvvIzog73lpJ/miJDlip/mi7fotJ3vvIjkuI3mi7fotJ1BcnJheeWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiBleHBlY3QoZXh0ZW5kLmV4dGVuZERlZXAoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pKS50b0VxdWFsKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKTtcbiAgICAgICAgICpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65a+56LGh77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI6IO95ou36LSd5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICAgZnVuY3Rpb24gQSgpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEEucHJvdG90eXBlLmEgPSAxO1xuXG4gICAgICAgICBmdW5jdGlvbiBCKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQi5wcm90b3R5cGUgPSBuZXcgQSgpO1xuICAgICAgICAgQi5wcm90b3R5cGUuYiA9IHsgeDogMSwgeTogMSB9O1xuICAgICAgICAgQi5wcm90b3R5cGUuYyA9IFt7IHg6IDEgfSwgWzJdXTtcblxuICAgICAgICAgdmFyIHQgPSBuZXcgQigpO1xuXG4gICAgICAgICByZXN1bHQgPSBleHRlbmQuZXh0ZW5kRGVlcCh0KTtcblxuICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcbiAgICAgICAgIHtcbiAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgIGI6IHsgeDogMSwgeTogMSB9LFxuICAgICAgICAgICAgIGM6IFt7IHg6IDEgfSwgWzJdXVxuICAgICAgICAgfSk7XG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIGNoaWxkXG4gICAgICAgICAqIEByZXR1cm5zXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZERlZXAocGFyZW50LCBjaGlsZD8sZmlsdGVyPWZ1bmN0aW9uKHZhbCwgaSl7cmV0dXJuIHRydWU7fSkge1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGxlbiA9IDAsXG4gICAgICAgICAgICAgICAgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIHNBcnIgPSBcIltvYmplY3QgQXJyYXldXCIsXG4gICAgICAgICAgICAgICAgc09iID0gXCJbb2JqZWN0IE9iamVjdF1cIixcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJcIixcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBudWxsO1xuXG4gICAgICAgICAgICAvL+aVsOe7hOeahOivne+8jOS4jeiOt+W+l0FycmF55Y6f5Z6L5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzQXJyKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwgW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXJlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/lr7nosaHnmoTor53vvIzopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgILlm6DkuLrogIPomZHku6XkuIvmg4Xmma/vvJpcbiAgICAgICAgICAgIC8v57G7Qee7p+aJv+S6juexu0LvvIznjrDlnKjmg7PopoHmi7fotJ3nsbtB55qE5a6e5L6LYeeahOaIkOWRmO+8iOWMheaLrOS7juexu0Lnu6fmib/mnaXnmoTmiJDlkZjvvInvvIzpgqPkuYjlsLHpnIDopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc09iKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IHBhcmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9jaGlsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtYXmi7fotJ1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kKGRlc3RpbmF0aW9uOmFueSwgc291cmNlOmFueSkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gXCJcIjtcblxuICAgICAgICAgICAgZm9yIChwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjb3B5UHVibGljQXR0cmkoc291cmNlOmFueSl7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZXh0ZW5kRGVlcChzb3VyY2UsIGRlc3RpbmF0aW9uLCBmdW5jdGlvbihpdGVtLCBwcm9wZXJ0eSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnNsaWNlKDAsIDEpICE9PSBcIl9cIlxuICAgICAgICAgICAgICAgICAgICAmJiAhSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwibW9kdWxlIHdkQ2J7XG4gICAgdmFyIFNQTElUUEFUSF9SRUdFWCA9XG4gICAgICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xuXG4gICAgLy9yZWZlcmVuY2UgZnJvbVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2Nvb2tmcm9udC9sZWFybi1ub3RlL2Jsb2IvbWFzdGVyL2Jsb2ctYmFja3VwLzIwMTQvbm9kZWpzLXBhdGgubWRcbiAgICBleHBvcnQgY2xhc3MgUGF0aFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2VuYW1lKHBhdGg6c3RyaW5nLCBleHQ/OnN0cmluZyl7XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKVsyXTtcbiAgICAgICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgICAgICAgICAgIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgICAgICAgICAgICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZjtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjaGFuZ2VFeHRuYW1lKHBhdGhTdHI6c3RyaW5nLCBleHRuYW1lOnN0cmluZykge1xuICAgICAgICAgICAgdmFyIGV4dG5hbWUgPSBleHRuYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmluZGV4T2YoXCI/XCIpLFxuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgICAgICBwYXRoU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIubGFzdEluZGV4T2YoXCIuXCIpO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKXtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIgKyBleHRuYW1lICsgdGVtcFN0cjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGV4dG5hbWUgKyB0ZW1wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjaGFuZ2VCYXNlbmFtZShwYXRoU3RyOnN0cmluZywgYmFzZW5hbWU6c3RyaW5nLCBpc1NhbWVFeHQ6Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBudWxsLFxuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBudWxsLFxuICAgICAgICAgICAgICAgIGV4dCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChiYXNlbmFtZS5pbmRleE9mKFwiLlwiKSA9PSAwKXtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlRXh0bmFtZShwYXRoU3RyLCBiYXNlbmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5pbmRleE9mKFwiP1wiKTtcbiAgICAgICAgICAgIHRlbXBTdHIgPSBcIlwiO1xuICAgICAgICAgICAgZXh0ID0gaXNTYW1lRXh0ID8gdGhpcy5leHRuYW1lKHBhdGhTdHIpIDogXCJcIjtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBwYXRoU3RyLnN1YnN0cmluZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgcGF0aFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgICAgIGluZGV4ID0gaW5kZXggPD0gMCA/IDAgOiBpbmRleCArIDE7XG5cbiAgICAgICAgICAgIHJldHVybiBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCkgKyBiYXNlbmFtZSArIGV4dCArIHRlbXBTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dG5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwbGl0UGF0aChwYXRoKVszXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGlybmFtZShwYXRoOnN0cmluZyl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgICAgICAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICAgICAgICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gICAgICAgICAgICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgICAgICAgICAgICAgIC8vbm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRpcikge1xuICAgICAgICAgICAgICAgIC8vaXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICAgICAgICAgICAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJvb3QgKyBkaXI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfc3BsaXRQYXRoKGZpbGVOYW1lOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gU1BMSVRQQVRIX1JFR0VYLmV4ZWMoZmlsZU5hbWUpLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBGdW5jdGlvblV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kKG9iamVjdDphbnksIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkob2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBkZWNsYXJlIHZhciBkb2N1bWVudDphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgRG9tUXVlcnkge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoYXJnc1swXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9kb21zOkFycmF5PEhUTUxFbGVtZW50PiA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIGNvbnN0cnVjdG9yKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEb20oYXJnc1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW2FyZ3NbMF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9pc0RvbUVsZVN0cihhcmdzWzBdKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IFt0aGlzLl9idWlsZERvbShhcmdzWzBdKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmdzWzBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0KGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZG9tc1tpbmRleF07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgcHJlcGVuZChkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXREb206SFRNTEVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgICAgICB0YXJnZXREb20gPSB0aGlzLl9idWlsZERvbShhcmdzWzBdKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5pbnNlcnRCZWZvcmUodGFyZ2V0RG9tLCBkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwcmVwZW5kVG8oZWxlU3RyOnN0cmluZykge1xuICAgICAgICAgICAgdmFyIHRhcmdldERvbTpEb21RdWVyeSA9IG51bGw7XG5cbiAgICAgICAgICAgIHRhcmdldERvbSA9IERvbVF1ZXJ5LmNyZWF0ZShlbGVTdHIpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RG9tLnByZXBlbmQoZG9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZSgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbSAmJiBkb20ucGFyZW50Tm9kZSAmJiBkb20udGFnTmFtZSAhPSAnQk9EWScpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNzcyhwcm9wZXJ0eTpzdHJpbmcsIHZhbHVlOnN0cmluZyl7XG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGRvbS5zdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhdHRyKG5hbWU6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIGF0dHIobmFtZTpzdHJpbmcsIHZhbHVlOnN0cmluZyk7XG5cbiAgICAgICAgcHVibGljIGF0dHIoLi4uYXJncyl7XG4gICAgICAgICAgICBpZihhcmdzLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KDApLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFyZ3NbMV07XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9pc0RvbUVsZVN0cihlbGVTdHI6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiBlbGVTdHIubWF0Y2goLzwoXFx3KylbXj5dKj48XFwvXFwxPi8pICE9PSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oZWxlU3RyOnN0cmluZyk6SFRNTEVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKGRvbTpIVE1MSHRtbEVsZW1lbnQpOkhUTUxFbGVtZW50O1xuXG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKC4uLmFyZ3MpOkhUTUxFbGVtZW50IHtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnc1swXSkpe1xuICAgICAgICAgICAgICAgIGxldCBkaXYgPSB0aGlzLl9jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICAgICAgICAgICAgICBlbGVTdHI6c3RyaW5nID0gYXJnc1swXTtcblxuICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBlbGVTdHI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY3JlYXRlRWxlbWVudChlbGVTdHIpe1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlU3RyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9