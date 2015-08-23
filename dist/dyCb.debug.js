var dyCb;
(function (dyCb) {
    if ('performance' in window === false) {
        window.performance = {};
    }
    // IE 8
    Date.now = (Date.now || function () {
        return new Date().getTime();
    });
    if ('now' in window.performance === false) {
        var offset = window.performance.timing && window.performance.timing.navigationStart ? performance.timing.navigationStart
            : Date.now();
        window.performance.now = function () {
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
        Log.log = function (message) {
            if (window.console && window.console.trace) {
                window.console.trace(message);
            }
            else if (window.console && window.console.log) {
                window.console.log(message);
            }
            else {
                alert(message);
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
        Log.assert = function (cond, message) {
            if (window.console.assert) {
                window.console.assert(cond, message);
            }
            else {
                if (!cond && message) {
                    if (window.console && window.console.log) {
                        window.console.log(message);
                    }
                    else {
                        alert(message);
                    }
                }
            }
        };
        Log.error = function (cond, message) {
            if (cond) {
                throw new Error(message);
            }
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
            FUNC_INVALID: function (value) {
                return this.assertion("invalid", value);
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
            FUNC_SUPPORT: function (value) {
                return this.assertion("support", value);
            },
            FUNC_NOT_SUPPORT: function (value) {
                return this.assertion("not support", value);
            },
            FUNC_MUST_DEFINE: function (value) {
                return this.assertion("must define", value);
            },
            FUNC_MUST_NOT_DEFINE: function (value) {
                return this.assertion("must not define", value);
            },
            FUNC_UNKNOW: function (value) {
                return this.assertion("unknow", value);
            },
            FUNC_EXPECT: function (value) {
                return this.assertion("expect", value);
            },
            FUNC_UNEXPECT: function (value) {
                return this.assertion("unexpected", value);
            }
        };
        return Log;
    })();
    dyCb.Log = Log;
})(dyCb || (dyCb = {}));

/// <reference path="definitions.d.ts"/>
var dyCb;
(function (dyCb) {
    //todo remain common "forEach,filter,map..." methods
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
        List.prototype.removeChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg;
                this._removeChild(this.children, func);
            }
            else if (arg.uid) {
                this._removeChild(this.children, function (e) {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                this._removeChild(this.children, function (e) {
                    return e === arg;
                });
            }
            return this;
        };
        List.prototype.toArray = function () {
            return this.children;
        };
        List.prototype.copyChildren = function () {
            return this.children.slice(0);
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
            var scope = context || window, i = 0, len = arr.length;
            for (i = 0; i < len; i++) {
                if (func.call(scope, arr[i], i) === dyCb.$BREAK) {
                    break;
                }
            }
        };
        List.prototype._removeChild = function (arr, func) {
            var self = this, index = null;
            index = this._indexOf(arr, function (e, index) {
                return !!func.call(self, e);
            });
            //if (index !== null && index !== -1) {
            if (index !== -1) {
                arr.splice(index, 1);
            }
            //return false;
            return arr;
        };
        return List;
    })();
    dyCb.List = List;
})(dyCb || (dyCb = {}));

/// <reference path="definitions.d.ts"/>
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
        Hash.prototype.getChild = function (key) {
            return this._children[key];
        };
        Hash.prototype.setValue = function (key, value) {
            this._children[key] = value;
        };
        Hash.prototype.addChild = function (key, value) {
            this._children[key] = value;
            return this;
        };
        Hash.prototype.appendChild = function (key, value) {
            //if (JudgeUtils.isArray(this._children[key])) {
            //    this._children[key].push(value);
            //}
            //else {
            //    this._children[key] = [value];
            //}
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
            if (dyCb.JudgeUtils.isString(arg)) {
                var key = arg;
                this._children[key] = undefined;
                delete this._children[key];
            }
            else if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg, self_1 = this;
                //return this._removeChild(this._children, arg);
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        self_1._children[key] = undefined;
                        delete self_1._children[key];
                    }
                });
            }
            return this;
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
        return Hash;
    })();
    dyCb.Hash = Hash;
})(dyCb || (dyCb = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
        return JudgeUtils;
    })();
    dyCb.JudgeUtils = JudgeUtils;
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

/// <reference path="../definitions.d.ts"/>
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

/// <reference path="../definitions.d.ts"/>
var dyCb;
(function (dyCb) {
    //declare var window:any;
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

/// <reference path="../definitions.d.ts"/>
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

/// <reference path="../definitions.d.ts"/>
var dyCb;
(function (dyCb) {
    var SPLITPATH_REGEX = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    //todo refer to https://github.com/cookfront/learn-note/blob/master/blog-backup/2014/nodejs-path.md
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
        PathUtils._splitPath = function (fileName) {
            return SPLITPATH_REGEX.exec(fileName).slice(1);
        };
        return PathUtils;
    })();
    dyCb.PathUtils = PathUtils;
})(dyCb || (dyCb = {}));

/// <reference path="../definitions.d.ts"/>
var dyCb;
(function (dyCb) {
    var DomQuery = (function () {
        function DomQuery(domStr) {
            this._doms = null;
            if (dyCb.JudgeUtils.isDom(arguments[0])) {
                this._doms = [arguments[0]];
            }
            else {
                this._doms = document.querySelectorAll(domStr);
            }
            return this;
        }
        DomQuery.create = function (domStr) {
            var obj = new this(domStr);
            return obj;
        };
        DomQuery.prototype.get = function (index) {
            return this._doms[index];
        };
        return DomQuery;
    })();
    dyCb.DomQuery = DomQuery;
})(dyCb || (dyCb = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="definitions.d.ts"/>
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
        Collection.prototype.reverse = function () {
            return Collection.create(this.copyChildren().reverse());
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
        return Collection;
    })(dyCb.List);
    dyCb.Collection = Collection;
})(dyCb || (dyCb = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC93aW5kb3cudHMiLCJnbG9iYWwvQ29uc3QudHMiLCJMb2cudHMiLCJMaXN0LnRzIiwiSGFzaC50cyIsIlF1ZXVlLnRzIiwiU3RhY2sudHMiLCJ1dGlscy9KdWRnZVV0aWxzLnRzIiwidXRpbHMvQWpheFV0aWxzLnRzIiwidXRpbHMvQ29udmVydFV0aWxzLnRzIiwidXRpbHMvRXZlbnRVdGlscy50cyIsInV0aWxzL0V4dGVuZFV0aWxzLnRzIiwidXRpbHMvUGF0aFV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiLCJDb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbImR5Q2IiLCJkeUNiLkxvZyIsImR5Q2IuTG9nLmNvbnN0cnVjdG9yIiwiZHlDYi5Mb2cubG9nIiwiZHlDYi5Mb2cuYXNzZXJ0IiwiZHlDYi5Mb2cuZXJyb3IiLCJkeUNiLkxpc3QiLCJkeUNiLkxpc3QuY29uc3RydWN0b3IiLCJkeUNiLkxpc3QuZ2V0Q291bnQiLCJkeUNiLkxpc3QuaGFzQ2hpbGQiLCJkeUNiLkxpc3QuZ2V0Q2hpbGRyZW4iLCJkeUNiLkxpc3QuZ2V0Q2hpbGQiLCJkeUNiLkxpc3QuYWRkQ2hpbGQiLCJkeUNiLkxpc3QuYWRkQ2hpbGRyZW4iLCJkeUNiLkxpc3QucmVtb3ZlQWxsQ2hpbGRyZW4iLCJkeUNiLkxpc3QuZm9yRWFjaCIsImR5Q2IuTGlzdC5yZW1vdmVDaGlsZCIsImR5Q2IuTGlzdC50b0FycmF5IiwiZHlDYi5MaXN0LmNvcHlDaGlsZHJlbiIsImR5Q2IuTGlzdC5faW5kZXhPZiIsImR5Q2IuTGlzdC5fY29udGFpbiIsImR5Q2IuTGlzdC5fZm9yRWFjaCIsImR5Q2IuTGlzdC5fcmVtb3ZlQ2hpbGQiLCJkeUNiLkhhc2giLCJkeUNiLkhhc2guY29uc3RydWN0b3IiLCJkeUNiLkhhc2guY3JlYXRlIiwiZHlDYi5IYXNoLmdldENoaWxkcmVuIiwiZHlDYi5IYXNoLmdldENvdW50IiwiZHlDYi5IYXNoLmdldEtleXMiLCJkeUNiLkhhc2guZ2V0Q2hpbGQiLCJkeUNiLkhhc2guc2V0VmFsdWUiLCJkeUNiLkhhc2guYWRkQ2hpbGQiLCJkeUNiLkhhc2guYXBwZW5kQ2hpbGQiLCJkeUNiLkhhc2gucmVtb3ZlQ2hpbGQiLCJkeUNiLkhhc2gucmVtb3ZlQWxsQ2hpbGRyZW4iLCJkeUNiLkhhc2guaGFzQ2hpbGQiLCJkeUNiLkhhc2guZm9yRWFjaCIsImR5Q2IuSGFzaC5maWx0ZXIiLCJkeUNiLkhhc2gubWFwIiwiZHlDYi5RdWV1ZSIsImR5Q2IuUXVldWUuY29uc3RydWN0b3IiLCJkeUNiLlF1ZXVlLmNyZWF0ZSIsImR5Q2IuUXVldWUucHVzaCIsImR5Q2IuUXVldWUucG9wIiwiZHlDYi5RdWV1ZS5jbGVhciIsImR5Q2IuU3RhY2siLCJkeUNiLlN0YWNrLmNvbnN0cnVjdG9yIiwiZHlDYi5TdGFjay5jcmVhdGUiLCJkeUNiLlN0YWNrLnB1c2giLCJkeUNiLlN0YWNrLnBvcCIsImR5Q2IuU3RhY2suY2xlYXIiLCJkeUNiLkp1ZGdlVXRpbHMiLCJkeUNiLkp1ZGdlVXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkp1ZGdlVXRpbHMuaXNBcnJheSIsImR5Q2IuSnVkZ2VVdGlscy5pc0Z1bmN0aW9uIiwiZHlDYi5KdWRnZVV0aWxzLmlzTnVtYmVyIiwiZHlDYi5KdWRnZVV0aWxzLmlzU3RyaW5nIiwiZHlDYi5KdWRnZVV0aWxzLmlzQm9vbGVhbiIsImR5Q2IuSnVkZ2VVdGlscy5pc0RvbSIsImR5Q2IuSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdCIsImR5Q2IuSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QiLCJkeUNiLkFqYXhVdGlscyIsImR5Q2IuQWpheFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5BamF4VXRpbHMuYWpheCIsImR5Q2IuQWpheFV0aWxzLl9jcmVhdGVBamF4IiwiZHlDYi5BamF4VXRpbHMuX2lzTG9jYWxGaWxlIiwiZHlDYi5BamF4VXRpbHMuX2lzU291bmRGaWxlIiwiZHlDYi5Db252ZXJ0VXRpbHMiLCJkeUNiLkNvbnZlcnRVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQ29udmVydFV0aWxzLnRvU3RyaW5nIiwiZHlDYi5Db252ZXJ0VXRpbHMuX2NvbnZlcnRDb2RlVG9TdHJpbmciLCJkeUNiLkV2ZW50VXRpbHMiLCJkeUNiLkV2ZW50VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV2ZW50VXRpbHMuYmluZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLmFkZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLnJlbW92ZUV2ZW50IiwiZHlDYi5FeHRlbmRVdGlscyIsImR5Q2IuRXh0ZW5kVXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZERlZXAiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZCIsImR5Q2IuRXh0ZW5kVXRpbHMuY29weVB1YmxpY0F0dHJpIiwiZHlDYi5QYXRoVXRpbHMiLCJkeUNiLlBhdGhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuUGF0aFV0aWxzLmJhc2VuYW1lIiwiZHlDYi5QYXRoVXRpbHMuZXh0bmFtZSIsImR5Q2IuUGF0aFV0aWxzLl9zcGxpdFBhdGgiLCJkeUNiLkRvbVF1ZXJ5IiwiZHlDYi5Eb21RdWVyeS5jb25zdHJ1Y3RvciIsImR5Q2IuRG9tUXVlcnkuY3JlYXRlIiwiZHlDYi5Eb21RdWVyeS5nZXQiLCJkeUNiLkNvbGxlY3Rpb24iLCJkeUNiLkNvbGxlY3Rpb24uY29uc3RydWN0b3IiLCJkeUNiLkNvbGxlY3Rpb24uY3JlYXRlIiwiZHlDYi5Db2xsZWN0aW9uLmNvcHkiLCJkeUNiLkNvbGxlY3Rpb24uZmlsdGVyIiwiZHlDYi5Db2xsZWN0aW9uLnJldmVyc2UiLCJkeUNiLkNvbGxlY3Rpb24uc29ydCIsImR5Q2IuQ29sbGVjdGlvbi5tYXAiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sSUFBSSxDQXFCVjtBQXJCRCxXQUFPLElBQUksRUFBQSxDQUFDO0lBSVJBLEVBQUVBLENBQUNBLENBQUNBLGFBQWFBLElBQUlBLE1BQU1BLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BDQSxNQUFNQSxDQUFDQSxX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QUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO3dCQUN0QkEsUUFBUUEsQ0FBQ0E7b0JBQ2JBLENBQUNBO29CQUVEQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLElBQUlBLElBQUlBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsS0FBS0EsSUFBSUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0NBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFHREEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xDQSxNQUFNQSxHQUFHQSxLQUFLQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFFckJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUNmQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFD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LElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ2xFQSxDQUFDQTtRQUVNTix3QkFBR0EsR0FBVkEsVUFBV0EsSUFBYUE7WUFDcEJPLElBQUlBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBO1lBRW5CQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFDQSxDQUFDQSxFQUFFQSxLQUFLQTtnQkFDbEJBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUU1QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsTUFBTUEsS0FBS0EsWUFBT0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7b0JBQ25CQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDM0JBLENBQUNBO2dCQUNEQSxzRUFBc0VBO1lBQzFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVIQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFNQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUM3Q0EsQ0FBQ0E7UUFDTFAsaUJBQUNBO0lBQURBLENBdERBMUYsQUFzREMwRixFQXREa0MxRixTQUFJQSxFQXNEdENBO0lBdERZQSxlQUFVQSxhQXNEdEJBLENBQUFBO0FBQ0xBLENBQUNBLEVBeERNLElBQUksS0FBSixJQUFJLFFBd0RWIiwiZmlsZSI6ImR5Q2IuZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgZHlDYntcbi8vIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbFxuICAgIGRlY2xhcmUgdmFyIHdpbmRvdztcblxuICAgIGlmICgncGVyZm9ybWFuY2UnIGluIHdpbmRvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgd2luZG93LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4vLyBJRSA4XG4gICAgRGF0ZS5ub3cgPSAoIERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0gKTtcblxuICAgIGlmICgnbm93JyBpbiB3aW5kb3cucGVyZm9ybWFuY2UgPT09IGZhbHNlKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nICYmIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG9mZnNldDtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY29uc3QgJEJSRUFLID0ge1xuICAgICAgICBicmVhazp0cnVlXG4gICAgfTtcbiAgICBleHBvcnQgY29uc3QgJFJFTU9WRSA9IHZvaWQgMDtcbn1cblxuXG4iLCJtb2R1bGUgZHlDYiB7XG4gICAgZGVjbGFyZSB2YXIgd2luZG93OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9BVFRSSUJVVEU6IFwiYWJzdHJhY3QgYXR0cmlidXRlIG5lZWQgb3ZlcnJpZGVcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX01FVEhPRDogXCJhYnN0cmFjdCBtZXRob2QgbmVlZCBvdmVycmlkZVwiLFxuXG4gICAgICAgICAgICBoZWxwZXJGdW5jOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nKHZhbCkgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2VydGlvbjogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudHMubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcImludmFsaWRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcIm11c3Qgbm90IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTEQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcInNob3VsZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU1VQUE9SVDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInN1cHBvcnRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJub3Qgc3VwcG9ydFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0RFRklORTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm11c3QgZGVmaW5lXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0RFRklORTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm11c3Qgbm90IGRlZmluZVwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJ1bmtub3dcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhQRUNUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwiZXhwZWN0XCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VORVhQRUNUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwidW5leHBlY3RlZFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS50cmFjZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLnRyYWNlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jb25zb2xlLmFzc2VydCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmFzc2VydChjb25kLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghY29uZCAmJiBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBlcnJvcihjb25kLCBtZXNzYWdlKTphbnkge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICAvL3RvZG8gcmVtYWluIGNvbW1vbiBcImZvckVhY2gsZmlsdGVyLG1hcC4uLlwiIG1ldGhvZHNcblxuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzpGdW5jdGlvbnxUKTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhjLCBpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkID0gPGFueT5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHx8IChjLnVpZCAmJiBjaGlsZC51aWQgJiYgYy51aWQgPT09IGNoaWxkLnVpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6VCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOkFycmF5PFQ+fExpc3Q8VD58YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46QXJyYXk8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBMaXN0KXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46TGlzdDxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZDphbnkgPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHVibGljIHJlbW92ZUNoaWxkQXQgKGluZGV4KSB7XG4gICAgICAgIC8vICAgIExvZy5lcnJvcihpbmRleCA8IDAsIFwi5bqP5Y+35b+F6aG75aSn5LqO562J5LqOMFwiKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnVpZCA9PT0gYXJnLnVpZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sICAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZSA9PT0gYXJnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0FycmF5KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjb3B5Q2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNsaWNlKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaW5kZXhPZihhcnI6YW55W10sIGFyZzphbnkpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAtMTtcblxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZnVuYy5jYWxsKG51bGwsIHZhbHVlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSzsgICAvL+WmguaenOWMheWQq++8jOWImee9rui/lOWbnuWAvOS4unRydWUs6Lez5Ye65b6q546vXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSA8YW55PmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAodmFsdWUuY29udGFpbiAmJiB2YWx1ZS5jb250YWluKHZhbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAodmFsdWUuaW5kZXhPZiAmJiB2YWx1ZS5pbmRleE9mKHZhbCkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSzsgICAvL+WmguaenOWMheWQq++8jOWImee9rui/lOWbnuWAvOS4unRydWUs6Lez5Ye65b6q546vXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NvbnRhaW4oYXJyOlRbXSwgYXJnOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2YoYXJyLCBhcmcpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9mb3JFYWNoKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gY29udGV4dCB8fCB3aW5kb3csXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChzY29wZSwgYXJyW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZUNoaWxkKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IG51bGw7XG5cbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5faW5kZXhPZihhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWZ1bmMuY2FsbChzZWxmLCBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL2lmIChpbmRleCAhPT0gbnVsbCAmJiBpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAvL3JldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9yZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoa2V5OnN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUoa2V5OnN0cmluZywgdmFsdWU6VCl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoa2V5OnN0cmluZywgdmFsdWU6VCkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNBcnJheSh0aGlzLl9jaGlsZHJlbltrZXldKSkge1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fY2hpbGRyZW5ba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9lbHNlIHtcbiAgICAgICAgICAgIC8vICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSBbdmFsdWVdO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW5ba2V5XSBpbnN0YW5jZW9mIENvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IDxhbnk+KHRoaXMuX2NoaWxkcmVuW2tleV0pO1xuXG4gICAgICAgICAgICAgICAgYy5hZGRDaGlsZCg8VD52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gPGFueT4oQ29sbGVjdGlvbi5jcmVhdGU8YW55PigpLmFkZENoaWxkKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmcpKXtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRyZW4sIGFyZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihmdW5jKHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGQoYXJnOmFueSk6Ym9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmd1bWVudHNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihmdW5jKHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJndW1lbnRzWzBdO1xuXG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0Pzphbnkpe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAoaSBpbiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkcmVuW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmlsdGVyKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZighZnVuYy5jYWxsKHNjb3BlLCB2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIEhhc2guY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRNYXAgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29sbGVjdGlvblwiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgUXVldWU8VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcHVzaChlbGVtZW50OlQpe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHBvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKXtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb2xsZWN0aW9uXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBTdGFjazxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBKdWRnZVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5KHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmdW5jKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc051bWJlcihvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEJvb2xlYW5dXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRG9tKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIpOaWreaYr+WQpuS4uuWvueixoeWtl+mdoumHj++8iHt977yJXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRGlyZWN0T2JqZWN0KG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmo4Dmn6Xlrr/kuLvlr7nosaHmmK/lkKblj6/osIPnlKhcbiAgICAgICAgICpcbiAgICAgICAgICog5Lu75L2V5a+56LGh77yM5aaC5p6c5YW26K+t5LmJ5ZyoRUNNQVNjcmlwdOinhOiMg+S4reiiq+WumuS5iei/h++8jOmCo+S5iOWug+iiq+ensOS4uuWOn+eUn+Wvueixoe+8m1xuICAgICAgICAg546v5aKD5omA5o+Q5L6b55qE77yM6ICM5ZyoRUNNQVNjcmlwdOinhOiMg+S4reayoeacieiiq+aPj+i/sOeahOWvueixoe+8jOaIkeS7rOensOS5i+S4uuWuv+S4u+WvueixoeOAglxuXG4gICAgICAgICDor6Xmlrnms5XnlKjkuo7nibnmgKfmo4DmtYvvvIzliKTmlq3lr7nosaHmmK/lkKblj6/nlKjjgILnlKjms5XlpoLkuIvvvJpcblxuICAgICAgICAgTXlFbmdpbmUgYWRkRXZlbnQoKTpcbiAgICAgICAgIGlmIChUb29sLmp1ZGdlLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkgeyAgICAvL+WIpOaWrWRvbeaYr+WQpuWFt+aciWFkZEV2ZW50TGlzdGVuZXLmlrnms5VcbiAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKHNFdmVudFR5cGUsIGZuSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0hvc3RNZXRob2Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgICAgICAgICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmICEhb2JqZWN0W3Byb3BlcnR5XSkgfHxcbiAgICAgICAgICAgICAgICB0eXBlID09PSBcInVua25vd25cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBkeUNie1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBBamF4VXRpbHN7XG4gICAgICAgIC8qIVxuICAgICAgICAg5a6e546wYWpheFxuXG4gICAgICAgICBhamF4KHtcbiAgICAgICAgIHR5cGU6XCJwb3N0XCIsLy9wb3N05oiW6ICFZ2V077yM6Z2e5b+F6aG7XG4gICAgICAgICB1cmw6XCJ0ZXN0LmpzcFwiLC8v5b+F6aG755qEXG4gICAgICAgICBkYXRhOlwibmFtZT1kaXBvbyZpbmZvPWdvb2RcIiwvL+mdnuW/hemhu1xuICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsLy90ZXh0L3htbC9qc29u77yM6Z2e5b+F6aG7XG4gICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpey8v5Zue6LCD5Ye95pWw77yM6Z2e5b+F6aG7XG4gICAgICAgICBhbGVydChkYXRhLm5hbWUpO1xuICAgICAgICAgfVxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhamF4KGNvbmYpe1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjb25mLnR5cGU7Ly90eXBl5Y+C5pWwLOWPr+mAiVxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmYudXJsOy8vdXJs5Y+C5pWw77yM5b+F5aGrXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGNvbmYuZGF0YTsvL2RhdGHlj4LmlbDlj6/pgInvvIzlj6rmnInlnKhwb3N06K+35rGC5pe26ZyA6KaBXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBjb25mLmRhdGFUeXBlOy8vZGF0YXR5cGXlj4LmlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY29uZi5zdWNjZXNzOy8v5Zue6LCD5Ye95pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjb25mLmVycm9yO1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBudWxsKSB7Ly90eXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6Z2V0XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IG51bGwpIHsvL2RhdGFUeXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6dGV4dFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhociA9IHRoaXMuX2NyZWF0ZUFqYXgoZXJyb3IpO1xuICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJHRVRcIiB8fCB0eXBlID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcIlBPU1RcIiB8fCB0eXBlID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxhamF46K6/6Zeu55qE5piv5pys5Zyw5paH5Lu277yM5YiZc3RhdHVz5Li6MFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCBzZWxmLl9pc0xvY2FsRmlsZSh4aHIuc3RhdHVzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZGF0YVR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aZrumAmuaWh+acrFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcInhtbFwiIHx8IGRhdGFUeXBlID09PSBcIlhNTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aOpeaUtnhtbOaWh+aho1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVhNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwianNvblwiIHx8IGRhdGFUeXBlID09PSBcIkpTT05cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhldmFsKFwiKFwiICsgeGhyLnJlc3BvbnNlVGV4dCArIFwiKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jcmVhdGVBamF4KGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7Ly9JReezu+WIl+a1j+iniOWZqFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwibWljcm9zb2Z0LnhtbGh0dHBcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7Ly/pnZ5JRea1j+iniOWZqFxuICAgICAgICAgICAgICAgICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih4aHIsIHttZXNzYWdlOiBcIuaCqOeahOa1j+iniOWZqOS4jeaUr+aMgWFqYXjvvIzor7fmm7TmjaLvvIFcIn0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGhyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzTG9jYWxGaWxlKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LlVSTC5jb250YWluKFwiZmlsZTovL1wiKSAmJiBzdGF0dXMgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNTb3VuZEZpbGUoZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhVHlwZSA9PT0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgLy9kZWNsYXJlIHZhciB3aW5kb3c6YW55O1xuICAgIGV4cG9ydCBjbGFzcyBFdmVudFV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kRXZlbnQoY29udGV4dCwgZnVuYykge1xuICAgICAgICAgICAgLy92YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAvLyAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZ1bi5hcHBseShvYmplY3QsIFtzZWxmLndyYXBFdmVudChldmVudCldLmNvbmNhdChhcmdzKSk7IC8v5a+55LqL5Lu25a+56LGh6L+b6KGM5YyF6KOFXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGFkZEV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhdHRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiZGV0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFeHRlbmRVdGlscyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7Hmi7fotJ1cbiAgICAgICAgICpcbiAgICAgICAgICog56S65L6L77yaXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuaVsOe7hO+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOS4jeaLt+i0nUFycmF55Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIGV4cGVjdChleHRlbmQuZXh0ZW5kRGVlcChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSkpLnRvRXF1YWwoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pO1xuICAgICAgICAgKlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrlr7nosaHvvIzog73lpJ/miJDlip/mi7fotJ3vvIjog73mi7fotJ3ljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICBmdW5jdGlvbiBBKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQS5wcm90b3R5cGUuYSA9IDE7XG5cbiAgICAgICAgIGZ1bmN0aW9uIEIoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBCLnByb3RvdHlwZSA9IG5ldyBBKCk7XG4gICAgICAgICBCLnByb3RvdHlwZS5iID0geyB4OiAxLCB5OiAxIH07XG4gICAgICAgICBCLnByb3RvdHlwZS5jID0gW3sgeDogMSB9LCBbMl1dO1xuXG4gICAgICAgICB2YXIgdCA9IG5ldyBCKCk7XG5cbiAgICAgICAgIHJlc3VsdCA9IGV4dGVuZC5leHRlbmREZWVwKHQpO1xuXG4gICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFxuICAgICAgICAge1xuICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgYjogeyB4OiAxLCB5OiAxIH0sXG4gICAgICAgICAgICAgYzogW3sgeDogMSB9LCBbMl1dXG4gICAgICAgICB9KTtcbiAgICAgICAgICogQHBhcmFtIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgICAgICogQHJldHVybnNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kRGVlcChwYXJlbnQsIGNoaWxkPyxmaWx0ZXI9ZnVuY3Rpb24odmFsLCBpKXtyZXR1cm4gdHJ1ZTt9KSB7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuID0gMCxcbiAgICAgICAgICAgICAgICB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgc0FyciA9IFwiW29iamVjdCBBcnJheV1cIixcbiAgICAgICAgICAgICAgICBzT2IgPSBcIltvYmplY3QgT2JqZWN0XVwiLFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlwiLFxuICAgICAgICAgICAgICAgIF9jaGlsZCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8v5pWw57uE55qE6K+d77yM5LiN6I635b6XQXJyYXnljp/lnovkuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNBcnIpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHBhcmVudC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+WvueixoeeahOivne+8jOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAguWboOS4uuiAg+iZkeS7peS4i+aDheaZr++8mlxuICAgICAgICAgICAgLy/nsbtB57un5om/5LqO57G7Qu+8jOeOsOWcqOaDs+imgeaLt+i0neexu0HnmoTlrp7kvoth55qE5oiQ5ZGY77yI5YyF5ous5LuO57G7Que7p+aJv+adpeeahOaIkOWRmO+8ie+8jOmCo+S5iOWwsemcgOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgZWxzZSBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzT2IpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gcGFyZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1heaLt+i0nVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQoZGVzdGluYXRpb246YW55LCBzb3VyY2U6YW55KSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBcIlwiO1xuXG4gICAgICAgICAgICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvcHlQdWJsaWNBdHRyaShzb3VyY2U6YW55KXtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGwsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5leHRlbmREZWVwKHNvdXJjZSwgZGVzdGluYXRpb24sIGZ1bmN0aW9uKGl0ZW0sIHByb3BlcnR5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuc2xpY2UoMCwgMSkgIT09IFwiX1wiXG4gICAgICAgICAgICAgICAgICAgICYmICFKdWRnZVV0aWxzLmlzRnVuY3Rpb24oaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNie1xuICAgIHZhciBTUExJVFBBVEhfUkVHRVggPVxuICAgICAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcblxuICAgIC8vdG9kbyByZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vY29va2Zyb250L2xlYXJuLW5vdGUvYmxvYi9tYXN0ZXIvYmxvZy1iYWNrdXAvMjAxNC9ub2RlanMtcGF0aC5tZFxuICAgIGV4cG9ydCBjbGFzcyBQYXRoVXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZW5hbWUocGF0aDpzdHJpbmcsIGV4dD86c3RyaW5nKXtcbiAgICAgICAgICAgIHZhciBmID0gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAgICAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICAgICAgICAgICAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICAgICAgICAgICAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dG5hbWUocGF0aDpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwbGl0UGF0aChwYXRoKVszXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9zcGxpdFBhdGgoZmlsZU5hbWU6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiBTUExJVFBBVEhfUkVHRVguZXhlYyhmaWxlTmFtZSkuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgRG9tUXVlcnkge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb21TdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoZG9tU3RyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6YW55ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihkb21TdHIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRG9tKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW2FyZ3VtZW50c1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb21TdHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY29weSAoaXNEZWVwOmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRGVlcCA/IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYyk6Q29sbGVjdGlvbjxUPiB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpBcnJheTxUPiA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbHVlOlQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmdW5jLmNhbGwoc2NvcGUsIHZhbHVlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8YW55Pih0aGlzLmNvcHlDaGlsZHJlbigpLnJldmVyc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jKXtcbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KHRoaXMuY29weUNoaWxkcmVuKCkuc29ydChmdW5jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdEFyciA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMoZSwgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXJyLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9lICYmIGVbaGFuZGxlck5hbWVdICYmIGVbaGFuZGxlck5hbWVdLmFwcGx5KGNvbnRleHQgfHwgZSwgdmFsdWVBcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KHJlc3VsdEFycik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=