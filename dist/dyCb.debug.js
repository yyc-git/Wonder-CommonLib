var dyCb;
(function (dyCb) {
    var JudgeUtils = (function () {
        function JudgeUtils() {
        }
        JudgeUtils.isArray = function (val) {
            return Object.prototype.toString.call(val) === "[object Array]";
        };
        JudgeUtils.isFunction = function (func) {
            return Object.prototype.toString.call(func) === "[object Function]";
        };
        JudgeUtils.isNumber = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Number]";
        };
        JudgeUtils.isString = function (str) {
            return Object.prototype.toString.call(str) === "[object String]";
        };
        JudgeUtils.isBoolean = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Boolean]";
        };
        JudgeUtils.isDom = function (obj) {
            return obj instanceof HTMLElement;
        };
        /**
         * 判断是否为对象字面量（{}）
         */
        JudgeUtils.isDirectObject = function (obj) {
            if (Object.prototype.toString.call(obj) === "[object Object]") {
                return true;
            }
            return false;
        };
        /**
         * 检查宿主对象是否可调用
         *
         * 任何对象，如果其语义在ECMAScript规范中被定义过，那么它被称为原生对象；
         环境所提供的，而在ECMAScript规范中没有被描述的对象，我们称之为宿主对象。

         该方法用于特性检测，判断对象是否可用。用法如下：

         MyEngine addEvent():
         if (Tool.judge.isHostMethod(dom, "addEventListener")) {    //判断dom是否具有addEventListener方法
            dom.addEventListener(sEventType, fnHandler, false);
            }
         */
        JudgeUtils.isHostMethod = function (object, property) {
            var type = typeof object[property];
            return type === "function" ||
                (type === "object" && !!object[property]) ||
                type === "unknown";
        };
        JudgeUtils.isNodeJs = function () {
            return ((typeof global != "undefined" && global.module) || (typeof module != "undefined")) && typeof module.exports != "undefined";
        };
        return JudgeUtils;
    })();
    dyCb.JudgeUtils = JudgeUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    Object.defineProperty(dyCb, "root", {
        get: function () {
            if (dyCb.JudgeUtils.isNodeJs()) {
                return global;
            }
            return window;
        }
    });
})(dyCb || (dyCb = {}));

var dyCb;
(function (dyCb) {
    // performance.now polyfill
    if ('performance' in dyCb.root === false) {
        dyCb.root.performance = {};
    }
    // IE 8
    Date.now = (Date.now || function () {
        return new Date().getTime();
    });
    if ('now' in dyCb.root.performance === false) {
        var offset = dyCb.root.performance.timing && dyCb.root.performance.timing.navigationStart ? performance.timing.navigationStart
            : Date.now();
        dyCb.root.performance.now = function () {
            return Date.now() - offset;
        };
    }
})(dyCb || (dyCb = {}));

var dyCb;
(function (dyCb) {
    dyCb.$BREAK = {
        break: true
    };
    dyCb.$REMOVE = void 0;
})(dyCb || (dyCb = {}));

var dyCb;
(function (dyCb) {
    var Log = (function () {
        function Log() {
        }
        /**
         * Output Debug message.
         * @function
         * @param {String} message
         */
        Log.log = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i - 0] = arguments[_i];
            }
            if (!this._exec("trace", Array.prototype.slice.call(arguments, 0))) {
                if (!this._exec("log", arguments)) {
                    dyCb.root.alert(Array.prototype.slice.call(arguments, 0).join(","));
                }
            }
        };
        /**
         * 断言失败时，会提示错误信息，但程序会继续执行下去
         * 使用断言捕捉不应该发生的非法情况。不要混淆非法情况与错误情况之间的区别，后者是必然存在的并且是一定要作出处理的。
         *
         * 1）对非预期错误使用断言
         断言中的布尔表达式的反面一定要描述一个非预期错误，下面所述的在一定情况下为非预期错误的一些例子：
         （1）空指针。
         （2）输入或者输出参数的值不在预期范围内。
         （3）数组的越界。
         非预期错误对应的就是预期错误，我们通常使用错误处理代码来处理预期错误，而使用断言处理非预期错误。在代码执行过程中，有些错误永远不应该发生，这样的错误是非预期错误。断言可以被看成是一种可执行的注释，你不能依赖它来让代码正常工作（《Code Complete 2》）。例如：
         int nRes = f(); // nRes 由 f 函数控制， f 函数保证返回值一定在 -100 ~ 100
         Assert(-100 <= nRes && nRes <= 100); // 断言，一个可执行的注释
         由于 f 函数保证了返回值处于 -100 ~ 100，那么如果出现了 nRes 不在这个范围的值时，就表明一个非预期错误的出现。后面会讲到“隔栏”，那时会对断言有更加深刻的理解。
         2）不要把需要执行的代码放入断言中
         断言用于软件的开发和维护，而通常不在发行版本中包含断言。
         需要执行的代码放入断言中是不正确的，因为在发行版本中，这些代码通常不会被执行，例如：
         Assert(f()); // f 函数通常在发行版本中不会被执行
         而使用如下方法则比较安全：
         res = f();
         Assert(res); // 安全
         3）对来源于内部系统的可靠的数据使用断言，而不要对外部不可靠的数据使用断言，对于外部不可靠数据，应该使用错误处理代码。
         再次强调，把断言看成可执行的注释。
         * @param cond 如果cond返回false，则断言失败，显示message
         * @param message
         */
        Log.assert = function (cond) {
            var message = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                message[_i - 1] = arguments[_i];
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
                /*!
                console.error will not interrupt, it will throw error and continue exec the left statements

                but here need interrupt! so not use it here.
                 */
                //if (!this._exec("error", arguments, 1)) {
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
            if (dyCb.root.console && dyCb.root.console[consoleMethod]) {
                dyCb.root.console[consoleMethod].apply(dyCb.root.console, Array.prototype.slice.call(args, sliceBegin));
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
                Array.prototype.slice.call(arguments, 0).forEach(function (val) {
                    result += String(val) + " ";
                });
                return result.slice(0, -1);
            },
            assertion: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (arguments.length === 2) {
                    return this.helperFunc(arguments[0], arguments[1]);
                }
                else if (arguments.length === 3) {
                    return this.helperFunc(arguments[1], arguments[0], arguments[2]);
                }
                else {
                    throw new Error("arguments.length must <= 3");
                }
            },
            FUNC_INVALID: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("invalid");
                return this.assertion.apply(this, arr);
            },
            FUNC_MUST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("must");
                return this.assertion.apply(this, arr);
            },
            FUNC_MUST_BE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("must be");
                return this.assertion.apply(this, arr);
            },
            FUNC_MUST_NOT_BE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("must not be");
                return this.assertion.apply(this, arr);
            },
            FUNC_SHOULD: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("should");
                return this.assertion.apply(this, arr);
            },
            FUNC_SHOULD_NOT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("should not");
                return this.assertion.apply(this, arr);
            },
            FUNC_SUPPORT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("support");
                return this.assertion.apply(this, arr);
            },
            FUNC_NOT_SUPPORT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("not support");
                return this.assertion.apply(this, arr);
            },
            FUNC_MUST_DEFINE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("must define");
                return this.assertion.apply(this, arr);
            },
            FUNC_MUST_NOT_DEFINE: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("must not define");
                return this.assertion.apply(this, arr);
            },
            FUNC_UNKNOW: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("unknow");
                return this.assertion.apply(this, arr);
            },
            FUNC_EXPECT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("expect");
                return this.assertion.apply(this, arr);
            },
            FUNC_UNEXPECT: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("unexpect");
                return this.assertion.apply(this, arr);
            },
            FUNC_NOT_EXIST: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var arr = Array.prototype.slice.call(arguments, 0);
                arr.unshift("not exist");
                return this.assertion.apply(this, arr);
            }
        };
        return Log;
    })();
    dyCb.Log = Log;
})(dyCb || (dyCb = {}));

/// <reference path="filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var List = (function () {
        function List() {
            this.children = null;
        }
        List.prototype.getCount = function () {
            return this.children.length;
        };
        List.prototype.hasChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0];
                return this._contain(this.children, function (c, i) {
                    return func(c, i);
                });
            }
            var child = arguments[0];
            return this._contain(this.children, function (c, i) {
                if (c === child
                    || (c.uid && child.uid && c.uid === child.uid)) {
                    return true;
                }
                else {
                    return false;
                }
            });
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
            if (dyCb.JudgeUtils.isArray(arg)) {
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
        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this.children.splice(index, 1);
        //}
        //
        List.prototype.toArray = function () {
            return this.children;
        };
        List.prototype.copyChildren = function () {
            return this.children.slice(0);
        };
        List.prototype.removeChildHelper = function (arg) {
            var result = null;
            if (dyCb.JudgeUtils.isFunction(arg)) {
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
        List.prototype._indexOf = function (arr, arg) {
            var result = -1;
            if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg;
                this._forEach(arr, function (value, index) {
                    if (!!func.call(null, value, index)) {
                        result = index;
                        return dyCb.$BREAK; //如果包含，则置返回值为true,跳出循环
                    }
                });
            }
            else {
                var val = arg;
                this._forEach(arr, function (value, index) {
                    if (val === value
                        || (value.contain && value.contain(val))
                        || (value.indexOf && value.indexOf(val) > -1)) {
                        result = index;
                        return dyCb.$BREAK; //如果包含，则置返回值为true,跳出循环
                    }
                });
            }
            return result;
        };
        List.prototype._contain = function (arr, arg) {
            return this._indexOf(arr, arg) > -1;
        };
        List.prototype._forEach = function (arr, func, context) {
            var scope = context || dyCb.root, i = 0, len = arr.length;
            for (i = 0; i < len; i++) {
                if (func.call(scope, arr[i], i) === dyCb.$BREAK) {
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
    dyCb.List = List;
})(dyCb || (dyCb = {}));

/// <reference path="filePath.d.ts"/>
var dyCb;
(function (dyCb) {
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
            var result = dyCb.Collection.create(), children = this._children, key = null;
            for (key in children) {
                if (children.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }
            return result;
        };
        Hash.prototype.getValues = function () {
            var result = dyCb.Collection.create(), children = this._children, key = null;
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
            if (this._children[key] instanceof dyCb.Collection) {
                var c = (this._children[key]);
                c.addChild(value);
            }
            else {
                this._children[key] = (dyCb.Collection.create().addChild(value));
            }
            return this;
        };
        Hash.prototype.removeChild = function (arg) {
            var result = [];
            if (dyCb.JudgeUtils.isString(arg)) {
                var key = arg;
                result.push(this._children[key]);
                this._children[key] = undefined;
                delete this._children[key];
            }
            else if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg, self_1 = this;
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        result.push(self_1._children[key]);
                        self_1._children[key] = undefined;
                        delete self_1._children[key];
                    }
                });
            }
            return dyCb.Collection.create(result);
        };
        Hash.prototype.removeAllChildren = function () {
            this._children = {};
        };
        Hash.prototype.hasChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0], result = false;
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        result = true;
                        return dyCb.$BREAK;
                    }
                });
                return result;
            }
            var key = arguments[0];
            return !!this._children[key];
        };
        Hash.prototype.forEach = function (func, context) {
            var i = null, children = this._children;
            for (i in children) {
                if (children.hasOwnProperty(i)) {
                    if (func.call(context, children[i], i) === dyCb.$BREAK) {
                        break;
                    }
                }
            }
            return this;
        };
        Hash.prototype.filter = function (func) {
            var result = {}, scope = this._children;
            this.forEach(function (val, key) {
                if (!func.call(scope, val, key)) {
                    return;
                }
                result[key] = val;
            });
            return Hash.create(result);
        };
        Hash.prototype.findOne = function (func) {
            var result = [], self = this, scope = this._children;
            this.forEach(function (val, key) {
                if (!func.call(scope, val, key)) {
                    return;
                }
                result = [key, self.getChild(key)];
                return dyCb.$BREAK;
            });
            return result;
        };
        Hash.prototype.map = function (func) {
            var resultMap = {};
            this.forEach(function (val, key) {
                var result = func(val, key);
                if (result !== dyCb.$REMOVE) {
                    dyCb.Log.error(!dyCb.JudgeUtils.isArray(result) || result.length !== 2, dyCb.Log.info.FUNC_MUST_BE("iterator", "[key, value]"));
                    resultMap[result[0]] = result[1];
                }
            });
            return Hash.create(resultMap);
        };
        Hash.prototype.toCollection = function () {
            var result = dyCb.Collection.create();
            this.forEach(function (val, key) {
                if (val instanceof dyCb.Collection) {
                    result.addChildren(val);
                }
                else if (val instanceof Hash) {
                    dyCb.Log.error(true, dyCb.Log.info.FUNC_NOT_SUPPORT("toCollection", "value is Hash"));
                }
                else {
                    result.addChild(val);
                }
            });
            return result;
        };
        return Hash;
    })();
    dyCb.Hash = Hash;
})(dyCb || (dyCb = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="Collection"/>
var dyCb;
(function (dyCb) {
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
    })(dyCb.List);
    dyCb.Queue = Queue;
})(dyCb || (dyCb = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="Collection"/>
var dyCb;
(function (dyCb) {
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
    })(dyCb.List);
    dyCb.Stack = Stack;
})(dyCb || (dyCb = {}));

var dyCb;
(function (dyCb) {
    var AjaxUtils = (function () {
        function AjaxUtils() {
        }
        /*!
         实现ajax

         ajax({
         type:"post",//post或者get，非必须
         url:"test.jsp",//必须的
         data:"name=dipoo&info=good",//非必须
         dataType:"json",//text/xml/json，非必须
         success:function(data){//回调函数，非必须
         alert(data.name);
         }
         });*/
        AjaxUtils.ajax = function (conf) {
            var type = conf.type; //type参数,可选
            var url = conf.url; //url参数，必填
            var data = conf.data; //data参数可选，只有在post请求时需要
            var dataType = conf.dataType; //datatype参数可选
            var success = conf.success; //回调函数可选
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
    dyCb.AjaxUtils = AjaxUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
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
            if (dyCb.JudgeUtils.isFunction(ele)) {
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
    dyCb.ArrayUtils = ArrayUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var ConvertUtils = (function () {
        function ConvertUtils() {
        }
        ConvertUtils.toString = function (obj) {
            if (dyCb.JudgeUtils.isNumber(obj)) {
                return String(obj);
            }
            //if (JudgeUtils.isjQuery(obj)) {
            //    return _jqToString(obj);
            //}
            if (dyCb.JudgeUtils.isFunction(obj)) {
                return this._convertCodeToString(obj);
            }
            if (dyCb.JudgeUtils.isDirectObject(obj) || dyCb.JudgeUtils.isArray(obj)) {
                return JSON.stringify(obj);
            }
            return String(obj);
        };
        ConvertUtils._convertCodeToString = function (fn) {
            return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
        };
        return ConvertUtils;
    })();
    dyCb.ConvertUtils = ConvertUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var EventUtils = (function () {
        function EventUtils() {
        }
        EventUtils.bindEvent = function (context, func) {
            //var args = Array.prototype.slice.call(arguments, 2),
            //    self = this;
            return function (event) {
                //return fun.apply(object, [self.wrapEvent(event)].concat(args)); //对事件对象进行包装
                return func.call(context, event);
            };
        };
        EventUtils.addEvent = function (dom, eventName, handler) {
            if (dyCb.JudgeUtils.isHostMethod(dom, "addEventListener")) {
                dom.addEventListener(eventName, handler, false);
            }
            else if (dyCb.JudgeUtils.isHostMethod(dom, "attachEvent")) {
                dom.attachEvent("on" + eventName, handler);
            }
            else {
                dom["on" + eventName] = handler;
            }
        };
        EventUtils.removeEvent = function (dom, eventName, handler) {
            if (dyCb.JudgeUtils.isHostMethod(dom, "removeEventListener")) {
                dom.removeEventListener(eventName, handler, false);
            }
            else if (dyCb.JudgeUtils.isHostMethod(dom, "detachEvent")) {
                dom.detachEvent("on" + eventName, handler);
            }
            else {
                dom["on" + eventName] = null;
            }
        };
        return EventUtils;
    })();
    dyCb.EventUtils = EventUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var ExtendUtils = (function () {
        function ExtendUtils() {
        }
        /**
         * 深拷贝
         *
         * 示例：
         * 如果拷贝对象为数组，能够成功拷贝（不拷贝Array原型链上的成员）
         * expect(extend.extendDeep([1, { x: 1, y: 1 }, "a", { x: 2 }, [2]])).toEqual([1, { x: 1, y: 1 }, "a", { x: 2 }, [2]]);
         *
         * 如果拷贝对象为对象，能够成功拷贝（能拷贝原型链上的成员）
         * var result = null;
         function A() {
                };
         A.prototype.a = 1;

         function B() {
                };
         B.prototype = new A();
         B.prototype.b = { x: 1, y: 1 };
         B.prototype.c = [{ x: 1 }, [2]];

         var t = new B();

         result = extend.extendDeep(t);

         expect(result).toEqual(
         {
             a: 1,
             b: { x: 1, y: 1 },
             c: [{ x: 1 }, [2]]
         });
         * @param parent
         * @param child
         * @returns
         */
        ExtendUtils.extendDeep = function (parent, child, filter) {
            if (filter === void 0) { filter = function (val, i) { return true; }; }
            var i = null, len = 0, toStr = Object.prototype.toString, sArr = "[object Array]", sOb = "[object Object]", type = "", _child = null;
            //数组的话，不获得Array原型上的成员。
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
        /**
         * 浅拷贝
         */
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
                    && !dyCb.JudgeUtils.isFunction(item);
            });
            return destination;
        };
        return ExtendUtils;
    })();
    dyCb.ExtendUtils = ExtendUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var SPLITPATH_REGEX = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    //reference from
    //https://github.com/cookfront/learn-note/blob/master/blog-backup/2014/nodejs-path.md
    var PathUtils = (function () {
        function PathUtils() {
        }
        PathUtils.basename = function (path, ext) {
            var f = this._splitPath(path)[2];
            // TODO: make this comparison case-insensitive on windows?
            if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
            }
            return f;
        };
        PathUtils.extname = function (path) {
            return this._splitPath(path)[3];
        };
        PathUtils.dirname = function (path) {
            var result = this._splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
                //no dirname whatsoever
                return '.';
            }
            if (dir) {
                //it has a dirname, strip trailing slash
                dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
        };
        PathUtils._splitPath = function (fileName) {
            return SPLITPATH_REGEX.exec(fileName).slice(1);
        };
        return PathUtils;
    })();
    dyCb.PathUtils = PathUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
    var DomQuery = (function () {
        function DomQuery() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this._doms = null;
            if (dyCb.JudgeUtils.isDom(args[0])) {
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
        DomQuery.prototype._isDomEleStr = function (eleStr) {
            return eleStr.match(/<(\w+)><\/\1>/) !== null;
        };
        DomQuery.prototype._buildDom = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (dyCb.JudgeUtils.isString(args[0])) {
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
    dyCb.DomQuery = DomQuery;
})(dyCb || (dyCb = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="filePath.d.ts"/>
var dyCb;
(function (dyCb) {
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
            return isDeep ? Collection.create(dyCb.ExtendUtils.extendDeep(this.children))
                : Collection.create(dyCb.ExtendUtils.extend([], this.children));
        };
        Collection.prototype.filter = function (func) {
            var scope = this.children, result = [];
            this.forEach(function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });
            return Collection.create(result);
        };
        Collection.prototype.findOne = function (func) {
            var scope = this.children, result = null;
            this.forEach(function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result = value;
                return dyCb.$BREAK;
            });
            return result;
        };
        Collection.prototype.reverse = function () {
            return Collection.create(this.copyChildren().reverse());
        };
        Collection.prototype.removeChild = function (arg) {
            return Collection.create(this.removeChildHelper(arg));
        };
        Collection.prototype.sort = function (func) {
            return Collection.create(this.copyChildren().sort(func));
        };
        Collection.prototype.map = function (func) {
            var resultArr = [];
            this.forEach(function (e, index) {
                var result = func(e, index);
                if (result !== dyCb.$REMOVE) {
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
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
    })(dyCb.List);
    dyCb.Collection = Collection;
})(dyCb || (dyCb = {}));

/// <reference path="../filePath.d.ts"/>
var dyCb;
(function (dyCb) {
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
    dyCb.FunctionUtils = FunctionUtils;
})(dyCb || (dyCb = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL0p1ZGdlVXRpbHMudHMiLCJnbG9iYWwvVmFyaWFibGUudHMiLCJnbG9iYWwvZXh0ZW5kLnRzIiwiZ2xvYmFsL0NvbnN0LnRzIiwiTG9nLnRzIiwiTGlzdC50cyIsIkhhc2gudHMiLCJRdWV1ZS50cyIsIlN0YWNrLnRzIiwidXRpbHMvQWpheFV0aWxzLnRzIiwidXRpbHMvQXJyYXlVdGlscy50cyIsInV0aWxzL0NvbnZlcnRVdGlscy50cyIsInV0aWxzL0V2ZW50VXRpbHMudHMiLCJ1dGlscy9FeHRlbmRVdGlscy50cyIsInV0aWxzL1BhdGhVdGlscy50cyIsInV0aWxzL0RvbVF1ZXJ5LnRzIiwiQ29sbGVjdGlvbi50cyIsInV0aWxzL0Z1bmN0aW9uVXRpbHMudHMiXSwibmFtZXMiOlsiZHlDYiIsImR5Q2IuSnVkZ2VVdGlscyIsImR5Q2IuSnVkZ2VVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuSnVkZ2VVdGlscy5pc0FycmF5IiwiZHlDYi5KdWRnZVV0aWxzLmlzRnVuY3Rpb24iLCJkeUNiLkp1ZGdlVXRpbHMuaXNOdW1iZXIiLCJkeUNiLkp1ZGdlVXRpbHMuaXNTdHJpbmciLCJkeUNiLkp1ZGdlVXRpbHMuaXNCb29sZWFuIiwiZHlDYi5KdWRnZVV0aWxzLmlzRG9tIiwiZHlDYi5KdWRnZVV0aWxzLmlzRGlyZWN0T2JqZWN0IiwiZHlDYi5KdWRnZVV0aWxzLmlzSG9zdE1ldGhvZCIsImR5Q2IuSnVkZ2VVdGlscy5pc05vZGVKcyIsImR5Q2IuTG9nIiwiZHlDYi5Mb2cuY29uc3RydWN0b3IiLCJkeUNiLkxvZy5sb2ciLCJkeUNiLkxvZy5hc3NlcnQiLCJkeUNiLkxvZy5lcnJvciIsImR5Q2IuTG9nLndhcm4iLCJkeUNiLkxvZy5fZXhlYyIsImR5Q2IuTGlzdCIsImR5Q2IuTGlzdC5jb25zdHJ1Y3RvciIsImR5Q2IuTGlzdC5nZXRDb3VudCIsImR5Q2IuTGlzdC5oYXNDaGlsZCIsImR5Q2IuTGlzdC5nZXRDaGlsZHJlbiIsImR5Q2IuTGlzdC5nZXRDaGlsZCIsImR5Q2IuTGlzdC5hZGRDaGlsZCIsImR5Q2IuTGlzdC5hZGRDaGlsZHJlbiIsImR5Q2IuTGlzdC51blNoaWZ0Q2hpbGQiLCJkeUNiLkxpc3QucmVtb3ZlQWxsQ2hpbGRyZW4iLCJkeUNiLkxpc3QuZm9yRWFjaCIsImR5Q2IuTGlzdC50b0FycmF5IiwiZHlDYi5MaXN0LmNvcHlDaGlsZHJlbiIsImR5Q2IuTGlzdC5yZW1vdmVDaGlsZEhlbHBlciIsImR5Q2IuTGlzdC5faW5kZXhPZiIsImR5Q2IuTGlzdC5fY29udGFpbiIsImR5Q2IuTGlzdC5fZm9yRWFjaCIsImR5Q2IuTGlzdC5fcmVtb3ZlQ2hpbGQiLCJkeUNiLkhhc2giLCJkeUNiLkhhc2guY29uc3RydWN0b3IiLCJkeUNiLkhhc2guY3JlYXRlIiwiZHlDYi5IYXNoLmdldENoaWxkcmVuIiwiZHlDYi5IYXNoLmdldENvdW50IiwiZHlDYi5IYXNoLmdldEtleXMiLCJkeUNiLkhhc2guZ2V0VmFsdWVzIiwiZHlDYi5IYXNoLmdldENoaWxkIiwiZHlDYi5IYXNoLnNldFZhbHVlIiwiZHlDYi5IYXNoLmFkZENoaWxkIiwiZHlDYi5IYXNoLmFkZENoaWxkcmVuIiwiZHlDYi5IYXNoLmFwcGVuZENoaWxkIiwiZHlDYi5IYXNoLnJlbW92ZUNoaWxkIiwiZHlDYi5IYXNoLnJlbW92ZUFsbENoaWxkcmVuIiwiZHlDYi5IYXNoLmhhc0NoaWxkIiwiZHlDYi5IYXNoLmZvckVhY2giLCJkeUNiLkhhc2guZmlsdGVyIiwiZHlDYi5IYXNoLmZpbmRPbmUiLCJkeUNiLkhhc2gubWFwIiwiZHlDYi5IYXNoLnRvQ29sbGVjdGlvbiIsImR5Q2IuUXVldWUiLCJkeUNiLlF1ZXVlLmNvbnN0cnVjdG9yIiwiZHlDYi5RdWV1ZS5jcmVhdGUiLCJkeUNiLlF1ZXVlLnB1c2giLCJkeUNiLlF1ZXVlLnBvcCIsImR5Q2IuUXVldWUuY2xlYXIiLCJkeUNiLlN0YWNrIiwiZHlDYi5TdGFjay5jb25zdHJ1Y3RvciIsImR5Q2IuU3RhY2suY3JlYXRlIiwiZHlDYi5TdGFjay5wdXNoIiwiZHlDYi5TdGFjay5wb3AiLCJkeUNiLlN0YWNrLmNsZWFyIiwiZHlDYi5BamF4VXRpbHMiLCJkeUNiLkFqYXhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQWpheFV0aWxzLmFqYXgiLCJkeUNiLkFqYXhVdGlscy5fY3JlYXRlQWpheCIsImR5Q2IuQWpheFV0aWxzLl9pc0xvY2FsRmlsZSIsImR5Q2IuQWpheFV0aWxzLl9pc1NvdW5kRmlsZSIsImR5Q2IuQXJyYXlVdGlscyIsImR5Q2IuQXJyYXlVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQXJyYXlVdGlscy5yZW1vdmVSZXBlYXRJdGVtcyIsImR5Q2IuQXJyYXlVdGlscy5jb250YWluIiwiZHlDYi5Db252ZXJ0VXRpbHMiLCJkeUNiLkNvbnZlcnRVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQ29udmVydFV0aWxzLnRvU3RyaW5nIiwiZHlDYi5Db252ZXJ0VXRpbHMuX2NvbnZlcnRDb2RlVG9TdHJpbmciLCJkeUNiLkV2ZW50VXRpbHMiLCJkeUNiLkV2ZW50VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV2ZW50VXRpbHMuYmluZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLmFkZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLnJlbW92ZUV2ZW50IiwiZHlDYi5FeHRlbmRVdGlscyIsImR5Q2IuRXh0ZW5kVXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZERlZXAiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZCIsImR5Q2IuRXh0ZW5kVXRpbHMuY29weVB1YmxpY0F0dHJpIiwiZHlDYi5QYXRoVXRpbHMiLCJkeUNiLlBhdGhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuUGF0aFV0aWxzLmJhc2VuYW1lIiwiZHlDYi5QYXRoVXRpbHMuZXh0bmFtZSIsImR5Q2IuUGF0aFV0aWxzLmRpcm5hbWUiLCJkeUNiLlBhdGhVdGlscy5fc3BsaXRQYXRoIiwiZHlDYi5Eb21RdWVyeSIsImR5Q2IuRG9tUXVlcnkuY29uc3RydWN0b3IiLCJkeUNiLkRvbVF1ZXJ5LmNyZWF0ZSIsImR5Q2IuRG9tUXVlcnkuZ2V0IiwiZHlDYi5Eb21RdWVyeS5wcmVwZW5kIiwiZHlDYi5Eb21RdWVyeS5wcmVwZW5kVG8iLCJkeUNiLkRvbVF1ZXJ5LnJlbW92ZSIsImR5Q2IuRG9tUXVlcnkuY3NzIiwiZHlDYi5Eb21RdWVyeS5faXNEb21FbGVTdHIiLCJkeUNiLkRvbVF1ZXJ5Ll9idWlsZERvbSIsImR5Q2IuRG9tUXVlcnkuX2NyZWF0ZUVsZW1lbnQiLCJkeUNiLkNvbGxlY3Rpb24iLCJkeUNiLkNvbGxlY3Rpb24uY29uc3RydWN0b3IiLCJkeUNiLkNvbGxlY3Rpb24uY3JlYXRlIiwiZHlDYi5Db2xsZWN0aW9uLmNvcHkiLCJkeUNiLkNvbGxlY3Rpb24uZmlsdGVyIiwiZHlDYi5Db2xsZWN0aW9uLmZpbmRPbmUiLCJkeUNiLkNvbGxlY3Rpb24ucmV2ZXJzZSIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5zb3J0IiwiZHlDYi5Db2xsZWN0aW9uLm1hcCIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVSZXBlYXRJdGVtcyIsImR5Q2IuRnVuY3Rpb25VdGlscyIsImR5Q2IuRnVuY3Rpb25VdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuRnVuY3Rpb25VdGlscy5iaW5kIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLElBQUksQ0FnRVY7QUFoRUQsV0FBTyxJQUFJLEVBQUMsQ0FBQztJQUdUQTtRQUFBQztRQTREQUMsQ0FBQ0E7UUEzRGlCRCxrQkFBT0EsR0FBckJBLFVBQXNCQSxHQUFHQTtZQUNyQkUsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsZ0JBQWdCQSxDQUFDQTtRQUNwRUEsQ0FBQ0E7UUFFYUYscUJBQVVBLEdBQXhCQSxVQUF5QkEsSUFBSUE7WUFDekJHLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENB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Q0EsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUdEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbENBLE1BQU1BLEdBQUdBLEtBQUtBLElBQUlBLEVBQUVBLENBQUNBO2dCQUVyQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO3dCQUN0QkEsUUFBUUEsQ0FBQ0E7b0JBQ2JBLENBQUNBO29CQUVEQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLElBQUlBLElBQUlBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsS0FBS0EsSUFBSUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0NBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FB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TEYsb0JBQUNBO0lBQURBLENBTkF6SCxBQU1DeUgsSUFBQXpIO0lBTllBLGtCQUFhQSxnQkFNekJBLENBQUFBO0FBQ0xBLENBQUNBLEVBUk0sSUFBSSxLQUFKLElBQUksUUFRViIsImZpbGUiOiJkeUNiLmRlYnVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGR5Q2Ige1xuICAgIGRlY2xhcmUgdmFyIGdsb2JhbDphbnksIG1vZHVsZTphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgSnVkZ2VVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheSh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOdW1iZXIob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdHIpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Jvb2xlYW4ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBCb29sZWFuXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RvbShvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKTmlq3mmK/lkKbkuLrlr7nosaHlrZfpnaLph4/vvIh7fe+8iVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RpcmVjdE9iamVjdChvYmopIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5qOA5p+l5a6/5Li75a+56LGh5piv5ZCm5Y+v6LCD55SoXG4gICAgICAgICAqXG4gICAgICAgICAqIOS7u+S9leWvueixoe+8jOWmguaenOWFtuivreS5ieWcqEVDTUFTY3JpcHTop4TojIPkuK3ooqvlrprkuYnov4fvvIzpgqPkuYjlroPooqvnp7DkuLrljp/nlJ/lr7nosaHvvJtcbiAgICAgICAgIOeOr+Wig+aJgOaPkOS+m+eahO+8jOiAjOWcqEVDTUFTY3JpcHTop4TojIPkuK3msqHmnInooqvmj4/ov7DnmoTlr7nosaHvvIzmiJHku6znp7DkuYvkuLrlrr/kuLvlr7nosaHjgIJcblxuICAgICAgICAg6K+l5pa55rOV55So5LqO54m55oCn5qOA5rWL77yM5Yik5pat5a+56LGh5piv5ZCm5Y+v55So44CC55So5rOV5aaC5LiL77yaXG5cbiAgICAgICAgIE15RW5naW5lIGFkZEV2ZW50KCk6XG4gICAgICAgICBpZiAoVG9vbC5qdWRnZS5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHsgICAgLy/liKTmlq1kb23mmK/lkKblhbfmnIlhZGRFdmVudExpc3RlbmVy5pa55rOVXG4gICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihzRXZlbnRUeXBlLCBmbkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNIb3N0TWV0aG9kKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iamVjdFtwcm9wZXJ0eV0pIHx8XG4gICAgICAgICAgICAgICAgdHlwZSA9PT0gXCJ1bmtub3duXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTm9kZUpzKCl7XG4gICAgICAgICAgICByZXR1cm4gKCh0eXBlb2YgZ2xvYmFsICE9IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLm1vZHVsZSkgfHwgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIikpICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2ZpbGVQYXRoLmQudHNcIi8+XG5cbm1vZHVsZSBkeUNie1xuICAgIGRlY2xhcmUgdmFyIGdsb2JhbDphbnksd2luZG93OmFueTtcblxuICAgIGV4cG9ydCB2YXIgcm9vdDphbnk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGR5Q2IsIFwicm9vdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzTm9kZUpzKCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIm1vZHVsZSBkeUNie1xuLy8gcGVyZm9ybWFuY2Uubm93IHBvbHlmaWxsXG5cbiAgICBpZiAoJ3BlcmZvcm1hbmNlJyBpbiByb290ID09PSBmYWxzZSkge1xuICAgICAgICByb290LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4vLyBJRSA4XG4gICAgRGF0ZS5ub3cgPSAoIERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0gKTtcblxuICAgIGlmICgnbm93JyBpbiByb290LnBlcmZvcm1hbmNlID09PSBmYWxzZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcgJiYgcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIHJvb3QucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBvZmZzZXQ7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibW9kdWxlIGR5Q2J7XG4gICAgZXhwb3J0IGNvbnN0ICRCUkVBSyA9IHtcbiAgICAgICAgYnJlYWs6dHJ1ZVxuICAgIH07XG4gICAgZXhwb3J0IGNvbnN0ICRSRU1PVkUgPSB2b2lkIDA7XG59XG5cblxuIiwibW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9BVFRSSUJVVEU6IFwiYWJzdHJhY3QgYXR0cmlidXRlIG5lZWQgb3ZlcnJpZGVcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX01FVEhPRDogXCJhYnN0cmFjdCBtZXRob2QgbmVlZCBvdmVycmlkZVwiLFxuXG4gICAgICAgICAgICBoZWxwZXJGdW5jOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nKHZhbCkgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2VydGlvbjogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudHMubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcImludmFsaWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJyKTsgICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBub3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwic2hvdWxkXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTERfTk9UOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJzaG91bGQgbm90XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwic3VwcG9ydFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJub3Qgc3VwcG9ydFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9ERUZJTkU6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0IGRlZmluZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBub3QgZGVmaW5lXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJ1bmtub3dcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX0VYUEVDVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcImV4cGVjdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJ1bmV4cGVjdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX0VYSVNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibm90IGV4aXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKC4uLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLl9leGVjKFwidHJhY2VcIiwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSkpe1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLl9leGVjKFwibG9nXCIsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9vdC5hbGVydChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5pat6KiA5aSx6LSl5pe277yM5Lya5o+Q56S66ZSZ6K+v5L+h5oGv77yM5L2G56iL5bqP5Lya57un57ut5omn6KGM5LiL5Y67XG4gICAgICAgICAqIOS9v+eUqOaWreiogOaNleaNieS4jeW6lOivpeWPkeeUn+eahOmdnuazleaDheWGteOAguS4jeimgea3t+a3humdnuazleaDheWGteS4jumUmeivr+aDheWGteS5i+mXtOeahOWMuuWIq++8jOWQjuiAheaYr+W/heeEtuWtmOWcqOeahOW5tuS4lOaYr+S4gOWumuimgeS9nOWHuuWkhOeQhueahOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiAx77yJ5a+56Z2e6aKE5pyf6ZSZ6K+v5L2/55So5pat6KiAXG4gICAgICAgICDmlq3oqIDkuK3nmoTluIPlsJTooajovr7lvI/nmoTlj43pnaLkuIDlrpropoHmj4/ov7DkuIDkuKrpnZ7pooTmnJ/plJnor6/vvIzkuIvpnaLmiYDov7DnmoTlnKjkuIDlrprmg4XlhrXkuIvkuLrpnZ7pooTmnJ/plJnor6/nmoTkuIDkupvkvovlrZDvvJpcbiAgICAgICAgIO+8iDHvvInnqbrmjIfpkojjgIJcbiAgICAgICAgIO+8iDLvvInovpPlhaXmiJbogIXovpPlh7rlj4LmlbDnmoTlgLzkuI3lnKjpooTmnJ/ojIPlm7TlhoXjgIJcbiAgICAgICAgIO+8iDPvvInmlbDnu4TnmoTotornlYzjgIJcbiAgICAgICAgIOmdnumihOacn+mUmeivr+WvueW6lOeahOWwseaYr+mihOacn+mUmeivr++8jOaIkeS7rOmAmuW4uOS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeadpeWkhOeQhumihOacn+mUmeivr++8jOiAjOS9v+eUqOaWreiogOWkhOeQhumdnumihOacn+mUmeivr+OAguWcqOS7o+eggeaJp+ihjOi/h+eoi+S4re+8jOacieS6m+mUmeivr+awuOi/nOS4jeW6lOivpeWPkeeUn++8jOi/meagt+eahOmUmeivr+aYr+mdnumihOacn+mUmeivr+OAguaWreiogOWPr+S7peiiq+eci+aIkOaYr+S4gOenjeWPr+aJp+ihjOeahOazqOmHiu+8jOS9oOS4jeiDveS+nei1luWug+adpeiuqeS7o+eggeato+W4uOW3peS9nO+8iOOAikNvZGUgQ29tcGxldGUgMuOAi++8ieOAguS+i+Wmgu+8mlxuICAgICAgICAgaW50IG5SZXMgPSBmKCk7IC8vIG5SZXMg55SxIGYg5Ye95pWw5o6n5Yi277yMIGYg5Ye95pWw5L+d6K+B6L+U5Zue5YC85LiA5a6a5ZyoIC0xMDAgfiAxMDBcbiAgICAgICAgIEFzc2VydCgtMTAwIDw9IG5SZXMgJiYgblJlcyA8PSAxMDApOyAvLyDmlq3oqIDvvIzkuIDkuKrlj6/miafooYznmoTms6jph4pcbiAgICAgICAgIOeUseS6jiBmIOWHveaVsOS/neivgeS6hui/lOWbnuWAvOWkhOS6jiAtMTAwIH4gMTAw77yM6YKj5LmI5aaC5p6c5Ye6546w5LqGIG5SZXMg5LiN5Zyo6L+Z5Liq6IyD5Zu055qE5YC85pe277yM5bCx6KGo5piO5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v55qE5Ye6546w44CC5ZCO6Z2i5Lya6K6y5Yiw4oCc6ZqU5qCP4oCd77yM6YKj5pe25Lya5a+55pat6KiA5pyJ5pu05Yqg5rex5Yi755qE55CG6Kej44CCXG4gICAgICAgICAy77yJ5LiN6KaB5oqK6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5LitXG4gICAgICAgICDmlq3oqIDnlKjkuo7ova/ku7bnmoTlvIDlj5Hlkoznu7TmiqTvvIzogIzpgJrluLjkuI3lnKjlj5HooYzniYjmnKzkuK3ljIXlkKvmlq3oqIDjgIJcbiAgICAgICAgIOmcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4reaYr+S4jeato+ehrueahO+8jOWboOS4uuWcqOWPkeihjOeJiOacrOS4re+8jOi/meS6m+S7o+eggemAmuW4uOS4jeS8muiiq+aJp+ihjO+8jOS+i+Wmgu+8mlxuICAgICAgICAgQXNzZXJ0KGYoKSk7IC8vIGYg5Ye95pWw6YCa5bi45Zyo5Y+R6KGM54mI5pys5Lit5LiN5Lya6KKr5omn6KGMXG4gICAgICAgICDogIzkvb/nlKjlpoLkuIvmlrnms5XliJnmr5TovoPlronlhajvvJpcbiAgICAgICAgIHJlcyA9IGYoKTtcbiAgICAgICAgIEFzc2VydChyZXMpOyAvLyDlronlhahcbiAgICAgICAgIDPvvInlr7nmnaXmupDkuo7lhoXpg6jns7vnu5/nmoTlj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzogIzkuI3opoHlr7nlpJbpg6jkuI3lj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzlr7nkuo7lpJbpg6jkuI3lj6/pnaDmlbDmja7vvIzlupTor6Xkvb/nlKjplJnor6/lpITnkIbku6PnoIHjgIJcbiAgICAgICAgIOWGjeasoeW8uuiwg++8jOaKiuaWreiogOeci+aIkOWPr+aJp+ihjOeahOazqOmHiuOAglxuICAgICAgICAgKiBAcGFyYW0gY29uZCDlpoLmnpxjb25k6L+U5ZueZmFsc2XvvIzliJnmlq3oqIDlpLHotKXvvIzmmL7npLptZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFzc2VydChjb25kLCAuLi5tZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAoY29uZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZXhlYyhcImFzc2VydFwiLCBhcmd1bWVudHMsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgLi4ubWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgLyohXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciB3aWxsIG5vdCBpbnRlcnJ1cHQsIGl0IHdpbGwgdGhyb3cgZXJyb3IgYW5kIGNvbnRpbnVlIGV4ZWMgdGhlIGxlZnQgc3RhdGVtZW50c1xuXG4gICAgICAgICAgICAgICAgYnV0IGhlcmUgbmVlZCBpbnRlcnJ1cHQhIHNvIG5vdCB1c2UgaXQgaGVyZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL2lmICghdGhpcy5fZXhlYyhcImVycm9yXCIsIGFyZ3VtZW50cywgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuam9pbihcIlxcblwiKSk7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhcm4oLi4ubWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2V4ZWMoXCJ3YXJuXCIsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlYyhcInRyYWNlXCIsIFtcIndhcm4gdHJhY2VcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2V4ZWMoY29uc29sZU1ldGhvZCwgYXJncywgc2xpY2VCZWdpbiA9IDApIHtcbiAgICAgICAgICAgIGlmIChyb290LmNvbnNvbGUgJiYgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5jb25zb2xlW2NvbnNvbGVNZXRob2RdLmFwcGx5KHJvb3QuY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VCZWdpbikpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJmaWxlUGF0aC5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzpGdW5jdGlvbnxUKTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhjLCBpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkID0gPGFueT5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHx8IChjLnVpZCAmJiBjaGlsZC51aWQgJiYgYy51aWQgPT09IGNoaWxkLnVpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6VCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOkFycmF5PFQ+fExpc3Q8VD58YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46QXJyYXk8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBMaXN0KXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46TGlzdDxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZDphbnkgPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdW5TaGlmdENoaWxkKGNoaWxkOlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2godGhpcy5jaGlsZHJlbiwgZnVuYywgY29udGV4dCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuXG4gICAgICAgIHB1YmxpYyB0b0FycmF5KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjb3B5Q2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNsaWNlKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlbW92ZUNoaWxkSGVscGVyKGFyZzphbnkpOkFycmF5PFQ+IHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCBmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFyZy51aWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID09PSBhcmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgX2luZGV4T2YoYXJyOmFueVtdLCBhcmc6YW55KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIWZ1bmMuY2FsbChudWxsLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7ICAgLy/lpoLmnpzljIXlkKvvvIzliJnnva7ov5Tlm57lgLzkuLp0cnVlLOi3s+WHuuW+queOr1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gPGFueT5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHZhbHVlLmNvbnRhaW4gJiYgdmFsdWUuY29udGFpbih2YWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHZhbHVlLmluZGV4T2YgJiYgdmFsdWUuaW5kZXhPZih2YWwpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7ICAgLy/lpoLmnpzljIXlkKvvvIzliJnnva7ov5Tlm57lgLzkuLp0cnVlLOi3s+WHuuW+queOr1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jb250YWluKGFycjpUW10sIGFyZzphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleE9mKGFyciwgYXJnKSA+IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9yRWFjaChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGNvbnRleHQgfHwgcm9vdCxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlQ2hpbGQoYXJyOlRbXSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICByZW1vdmVkRWxlbWVudEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHJlbWFpbkVsZW1lbnRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCEhZnVuYy5jYWxsKHNlbGYsIGUpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEVsZW1lbnRBcnIucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmVtYWluRWxlbWVudEFyci5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gcmVtYWluRWxlbWVudEFycjtcblxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRFbGVtZW50QXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZmlsZVBhdGguZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWVzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGNoaWxkcmVuW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChrZXk6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShrZXk6c3RyaW5nLCB2YWx1ZTphbnkpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOnt9fEhhc2g8VD4pe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYoYXJnIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmcuZ2V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihpIGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaSwgY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNlbGYuX2NoaWxkcmVuW2tleV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGQoYXJnOmFueSk6Ym9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmd1bWVudHNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSl7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWZ1bmMuY2FsbChzY29wZSwgdmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbmRPbmUoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWZ1bmMuY2FsbChzY29wZSwgdmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtrZXksIHNlbGYuZ2V0Q2hpbGQoa2V5KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0NvbGxlY3Rpb24oKTogQ29sbGVjdGlvbjxhbnk+e1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IENvbGxlY3Rpb24uY3JlYXRlPGFueT4oKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodmFsIGluc3RhbmNlb2YgQ29sbGVjdGlvbil7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZHJlbih2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbCBpbnN0YW5jZW9mIEhhc2gpe1xuICAgICAgICAgICAgICAgICAgICBMb2cuZXJyb3IodHJ1ZSwgTG9nLmluZm8uRlVOQ19OT1RfU1VQUE9SVChcInRvQ29sbGVjdGlvblwiLCBcInZhbHVlIGlzIEhhc2hcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29sbGVjdGlvblwiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgUXVldWU8VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHVzaChlbGVtZW50OlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHBvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKXtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb2xsZWN0aW9uXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBTdGFjazxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIGR5Q2J7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIEFqYXhVdGlsc3tcbiAgICAgICAgLyohXG4gICAgICAgICDlrp7njrBhamF4XG5cbiAgICAgICAgIGFqYXgoe1xuICAgICAgICAgdHlwZTpcInBvc3RcIiwvL3Bvc3TmiJbogIVnZXTvvIzpnZ7lv4XpobtcbiAgICAgICAgIHVybDpcInRlc3QuanNwXCIsLy/lv4XpobvnmoRcbiAgICAgICAgIGRhdGE6XCJuYW1lPWRpcG9vJmluZm89Z29vZFwiLC8v6Z2e5b+F6aG7XG4gICAgICAgICBkYXRhVHlwZTpcImpzb25cIiwvL3RleHQveG1sL2pzb27vvIzpnZ7lv4XpobtcbiAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7Ly/lm57osIPlh73mlbDvvIzpnZ7lv4XpobtcbiAgICAgICAgIGFsZXJ0KGRhdGEubmFtZSk7XG4gICAgICAgICB9XG4gICAgICAgICB9KTsqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFqYXgoY29uZil7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNvbmYudHlwZTsvL3R5cGXlj4LmlbAs5Y+v6YCJXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZi51cmw7Ly91cmzlj4LmlbDvvIzlv4XloatcbiAgICAgICAgICAgIHZhciBkYXRhID0gY29uZi5kYXRhOy8vZGF0YeWPguaVsOWPr+mAie+8jOWPquacieWcqHBvc3Tor7fmsYLml7bpnIDopoFcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IGNvbmYuZGF0YVR5cGU7Ly9kYXRhdHlwZeWPguaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjb25mLnN1Y2Nlc3M7Ly/lm57osIPlh73mlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNvbmYuZXJyb3I7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHsvL3R5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLpnZXRcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJnZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gbnVsbCkgey8vZGF0YVR5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLp0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyID0gdGhpcy5fY3JlYXRlQWpheChlcnJvcik7XG4gICAgICAgICAgICBpZiAoIXhocikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkdFVFwiIHx8IHR5cGUgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwiUE9TVFwiIHx8IHR5cGUgPT09IFwicG9zdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenGFqYXjorr/pl67nmoTmmK/mnKzlnLDmlofku7bvvIzliJlzdGF0dXPkuLowXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHNlbGYuX2lzTG9jYWxGaWxlKHhoci5zdGF0dXMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBcInRleHRcIiB8fCBkYXRhVHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5pmu6YCa5paH5pysXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwieG1sXCIgfHwgZGF0YVR5cGUgPT09IFwiWE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5o6l5pS2eG1s5paH5qGjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJqc29uXCIgfHwgZGF0YVR5cGUgPT09IFwiSlNPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGV2YWwoXCIoXCIgKyB4aHIucmVzcG9uc2VUZXh0ICsgXCIpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZUFqYXgoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHsvL0lF57O75YiX5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJtaWNyb3NvZnQueG1saHR0cFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsvL+mdnklF5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHhociwge21lc3NhZ2U6IFwi5oKo55qE5rWP6KeI5Zmo5LiN5pSv5oyBYWpheO+8jOivt+abtOaNou+8gVwifSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNMb2NhbEZpbGUoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuVVJMLmNvbnRhaW4oXCJmaWxlOi8vXCIpICYmIHN0YXR1cyA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc1NvdW5kRmlsZShkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZmlsZVBhdGguZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgQXJyYXlVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlUmVwZWF0SXRlbXMoYXJyOkFycmF5PGFueT4sIGlzRXF1YWw6KGE6YW55LCBiOmFueSkgPT4gYm9vbGVhbiA9IChhLCBiKT0+IHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgICB9KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb250YWluKHJlc3VsdEFyciwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzRXF1YWwodmFsLCBlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0QXJyLnB1c2goZWxlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0QXJyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250YWluKGFycjpBcnJheTxhbnk+LCBlbGU6YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGVsZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYzpGdW5jdGlvbiA9IGVsZTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFmdW5jLmNhbGwobnVsbCwgdmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlID09PSB2YWx1ZSB8fCAodmFsdWUuY29udGFpbiAmJiB2YWx1ZS5jb250YWluKGVsZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2ZpbGVQYXRoLmQudHNcIi8+XG5tb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2ZpbGVQYXRoLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmRFdmVudChjb250ZXh0LCBmdW5jKSB7XG4gICAgICAgICAgICAvL3ZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIC8vICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZnVuLmFwcGx5KG9iamVjdCwgW3NlbGYud3JhcEV2ZW50KGV2ZW50KV0uY29uY2F0KGFyZ3MpKTsgLy/lr7nkuovku7blr7nosaHov5vooYzljIXoo4VcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImF0dGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJkZXRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2ZpbGVQYXRoLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuZFV0aWxzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3seaLt+i0nVxuICAgICAgICAgKlxuICAgICAgICAgKiDnpLrkvovvvJpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65pWw57uE77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI5LiN5ou36LSdQXJyYXnljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogZXhwZWN0KGV4dGVuZC5leHRlbmREZWVwKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKSkudG9FcXVhbChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSk7XG4gICAgICAgICAqXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuWvueixoe+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOiDveaLt+i0neWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgIGZ1bmN0aW9uIEEoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBBLnByb3RvdHlwZS5hID0gMTtcblxuICAgICAgICAgZnVuY3Rpb24gQigpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEIucHJvdG90eXBlID0gbmV3IEEoKTtcbiAgICAgICAgIEIucHJvdG90eXBlLmIgPSB7IHg6IDEsIHk6IDEgfTtcbiAgICAgICAgIEIucHJvdG90eXBlLmMgPSBbeyB4OiAxIH0sIFsyXV07XG5cbiAgICAgICAgIHZhciB0ID0gbmV3IEIoKTtcblxuICAgICAgICAgcmVzdWx0ID0gZXh0ZW5kLmV4dGVuZERlZXAodCk7XG5cbiAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG4gICAgICAgICB7XG4gICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICBiOiB7IHg6IDEsIHk6IDEgfSxcbiAgICAgICAgICAgICBjOiBbeyB4OiAxIH0sIFsyXV1cbiAgICAgICAgIH0pO1xuICAgICAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAgICAgKiBAcmV0dXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmREZWVwKHBhcmVudCwgY2hpbGQ/LGZpbHRlcj1mdW5jdGlvbih2YWwsIGkpe3JldHVybiB0cnVlO30pIHtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBsZW4gPSAwLFxuICAgICAgICAgICAgICAgIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBzQXJyID0gXCJbb2JqZWN0IEFycmF5XVwiLFxuICAgICAgICAgICAgICAgIHNPYiA9IFwiW29iamVjdCBPYmplY3RdXCIsXG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiXCIsXG4gICAgICAgICAgICAgICAgX2NoaWxkID0gbnVsbDtcblxuICAgICAgICAgICAgLy/mlbDnu4TnmoTor53vvIzkuI3ojrflvpdBcnJheeWOn+Wei+S4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc0Fycikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcGFyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a+56LGh55qE6K+d77yM6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CC5Zug5Li66ICD6JmR5Lul5LiL5oOF5pmv77yaXG4gICAgICAgICAgICAvL+exu0Hnu6fmib/kuo7nsbtC77yM546w5Zyo5oOz6KaB5ou36LSd57G7QeeahOWunuS+i2HnmoTmiJDlkZjvvIjljIXmi6zku47nsbtC57un5om/5p2l55qE5oiQ5ZGY77yJ77yM6YKj5LmI5bCx6ZyA6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBlbHNlIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNPYikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWF5ou36LSdXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29weVB1YmxpY0F0dHJpKHNvdXJjZTphbnkpe1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZERlZXAoc291cmNlLCBkZXN0aW5hdGlvbiwgZnVuY3Rpb24oaXRlbSwgcHJvcGVydHkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5zbGljZSgwLCAxKSAhPT0gXCJfXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgIUp1ZGdlVXRpbHMuaXNGdW5jdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9maWxlUGF0aC5kLnRzXCIvPlxubW9kdWxlIGR5Q2J7XG4gICAgdmFyIFNQTElUUEFUSF9SRUdFWCA9XG4gICAgICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xuXG4gICAgLy9yZWZlcmVuY2UgZnJvbVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2Nvb2tmcm9udC9sZWFybi1ub3RlL2Jsb2IvbWFzdGVyL2Jsb2ctYmFja3VwLzIwMTQvbm9kZWpzLXBhdGgubWRcbiAgICBleHBvcnQgY2xhc3MgUGF0aFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2VuYW1lKHBhdGg6c3RyaW5nLCBleHQ/OnN0cmluZyl7XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKVsyXTtcbiAgICAgICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgICAgICAgICAgIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgICAgICAgICAgICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZjtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRuYW1lKHBhdGg6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGxpdFBhdGgocGF0aClbM107XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGRpcm5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3NwbGl0UGF0aChwYXRoKSxcbiAgICAgICAgICAgICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgICAgICAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICAgICAgICAgICAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAgICAgICAgICAgICAvL25vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgICAgICAgICAgICAgIHJldHVybiAnLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICAgICAgICAvL2l0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgICAgICAgICAgICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByb290ICsgZGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3NwbGl0UGF0aChmaWxlTmFtZTpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIFNQTElUUEFUSF9SRUdFWC5leGVjKGZpbGVOYW1lKS5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9maWxlUGF0aC5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBEb21RdWVyeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhhcmdzWzBdKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6QXJyYXk8SFRNTEVsZW1lbnQ+ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgY29uc3RydWN0b3IoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RvbShhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbYXJnc1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2lzRG9tRWxlU3RyKGFyZ3NbMF0pKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW3RoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3NbMF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIHRhcmdldERvbTpIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRhcmdldERvbSA9IHRoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLmluc2VydEJlZm9yZSh0YXJnZXREb20sIGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHByZXBlbmRUbyhlbGVTdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RG9tOkRvbVF1ZXJ5ID0gbnVsbDtcblxuICAgICAgICAgICAgdGFyZ2V0RG9tID0gRG9tUXVlcnkuY3JlYXRlKGVsZVN0cik7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXREb20ucHJlcGVuZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tICYmIGRvbS5wYXJlbnROb2RlICYmIGRvbS50YWdOYW1lICE9ICdCT0RZJykge1xuICAgICAgICAgICAgICAgICAgICBkb20ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3NzKHByb3BlcnR5OnN0cmluZywgdmFsdWU6c3RyaW5nKXtcbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgZG9tLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaXNEb21FbGVTdHIoZWxlU3RyOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gZWxlU3RyLm1hdGNoKC88KFxcdyspPjxcXC9cXDE+LykgIT09IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9idWlsZERvbShlbGVTdHI6c3RyaW5nKTpIVE1MRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oZG9tOkhUTUxIdG1sRWxlbWVudCk6SFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oLi4uYXJncyk6SFRNTEVsZW1lbnQge1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmdzWzBdKSl7XG4gICAgICAgICAgICAgICAgbGV0IGRpdiA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICAgICAgICAgIGVsZVN0cjpzdHJpbmcgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGVsZVN0cjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jcmVhdGVFbGVtZW50KGVsZVN0cil7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVTdHIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZmlsZVBhdGguZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgQ29sbGVjdGlvbjxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjb3B5IChpc0RlZXA6Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNEZWVwID8gQ29sbGVjdGlvbi5jcmVhdGU8VD4oRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcCh0aGlzLmNoaWxkcmVuKSlcbiAgICAgICAgICAgICAgICA6IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZChbXSwgdGhpcy5jaGlsZHJlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbHRlcihmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGJvb2xlYW4pOkNvbGxlY3Rpb248VD4ge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5jaGlsZHJlbixcbiAgICAgICAgICAgICAgICByZXN1bHQ6QXJyYXk8VD4gPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbmRPbmUoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKXtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0OlQgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbHVlOlQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmdW5jLmNhbGwoc2NvcGUsIHZhbHVlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZXZlcnNlICgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPih0aGlzLmNvcHlDaGlsZHJlbigpLnJldmVyc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5yZW1vdmVDaGlsZEhlbHBlcihhcmcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzb3J0KGZ1bmM6KGE6VCwgYjpUKSA9PiBhbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYW55KXtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZSAmJiBlW2hhbmRsZXJOYW1lXSAmJiBlW2hhbmRsZXJOYW1lXS5hcHBseShjb250ZXh0IHx8IGUsIHZhbHVlQXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8YW55PihyZXN1bHRBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZVJlcGVhdEl0ZW1zKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TGlzdCA9ICBDb2xsZWN0aW9uLmNyZWF0ZTxUPigpO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGl0ZW06VCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRMaXN0Lmhhc0NoaWxkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRMaXN0LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRMaXN0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2ZpbGVQYXRoLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmQob2JqZWN0OmFueSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShvYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9