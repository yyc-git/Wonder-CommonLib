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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL0p1ZGdlVXRpbHMudHMiLCJnbG9iYWwvVmFyaWFibGUudHMiLCJnbG9iYWwvZXh0ZW5kLnRzIiwiZ2xvYmFsL0NvbnN0LnRzIiwiTG9nLnRzIiwiTGlzdC50cyIsIkNvbGxlY3Rpb24udHMiLCJIYXNoLnRzIiwiUXVldWUudHMiLCJTdGFjay50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0FycmF5VXRpbHMudHMiLCJ1dGlscy9Db252ZXJ0VXRpbHMudHMiLCJ1dGlscy9FdmVudFV0aWxzLnRzIiwidXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJ1dGlscy9QYXRoVXRpbHMudHMiLCJ1dGlscy9GdW5jdGlvblV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxJQUFJLENBaUdWO0FBakdELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFHVCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUM7UUFBQTtRQThFQSxDQUFDO1FBN0VpQixrQkFBTyxHQUFyQixVQUFzQixHQUFjO1lBQ2hDLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxPQUFPLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDO1FBQ2pGLENBQUM7UUFFYSx5QkFBYyxHQUE1QixVQUE2QixHQUFjO1lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQWdCLENBQUM7UUFDcEUsQ0FBQztRQUVhLG1CQUFRLEdBQXRCLFVBQXVCLEdBQVU7WUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUNsQyxDQUFDO1FBRWEsMEJB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O1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFTywrQkFBWSxHQUFwQixVQUFxQixNQUFhO1lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3ZELENBQUM7UUFLTyw0QkFBUyxHQUFqQjtZQUFrQixjQUFPO2lCQUFQLFdBQU8sQ0FBUCxzQkFBTyxDQUFQLElBQU87Z0JBQVAsNkJBQU87O1lBQ3JCLEVBQUUsQ0FBQSxDQUFDLGVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO2dCQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUNoQyxNQUFNLEdBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QixHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztnQkFFdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDMUIsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUVPLGlDQUFjLEdBQXRCLFVBQXVCLE1BQU07WUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNMLGVBQUM7SUFBRCxDQTNIQSxBQTJIQyxJQUFBO0lBM0hZLGFBQVEsV0EySHBCLENBQUE7QUFDTCxDQUFDLEVBL0hNLElBQUksS0FBSixJQUFJLFFBK0hWIiwiZmlsZSI6IndkQ2IuZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgd2RDYiB7XG4gICAgZGVjbGFyZSB2YXIgZ2xvYmFsOmFueSwgbW9kdWxlOmFueTtcblxuICAgIGNvbnN0IE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgICBleHBvcnQgY2xhc3MgSnVkZ2VVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheShhcnI6QXJyYXk8YW55Pikge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyciAmJiBhcnIubGVuZ3RoO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5RXhhY3RseShhcnI6QXJyYXk8YW55Pikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG51bTpudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09IFwibnVtYmVyXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyRXhhY3RseShudW06bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG51bSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cjpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyID09IFwic3RyaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nRXhhY3RseShzdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihib29sOmJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwoYm9vbCkgPT09ICdbYm9vbGVjdCBCb29sZWFuXSc7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRG9tKG9iajphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc09iamVjdChvYmo6YW55KSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIpOaWreaYr+WQpuS4uuWvueixoeWtl+mdoumHj++8iHt977yJXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRGlyZWN0T2JqZWN0KG9iajphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmo4Dmn6Xlrr/kuLvlr7nosaHmmK/lkKblj6/osIPnlKhcbiAgICAgICAgICpcbiAgICAgICAgICog5Lu75L2V5a+56LGh77yM5aaC5p6c5YW26K+t5LmJ5ZyoRUNNQVNjcmlwdOinhOiMg+S4reiiq+WumuS5iei/h++8jOmCo+S5iOWug+iiq+ensOS4uuWOn+eUn+Wvueixoe+8m1xuICAgICAgICAg546v5aKD5omA5o+Q5L6b55qE77yM6ICM5ZyoRUNNQVNjcmlwdOinhOiMg+S4reayoeacieiiq+aPj+i/sOeahOWvueixoe+8jOaIkeS7rOensOS5i+S4uuWuv+S4u+WvueixoeOAglxuXG4gICAgICAgICDor6Xmlrnms5XnlKjkuo7nibnmgKfmo4DmtYvvvIzliKTmlq3lr7nosaHmmK/lkKblj6/nlKjjgILnlKjms5XlpoLkuIvvvJpcblxuICAgICAgICAgTXlFbmdpbmUgYWRkRXZlbnQoKTpcbiAgICAgICAgIGlmIChUb29sLmp1ZGdlLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkgeyAgICAvL+WIpOaWrWRvbeaYr+WQpuWFt+aciWFkZEV2ZW50TGlzdGVuZXLmlrnms5VcbiAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKHNFdmVudFR5cGUsIGZuSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0hvc3RNZXRob2Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgICAgICAgICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmICEhb2JqZWN0W3Byb3BlcnR5XSkgfHxcbiAgICAgICAgICAgICAgICB0eXBlID09PSBcInVua25vd25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOb2RlSnMoKXtcbiAgICAgICAgICAgIHJldHVybiAoKHR5cGVvZiBnbG9iYWwgIT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwubW9kdWxlKSB8fCAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiKSkgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9IFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvL292ZXJ3cml0ZSBpdCBpbiB0aGUgZW5kIG9mIHRoaXMgZmlsZVxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRnVuY3Rpb24oZnVuYzpGdW5jdGlvbik6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgSnVkZ2VVdGlscy5pc0Z1bmN0aW9uID0gKGZ1bmM6RnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgSnVkZ2VVdGlscy5pc0Z1bmN0aW9uID0gKGZ1bmM6RnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBkZWNsYXJlIHZhciBnbG9iYWw6YW55LHdpbmRvdzphbnk7XG5cbiAgICBleHBvcnQgdmFyIHJvb3Q6YW55O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3ZENiLCBcInJvb3RcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc05vZGVKcygpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93O1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJtb2R1bGUgd2RDYntcbi8vIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbFxuXG4gICAgaWYgKCdwZXJmb3JtYW5jZScgaW4gcm9vdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcm9vdC5wZXJmb3JtYW5jZSA9IHt9O1xuICAgIH1cblxuLy8gSUUgOFxuICAgIERhdGUubm93ID0gKCBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9ICk7XG5cbiAgICBpZiAoJ25vdycgaW4gcm9vdC5wZXJmb3JtYW5jZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHJvb3QucGVyZm9ybWFuY2UudGltaW5nICYmIHJvb3QucGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCA/IHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgICAgICAgICAgIDogRGF0ZS5ub3coKTtcblxuICAgICAgICByb290LnBlcmZvcm1hbmNlLm5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gb2Zmc2V0O1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGV4cG9ydCBjb25zdCAkQlJFQUsgPSB7XG4gICAgICAgIGJyZWFrOnRydWVcbiAgICB9O1xuICAgIGV4cG9ydCBjb25zdCAkUkVNT1ZFID0gdm9pZCAwO1xufVxuXG5cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgTG9nIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbmZvID0ge1xuICAgICAgICAgICAgSU5WQUxJRF9QQVJBTTogXCJpbnZhbGlkIHBhcmFtZXRlclwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfQVRUUklCVVRFOiBcImFic3RyYWN0IGF0dHJpYnV0ZSBuZWVkIG92ZXJyaWRlXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9NRVRIT0Q6IFwiYWJzdHJhY3QgbWV0aG9kIG5lZWQgb3ZlcnJpZGVcIixcblxuICAgICAgICAgICAgaGVscGVyRnVuYzogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZyh2YWwpICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3NlcnRpb246IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVscGVyRnVuYyhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihhcmdzLmxlbmd0aCA9PT0gMyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJnc1sxXSwgYXJnc1swXSwgYXJnc1syXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3MubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwiaW52YWxpZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1Q6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3Qgbm90IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU0hPVUxEOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInNob3VsZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRF9OT1Q6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwic2hvdWxkIG5vdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcInN1cHBvcnRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfU1VQUE9SVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibm90IHN1cHBvcnRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0RFRklORTogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBkZWZpbmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm11c3Qgbm90IGRlZmluZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VOS05PVzogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwidW5rbm93XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhQRUNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJleHBlY3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTkVYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwidW5leHBlY3RcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfRVhJU1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcIm5vdCBleGlzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3V0cHV0IERlYnVnIG1lc3NhZ2UuXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBsb2coLi4ubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLl9leGVjKFwibG9nXCIsIG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgIHJvb3QuYWxlcnQobWVzc2FnZXMuam9pbihcIixcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9leGVjKFwidHJhY2VcIiwgbWVzc2FnZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgLi4ubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9leGVjKFwiYXNzZXJ0XCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBlcnJvcihjb25kLCAuLi5tZXNzYWdlKTphbnkge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICAvKiFcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIHdpbGwgbm90IGludGVycnVwdCwgaXQgd2lsbCB0aHJvdyBlcnJvciBhbmQgY29udGludWUgZXhlYyB0aGUgbGVmdCBzdGF0ZW1lbnRzXG5cbiAgICAgICAgICAgICAgICBidXQgaGVyZSBuZWVkIGludGVycnVwdCEgc28gbm90IHVzZSBpdCBoZXJlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vaWYgKCF0aGlzLl9leGVjKFwiZXJyb3JcIiwgYXJndW1lbnRzLCAxKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5qb2luKFwiXFxuXCIpKTtcbiAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgd2FybiguLi5tZXNzYWdlKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fZXhlYyhcIndhcm5cIiwgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9leGVjKFwidHJhY2VcIiwgW1wid2FybiB0cmFjZVwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfZXhlYyhjb25zb2xlTWV0aG9kLCBhcmdzLCBzbGljZUJlZ2luID0gMCkge1xuICAgICAgICAgICAgaWYgKHJvb3QuY29uc29sZSAmJiByb290LmNvbnNvbGVbY29uc29sZU1ldGhvZF0pIHtcbiAgICAgICAgICAgICAgICByb290LmNvbnNvbGVbY29uc29sZU1ldGhvZF0uYXBwbHkocm9vdC5jb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCBzbGljZUJlZ2luKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGNoaWxkOmFueSk6Ym9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgYzphbnkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYyA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnVpZCAmJiBjLnVpZCAmJiBjaGlsZC51aWQgPT0gYy51aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoY2hpbGQgPT09IGMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZFdpdGhGdW5jKGZ1bmM6RnVuY3Rpb24pOmJvb2xlYW4ge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYoZnVuYyh0aGlzLmNoaWxkcmVuW2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6VCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOkFycmF5PFQ+fExpc3Q8VD58YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46QXJyYXk8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBMaXN0KXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46TGlzdDxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZDphbnkgPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdW5TaGlmdENoaWxkKGNoaWxkOlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2godGhpcy5jaGlsZHJlbiwgZnVuYywgY29udGV4dCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuXG4gICAgICAgIHB1YmxpYyB0b0FycmF5KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjb3B5Q2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNsaWNlKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlbW92ZUNoaWxkSGVscGVyKGFyZzphbnkpOkFycmF5PFQ+IHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCBmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFyZy51aWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID09PSBhcmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9mb3JFYWNoKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gY29udGV4dCB8fCByb290LFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIGxlbiA9IGFyci5sZW5ndGg7XG5cblxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoc2NvcGUsIGFycltpXSwgaSkgPT09ICRCUkVBSykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmVDaGlsZChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBudWxsLFxuICAgICAgICAgICAgICAgIHJlbW92ZWRFbGVtZW50QXJyID0gW10sXG4gICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyciA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoISFmdW5jLmNhbGwoc2VsZiwgZSkpe1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZW1haW5FbGVtZW50QXJyLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSByZW1haW5FbGVtZW50QXJyO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlZEVsZW1lbnRBcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgQ29sbGVjdGlvbjxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjb3B5IChpc0RlZXA6Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNEZWVwID8gQ29sbGVjdGlvbi5jcmVhdGU8VD4oRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcCh0aGlzLmNoaWxkcmVuKSlcbiAgICAgICAgICAgICAgICA6IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZChbXSwgdGhpcy5jaGlsZHJlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbHRlcihmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGJvb2xlYW4pOkNvbGxlY3Rpb248VD4ge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbixcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChjaGlsZHJlbiwgdmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbmRPbmUoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKXtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0OlQgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbHVlOlQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmdW5jLmNhbGwoc2NvcGUsIHZhbHVlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZXZlcnNlICgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPih0aGlzLmNvcHlDaGlsZHJlbigpLnJldmVyc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5yZW1vdmVDaGlsZEhlbHBlcihhcmcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzb3J0KGZ1bmM6KGE6VCwgYjpUKSA9PiBhbnksIGlzU29ydFNlbGYgPSBmYWxzZSl7XG4gICAgICAgICAgICBpZihpc1NvcnRTZWxmKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuYyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYW55KXtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZSAmJiBlW2hhbmRsZXJOYW1lXSAmJiBlW2hhbmRsZXJOYW1lXS5hcHBseShjb250ZXh0IHx8IGUsIHZhbHVlQXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8YW55PihyZXN1bHRBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZVJlcGVhdEl0ZW1zKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TGlzdCA9ICBDb2xsZWN0aW9uLmNyZWF0ZTxUPigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGl0ZW06VCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRMaXN0Lmhhc0NoaWxkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRMaXN0LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRMaXN0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBIYXNoPFQ+IHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSB7fSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPHsgW3M6c3RyaW5nXTpUIH0+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46eyBbczpzdHJpbmddOlQgfSA9IHt9KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbjp7XG4gICAgICAgICAgICBbczpzdHJpbmddOlRcbiAgICAgICAgfSA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0S2V5cygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IENvbGxlY3Rpb24uY3JlYXRlKCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoY2hpbGRyZW5ba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGtleTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFZhbHVlKGtleTpzdHJpbmcsIHZhbHVlOmFueSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbihhcmc6e318SGFzaDxUPil7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBudWxsO1xuXG4gICAgICAgICAgICBpZihhcmcgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGFyZy5nZXRDaGlsZHJlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGFyZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChpLCBjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFwcGVuZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuW2tleV0gaW5zdGFuY2VvZiBDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSA8YW55Pih0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIGMuYWRkQ2hpbGQoPFQ+dmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IDxhbnk+KENvbGxlY3Rpb24uY3JlYXRlPGFueT4oKS5hZGRDaGlsZCh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVDaGlsZChhcmc6YW55KXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmcpKXtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc2VsZi5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NoaWxkcmVuW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGUocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChrZXk6c3RyaW5nKTpib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldICE9PSB2b2lkIDA7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRXaXRoRnVuYyhmdW5jOkZ1bmN0aW9uKTpib29sZWFuIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KXtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2hpbGRyZW5ba2V5XTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKGNoaWxkcmVuLCB2YWx1ZSwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEhhc2guY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmluZE9uZShmdW5jOkZ1bmN0aW9uKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZighZnVuYy5jYWxsKHNjb3BlLCB2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW2tleSwgc2VsZi5nZXRDaGlsZChrZXkpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRNYXAgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmModmFsLCBrZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgTG9nLmVycm9yKCFKdWRnZVV0aWxzLmlzQXJyYXkocmVzdWx0KSB8fCByZXN1bHQubGVuZ3RoICE9PSAyLCBMb2cuaW5mby5GVU5DX01VU1RfQkUoXCJpdGVyYXRvclwiLCBcIltrZXksIHZhbHVlXVwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwW3Jlc3VsdFswXV0gPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHRNYXApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQ29sbGVjdGlvbigpOiBDb2xsZWN0aW9uPGFueT57XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkcmVuKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcih0cnVlLCBMb2cuaW5mby5GVU5DX05PVF9TVVBQT1JUKFwidG9Db2xsZWN0aW9uXCIsIFwidmFsdWUgaXMgSGFzaFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgUXVldWU8VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZnJvbnQoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcmVhcigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bMF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHVzaChlbGVtZW50OlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHBvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKXtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgU3RhY2s8VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHB1c2goZWxlbWVudDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwb3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsZWFyKCl7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYntcbiAgICBkZWNsYXJlIHZhciBkb2N1bWVudDphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgQWpheFV0aWxze1xuICAgICAgICAvKiFcbiAgICAgICAgIOWunueOsGFqYXhcblxuICAgICAgICAgYWpheCh7XG4gICAgICAgICB0eXBlOlwicG9zdFwiLC8vcG9zdOaIluiAhWdldO+8jOmdnuW/hemhu1xuICAgICAgICAgdXJsOlwidGVzdC5qc3BcIiwvL+W/hemhu+eahFxuICAgICAgICAgZGF0YTpcIm5hbWU9ZGlwb28maW5mbz1nb29kXCIsLy/pnZ7lv4XpobtcbiAgICAgICAgIGRhdGFUeXBlOlwianNvblwiLC8vdGV4dC94bWwvanNvbu+8jOmdnuW/hemhu1xuICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXsvL+Wbnuiwg+WHveaVsO+8jOmdnuW/hemhu1xuICAgICAgICAgYWxlcnQoZGF0YS5uYW1lKTtcbiAgICAgICAgIH1cbiAgICAgICAgIH0pOyovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWpheChjb25mKXtcbiAgICAgICAgICAgIHZhciB0eXBlID0gY29uZi50eXBlOy8vdHlwZeWPguaVsCzlj6/pgIlcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25mLnVybDsvL3VybOWPguaVsO+8jOW/heWhq1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBjb25mLmRhdGE7Ly9kYXRh5Y+C5pWw5Y+v6YCJ77yM5Y+q5pyJ5ZyocG9zdOivt+axguaXtumcgOimgVxuICAgICAgICAgICAgdmFyIGRhdGFUeXBlID0gY29uZi5kYXRhVHlwZTsvL2RhdGF0eXBl5Y+C5pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNvbmYuc3VjY2VzczsvL+Wbnuiwg+WHveaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIGVycm9yID0gY29uZi5lcnJvcjtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gbnVsbCkgey8vdHlwZeWPguaVsOWPr+mAie+8jOm7mOiupOS4umdldFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcImdldFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBudWxsKSB7Ly9kYXRhVHlwZeWPguaVsOWPr+mAie+8jOm7mOiupOS4unRleHRcbiAgICAgICAgICAgICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIgPSB0aGlzLl9jcmVhdGVBamF4KGVycm9yKTtcbiAgICAgICAgICAgIGlmICgheGhyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKHR5cGUsIHVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiR0VUXCIgfHwgdHlwZSA9PT0gXCJnZXRcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gXCJQT1NUXCIgfHwgdHlwZSA9PT0gXCJwb3N0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJjb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6cYWpheOiuv+mXrueahOaYr+acrOWcsOaWh+S7tu+8jOWImXN0YXR1c+S4ujBcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICh4aHIuc3RhdHVzID09PSAyMDAgfHwgc2VsZi5faXNMb2NhbEZpbGUoeGhyLnN0YXR1cykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IFwidGV4dFwiIHx8IGRhdGFUeXBlID09PSBcIlRFWFRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/mma7pgJrmlofmnKxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJ4bWxcIiB8fCBkYXRhVHlwZSA9PT0gXCJYTUxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/mjqXmlLZ4bWzmlofmoaNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2VYTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcImpzb25cIiB8fCBkYXRhVHlwZSA9PT0gXCJKU09OXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoZXZhbChcIihcIiArIHhoci5yZXNwb25zZVRleHQgKyBcIilcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9yKHhociwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY3JlYXRlQWpheChlcnJvcikge1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB0cnkgey8vSUXns7vliJfmtY/op4jlmahcbiAgICAgICAgICAgICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdChcIm1pY3Jvc29mdC54bWxodHRwXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTEpIHtcbiAgICAgICAgICAgICAgICB0cnkgey8v6Z2eSUXmtY/op4jlmahcbiAgICAgICAgICAgICAgICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoeGhyLCB7bWVzc2FnZTogXCLmgqjnmoTmtY/op4jlmajkuI3mlK/mjIFhamF477yM6K+35pu05o2i77yBXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHhocjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc0xvY2FsRmlsZShzdGF0dXMpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5VUkwuY29udGFpbihcImZpbGU6Ly9cIikgJiYgc3RhdHVzID09PSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzU291bmRGaWxlKGRhdGFUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVR5cGUgPT09IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgQXJyYXlVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlUmVwZWF0SXRlbXMoYXJyOkFycmF5PGFueT4sIGlzRXF1YWw6KGE6YW55LCBiOmFueSkgPT4gYm9vbGVhbiA9IChhLCBiKT0+IHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgICB9KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb250YWluKHJlc3VsdEFyciwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzRXF1YWwodmFsLCBlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0QXJyLnB1c2goZWxlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0QXJyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250YWluKGFycjpBcnJheTxhbnk+LCBlbGU6YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGVsZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYzpGdW5jdGlvbiA9IGVsZTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFmdW5jLmNhbGwobnVsbCwgdmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlID09PSB2YWx1ZSB8fCAodmFsdWUuY29udGFpbiAmJiB2YWx1ZS5jb250YWluKGVsZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZXhwb3J0IGNsYXNzIENvbnZlcnRVdGlsc3tcbiAgICAgICAgcHVibGljIHN0YXRpYyB0b1N0cmluZyhvYmo6YW55KXtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzTnVtYmVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2lmIChKdWRnZVV0aWxzLmlzalF1ZXJ5KG9iaikpIHtcbiAgICAgICAgICAgIC8vICAgIHJldHVybiBfanFUb1N0cmluZyhvYmopO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udmVydENvZGVUb1N0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEaXJlY3RPYmplY3Qob2JqKSB8fCBKdWRnZVV0aWxzLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NvbnZlcnRDb2RlVG9TdHJpbmcoZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbi50b1N0cmluZygpLnNwbGl0KCdcXG4nKS5zbGljZSgxLCAtMSkuam9pbignXFxuJykgKyAnXFxuJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmluZEV2ZW50KGNvbnRleHQsIGZ1bmMpIHtcbiAgICAgICAgICAgIC8vdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgICAgICAgLy8gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiBmdW4uYXBwbHkob2JqZWN0LCBbc2VsZi53cmFwRXZlbnQoZXZlbnQpXS5jb25jYXQoYXJncykpOyAvL+WvueS6i+S7tuWvueixoei/m+ihjOWMheijhVxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBhZGRFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYXR0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYXR0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gaGFuZGxlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImRldGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmRldGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuZFV0aWxzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3seaLt+i0nVxuICAgICAgICAgKlxuICAgICAgICAgKiDnpLrkvovvvJpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65pWw57uE77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI5LiN5ou36LSdQXJyYXnljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogZXhwZWN0KGV4dGVuZC5leHRlbmREZWVwKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKSkudG9FcXVhbChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSk7XG4gICAgICAgICAqXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuWvueixoe+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOiDveaLt+i0neWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgIGZ1bmN0aW9uIEEoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBBLnByb3RvdHlwZS5hID0gMTtcblxuICAgICAgICAgZnVuY3Rpb24gQigpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEIucHJvdG90eXBlID0gbmV3IEEoKTtcbiAgICAgICAgIEIucHJvdG90eXBlLmIgPSB7IHg6IDEsIHk6IDEgfTtcbiAgICAgICAgIEIucHJvdG90eXBlLmMgPSBbeyB4OiAxIH0sIFsyXV07XG5cbiAgICAgICAgIHZhciB0ID0gbmV3IEIoKTtcblxuICAgICAgICAgcmVzdWx0ID0gZXh0ZW5kLmV4dGVuZERlZXAodCk7XG5cbiAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG4gICAgICAgICB7XG4gICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICBiOiB7IHg6IDEsIHk6IDEgfSxcbiAgICAgICAgICAgICBjOiBbeyB4OiAxIH0sIFsyXV1cbiAgICAgICAgIH0pO1xuICAgICAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAgICAgKiBAcmV0dXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmREZWVwKHBhcmVudCwgY2hpbGQ/LGZpbHRlcj1mdW5jdGlvbih2YWwsIGkpe3JldHVybiB0cnVlO30pIHtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBsZW4gPSAwLFxuICAgICAgICAgICAgICAgIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBzQXJyID0gXCJbb2JqZWN0IEFycmF5XVwiLFxuICAgICAgICAgICAgICAgIHNPYiA9IFwiW29iamVjdCBPYmplY3RdXCIsXG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiXCIsXG4gICAgICAgICAgICAgICAgX2NoaWxkID0gbnVsbDtcblxuICAgICAgICAgICAgLy/mlbDnu4TnmoTor53vvIzkuI3ojrflvpdBcnJheeWOn+Wei+S4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc0Fycikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcGFyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a+56LGh55qE6K+d77yM6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CC5Zug5Li66ICD6JmR5Lul5LiL5oOF5pmv77yaXG4gICAgICAgICAgICAvL+exu0Hnu6fmib/kuo7nsbtC77yM546w5Zyo5oOz6KaB5ou36LSd57G7QeeahOWunuS+i2HnmoTmiJDlkZjvvIjljIXmi6zku47nsbtC57un5om/5p2l55qE5oiQ5ZGY77yJ77yM6YKj5LmI5bCx6ZyA6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBlbHNlIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNPYikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWF5ou36LSdXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29weVB1YmxpY0F0dHJpKHNvdXJjZTphbnkpe1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZERlZXAoc291cmNlLCBkZXN0aW5hdGlvbiwgZnVuY3Rpb24oaXRlbSwgcHJvcGVydHkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5zbGljZSgwLCAxKSAhPT0gXCJfXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgIUp1ZGdlVXRpbHMuaXNGdW5jdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIm1vZHVsZSB3ZENie1xuICAgIHZhciBTUExJVFBBVEhfUkVHRVggPVxuICAgICAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcblxuICAgIC8vcmVmZXJlbmNlIGZyb21cbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb29rZnJvbnQvbGVhcm4tbm90ZS9ibG9iL21hc3Rlci9ibG9nLWJhY2t1cC8yMDE0L25vZGVqcy1wYXRoLm1kXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhVdGlsc3tcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlbmFtZShwYXRoOnN0cmluZywgZXh0PzpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9zcGxpdFBhdGgocGF0aClbMl07XG4gICAgICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gICAgICAgICAgICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgICAgICAgICAgICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGY7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2hhbmdlRXh0bmFtZShwYXRoU3RyOnN0cmluZywgZXh0bmFtZTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBleHRuYW1lID0gZXh0bmFtZSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5pbmRleE9mKFwiP1wiKSxcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHRlbXBTdHIgPSBwYXRoU3RyLnN1YnN0cmluZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgcGF0aFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiLlwiKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCl7XG4gICAgICAgICAgICAgIHJldHVybiBwYXRoU3RyICsgZXh0bmFtZSArIHRlbXBTdHI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCkgKyBleHRuYW1lICsgdGVtcFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY2hhbmdlQmFzZW5hbWUocGF0aFN0cjpzdHJpbmcsIGJhc2VuYW1lOnN0cmluZywgaXNTYW1lRXh0OmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gbnVsbCxcbiAgICAgICAgICAgICAgICBleHQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoYmFzZW5hbWUuaW5kZXhPZihcIi5cIikgPT0gMCl7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUV4dG5hbWUocGF0aFN0ciwgYmFzZW5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIuaW5kZXhPZihcIj9cIik7XG4gICAgICAgICAgICB0ZW1wU3RyID0gXCJcIjtcbiAgICAgICAgICAgIGV4dCA9IGlzU2FtZUV4dCA/IHRoaXMuZXh0bmFtZShwYXRoU3RyKSA6IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoaW5kZXgpO1xuICAgICAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgICAgICBpbmRleCA9IGluZGV4IDw9IDAgPyAwIDogaW5kZXggKyAxO1xuXG4gICAgICAgICAgICByZXR1cm4gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpICsgYmFzZW5hbWUgKyBleHQgKyB0ZW1wU3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRuYW1lKHBhdGg6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGxpdFBhdGgocGF0aClbM107XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGRpcm5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKSxcbiAgICAgICAgICAgICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgICAgICAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICAgICAgICAgICAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAgICAgICAgICAgICAvL25vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgICAgICAgICAgICAgIHJldHVybiAnLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICAgICAgICAvL2l0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgICAgICAgICAgICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByb290ICsgZGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3NwbGl0UGF0aChmaWxlTmFtZTpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIFNQTElUUEFUSF9SRUdFWC5leGVjKGZpbGVOYW1lKS5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgRnVuY3Rpb25VdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmluZChvYmplY3Q6YW55LCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KG9iamVjdCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIERvbVF1ZXJ5IHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGUoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKGFyZ3NbMF0pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZG9tczpBcnJheTxIVE1MRWxlbWVudD4gPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBjb25zdHJ1Y3Rvcihkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRG9tKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IFthcmdzWzBdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5faXNEb21FbGVTdHIoYXJnc1swXSkpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbdGhpcy5fYnVpbGREb20oYXJnc1swXSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9tcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJnc1swXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RvbXNbaW5kZXhdO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgcHJlcGVuZChlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgcHVibGljIHByZXBlbmQoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBwdWJsaWMgcHJlcGVuZCguLi5hcmdzKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RG9tOkhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgdGFyZ2V0RG9tID0gdGhpcy5fYnVpbGREb20oYXJnc1swXSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkb20uaW5zZXJ0QmVmb3JlKHRhcmdldERvbSwgZG9tLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHJlcGVuZFRvKGVsZVN0cjpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXREb206RG9tUXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICB0YXJnZXREb20gPSBEb21RdWVyeS5jcmVhdGUoZWxlU3RyKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldERvbS5wcmVwZW5kKGRvbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20gJiYgZG9tLnBhcmVudE5vZGUgJiYgZG9tLnRhZ05hbWUgIT0gJ0JPRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjc3MocHJvcGVydHk6c3RyaW5nLCB2YWx1ZTpzdHJpbmcpe1xuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBkb20uc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYXR0cihuYW1lOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBhdHRyKG5hbWU6c3RyaW5nLCB2YWx1ZTpzdHJpbmcpO1xuXG4gICAgICAgIHB1YmxpYyBhdHRyKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgaWYoYXJncy5sZW5ndGggPT09IDEpe1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJnc1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgwKS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhcmdzWzFdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaXNEb21FbGVTdHIoZWxlU3RyOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gZWxlU3RyLm1hdGNoKC88KFxcdyspW14+XSo+PFxcL1xcMT4vKSAhPT0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2J1aWxkRG9tKGVsZVN0cjpzdHJpbmcpOkhUTUxFbGVtZW50O1xuICAgICAgICBwcml2YXRlIF9idWlsZERvbShkb206SFRNTEh0bWxFbGVtZW50KTpIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9idWlsZERvbSguLi5hcmdzKTpIVE1MRWxlbWVudCB7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzU3RyaW5nKGFyZ3NbMF0pKXtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gdGhpcy5fY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgICAgICAgICAgICAgZWxlU3RyOnN0cmluZyA9IGFyZ3NbMF07XG5cbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZWxlU3RyO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NyZWF0ZUVsZW1lbnQoZWxlU3RyKXtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZVN0cik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==