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
    //todo convert "Collection" type to "List" type
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
            else if (arg instanceof dyCb.Collection) {
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
        List.prototype.filter = function (func) {
            var scope = this.children, result = [];
            this._forEach(this.children, function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });
            return dyCb.Collection.create(result);
        };
        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this.children.splice(index, 1);
        //}
        //
        //public copy () {
        //    return Collection.create<T>(ExtendUtils.extendDeep(this.children));
        //}
        List.prototype.reverse = function () {
            this.children.reverse();
            return this;
        };
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
        List.prototype.sort = function (func) {
            this.children.sort(func);
            return this;
        };
        List.prototype.map = function (func) {
            return this._map(this.children, func);
        };
        List.prototype.toArray = function () {
            return this.children;
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
        List.prototype._map = function (arr, func) {
            var resultArr = [];
            this._forEach(arr, function (e, index) {
                var result = func(e, index);
                if (result !== dyCb.$REMOVE) {
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
            });
            return dyCb.Collection.create(resultArr);
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
        return Collection;
    })(dyCb.List);
    dyCb.Collection = Collection;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC93aW5kb3cudHMiLCJnbG9iYWwvQ29uc3QudHMiLCJMb2cudHMiLCJMaXN0LnRzIiwiQ29sbGVjdGlvbi50cyIsIkhhc2gudHMiLCJRdWV1ZS50cyIsIlN0YWNrLnRzIiwidXRpbHMvSnVkZ2VVdGlscy50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0NvbnZlcnRVdGlscy50cyIsInV0aWxzL0V2ZW50VXRpbHMudHMiLCJ1dGlscy9FeHRlbmRVdGlscy50cyIsInV0aWxzL1BhdGhVdGlscy50cyIsInV0aWxzL0RvbVF1ZXJ5LnRzIl0sIm5hbWVzIjpbImR5Q2IiLCJkeUNiLkxvZyIsImR5Q2IuTG9nLmNvbnN0cnVjdG9yIiwiZHlDYi5Mb2cubG9nIiwiZHlDYi5Mb2cuYXNzZXJ0IiwiZHlDYi5Mb2cuZXJyb3IiLCJkeUNiLkxpc3QiLCJkeUNiLkxpc3QuY29uc3RydWN0b3IiLCJkeUNiLkxpc3QuZ2V0Q291bnQiLCJkeUNiLkxpc3QuaGFzQ2hpbGQiLCJkeUNiLkxpc3QuZ2V0Q2hpbGRyZW4iLCJkeUNiLkxpc3QuZ2V0Q2hpbGQiLCJkeUNiLkxpc3QuYWRkQ2hpbGQiLCJkeUNiLkxpc3QuYWRkQ2hpbGRyZW4iLCJkeUNiLkxpc3QucmVtb3ZlQWxsQ2hpbGRyZW4iLCJkeUNiLkxpc3QuZm9yRWFjaCIsImR5Q2IuTGlzdC5maWx0ZXIiLCJkeUNiLkxpc3QucmV2ZXJzZSIsImR5Q2IuTGlzdC5yZW1vdmVDaGlsZCIsImR5Q2IuTGlzdC5zb3J0IiwiZHlDYi5MaXN0Lm1hcCIsImR5Q2IuTGlzdC50b0FycmF5IiwiZHlDYi5MaXN0Ll9pbmRleE9mIiwiZHlDYi5MaXN0Ll9jb250YWluIiwiZHlDYi5MaXN0Ll9mb3JFYWNoIiwiZHlDYi5MaXN0Ll9tYXAiLCJkeUNiLkxpc3QuX3JlbW92ZUNoaWxkIiwiZHlDYi5Db2xsZWN0aW9uIiwiZHlDYi5Db2xsZWN0aW9uLmNvbnN0cnVjdG9yIiwiZHlDYi5Db2xsZWN0aW9uLmNyZWF0ZSIsImR5Q2IuQ29sbGVjdGlvbi5jb3B5IiwiZHlDYi5IYXNoIiwiZHlDYi5IYXNoLmNvbnN0cnVjdG9yIiwiZHlDYi5IYXNoLmNyZWF0ZSIsImR5Q2IuSGFzaC5nZXRDaGlsZHJlbiIsImR5Q2IuSGFzaC5nZXRDb3VudCIsImR5Q2IuSGFzaC5nZXRLZXlzIiwiZHlDYi5IYXNoLmdldENoaWxkIiwiZHlDYi5IYXNoLnNldFZhbHVlIiwiZHlDYi5IYXNoLmFkZENoaWxkIiwiZHlDYi5IYXNoLmFwcGVuZENoaWxkIiwiZHlDYi5IYXNoLnJlbW92ZUNoaWxkIiwiZHlDYi5IYXNoLnJlbW92ZUFsbENoaWxkcmVuIiwiZHlDYi5IYXNoLmhhc0NoaWxkIiwiZHlDYi5IYXNoLmZvckVhY2giLCJkeUNiLkhhc2guZmlsdGVyIiwiZHlDYi5IYXNoLm1hcCIsImR5Q2IuUXVldWUiLCJkeUNiLlF1ZXVlLmNvbnN0cnVjdG9yIiwiZHlDYi5RdWV1ZS5jcmVhdGUiLCJkeUNiLlF1ZXVlLnB1c2giLCJkeUNiLlF1ZXVlLnBvcCIsImR5Q2IuUXVldWUuY2xlYXIiLCJkeUNiLlN0YWNrIiwiZHlDYi5TdGFjay5jb25zdHJ1Y3RvciIsImR5Q2IuU3RhY2suY3JlYXRlIiwiZHlDYi5TdGFjay5wdXNoIiwiZHlDYi5TdGFjay5wb3AiLCJkeUNiLlN0YWNrLmNsZWFyIiwiZHlDYi5KdWRnZVV0aWxzIiwiZHlDYi5KdWRnZVV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5KdWRnZVV0aWxzLmlzQXJyYXkiLCJkeUNiLkp1ZGdlVXRpbHMuaXNGdW5jdGlvbiIsImR5Q2IuSnVkZ2VVdGlscy5pc051bWJlciIsImR5Q2IuSnVkZ2VVdGlscy5pc1N0cmluZyIsImR5Q2IuSnVkZ2VVdGlscy5pc0Jvb2xlYW4iLCJkeUNiLkp1ZGdlVXRpbHMuaXNEb20iLCJkeUNiLkp1ZGdlVXRpbHMuaXNEaXJlY3RPYmplY3QiLCJkeUNiLkp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kIiwiZHlDYi5BamF4VXRpbHMiLCJkeUNiLkFqYXhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQWpheFV0aWxzLmFqYXgiLCJkeUNiLkFqYXhVdGlscy5fY3JlYXRlQWpheCIsImR5Q2IuQWpheFV0aWxzLl9pc0xvY2FsRmlsZSIsImR5Q2IuQWpheFV0aWxzLl9pc1NvdW5kRmlsZSIsImR5Q2IuQ29udmVydFV0aWxzIiwiZHlDYi5Db252ZXJ0VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkNvbnZlcnRVdGlscy50b1N0cmluZyIsImR5Q2IuQ29udmVydFV0aWxzLl9jb252ZXJ0Q29kZVRvU3RyaW5nIiwiZHlDYi5FdmVudFV0aWxzIiwiZHlDYi5FdmVudFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FdmVudFV0aWxzLmJpbmRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5hZGRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5yZW1vdmVFdmVudCIsImR5Q2IuRXh0ZW5kVXRpbHMiLCJkeUNiLkV4dGVuZFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmREZWVwIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmQiLCJkeUNiLkV4dGVuZFV0aWxzLmNvcHlQdWJsaWNBdHRyaSIsImR5Q2IuUGF0aFV0aWxzIiwiZHlDYi5QYXRoVXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLlBhdGhVdGlscy5iYXNlbmFtZSIsImR5Q2IuUGF0aFV0aWxzLmV4dG5hbWUiLCJkeUNiLlBhdGhVdGlscy5fc3BsaXRQYXRoIiwiZHlDYi5Eb21RdWVyeSIsImR5Q2IuRG9tUXVlcnkuY29uc3RydWN0b3IiLCJkeUNiLkRvbVF1ZXJ5LmNyZWF0ZSIsImR5Q2IuRG9tUXVlcnkuZ2V0Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLElBQUksQ0FxQlY7QUFyQkQsV0FBTyxJQUFJLEVBQUEsQ0FBQztJQUlSQSxFQUFFQSxDQUFDQSxDQUFDQSxhQUFhQSxJQUFJQSxNQUFNQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNwQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7SUFDNUJBLENB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QTtnQkFDOUJBLE1BQU1BLEdBQUdBLEtBQUtBLElBQUlBLEVBQUVBLENBQUNBO2dCQUVyQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzVDQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTt3QkFDdEJBLFFBQVFBLENBQUNBO29CQUNiQSxDQUFDQTtvQkFFREEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxJQUFJQSxJQUFJQSxJQUFJQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaENBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLEtBQUtBLElBQUlBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO3dCQUNwQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQkEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO1lBQ0xBLENBQUNBO1lBR0RBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLENBQUNB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QSxlQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDakNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hDQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDRkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsUUFBUUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNuREEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBakJhRCxlQUFNQSxHQUFwQkEsVUFBcUJBLE1BQWFBO1lBQzlCRSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUUzQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDZkEsQ0FBQ0E7UUFlTUYsc0JBQUdBLEdBQVZBLFVBQVdBLEtBQUtBO1lBQ1pHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzdCQSxDQUFDQTtRQUNMSCxlQUFDQTtJQUFEQSxDQXZCQTlGLEFBdUJDOEYsSUFBQTlGO0lBdkJZQSxhQUFRQSxXQXVCcEJBLENBQUFBO0FBQ0xBLENBQUNBLEVBekJNLElBQUksS0FBSixJQUFJLFFBeUJWIiwiZmlsZSI6ImR5Q2IuZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgZHlDYntcbi8vIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbFxuICAgIGRlY2xhcmUgdmFyIHdpbmRvdztcblxuICAgIGlmICgncGVyZm9ybWFuY2UnIGluIHdpbmRvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgd2luZG93LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4vLyBJRSA4XG4gICAgRGF0ZS5ub3cgPSAoIERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0gKTtcblxuICAgIGlmICgnbm93JyBpbiB3aW5kb3cucGVyZm9ybWFuY2UgPT09IGZhbHNlKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nICYmIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG9mZnNldDtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY29uc3QgJEJSRUFLID0ge1xuICAgICAgICBicmVhazp0cnVlXG4gICAgfTtcbiAgICBleHBvcnQgY29uc3QgJFJFTU9WRSA9IHZvaWQgMDtcbn1cblxuXG4iLCJtb2R1bGUgZHlDYiB7XG4gICAgZGVjbGFyZSB2YXIgd2luZG93OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9BVFRSSUJVVEU6IFwiYWJzdHJhY3QgYXR0cmlidXRlIG5lZWQgb3ZlcnJpZGVcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX01FVEhPRDogXCJhYnN0cmFjdCBtZXRob2QgbmVlZCBvdmVycmlkZVwiLFxuXG4gICAgICAgICAgICBoZWxwZXJGdW5jOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nKHZhbCkgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2VydGlvbjogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudHMubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcImludmFsaWRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcIm11c3Qgbm90IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTEQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcInNob3VsZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU1VQUE9SVDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInN1cHBvcnRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJub3Qgc3VwcG9ydFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0RFRklORTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm11c3QgZGVmaW5lXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0RFRklORTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm11c3Qgbm90IGRlZmluZVwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTktOT1c6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJ1bmtub3dcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfRVhQRUNUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwiZXhwZWN0XCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VORVhQRUNUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwidW5leHBlY3RlZFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE91dHB1dCBEZWJ1ZyBtZXNzYWdlLlxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbG9nKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS50cmFjZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLnRyYWNlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jb25zb2xlLmFzc2VydCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmFzc2VydChjb25kLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghY29uZCAmJiBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBlcnJvcihjb25kLCBtZXNzYWdlKTphbnkge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICAvL3RvZG8gY29udmVydCBcIkNvbGxlY3Rpb25cIiB0eXBlIHRvIFwiTGlzdFwiIHR5cGVcbiAgICAvL3RvZG8gcmVtYWluIGNvbW1vbiBcImZvckVhY2gsZmlsdGVyLG1hcC4uLlwiIG1ldGhvZHNcblxuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzpGdW5jdGlvbnxUKTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhjLCBpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkID0gPGFueT5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuY2hpbGRyZW4sIChjLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHx8IChjLnVpZCAmJiBjaGlsZC51aWQgJiYgYy51aWQgPT09IGNoaWxkLnVpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6VCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOkFycmF5PFQ+fENvbGxlY3Rpb248VD58YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46QXJyYXk8VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW46Q29sbGVjdGlvbjxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZDphbnkgPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYyk6Q29sbGVjdGlvbjxUPiB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpBcnJheTxUPiA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuY2hpbGRyZW4sICh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuXG4gICAgICAgIC8vcHVibGljIGNvcHkgKCkge1xuICAgICAgICAvLyAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4oRXh0ZW5kVXRpbHMuZXh0ZW5kRGVlcCh0aGlzLmNoaWxkcmVuKSk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIHB1YmxpYyByZXZlcnNlICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucmV2ZXJzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVDaGlsZChhcmc6YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCBmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFyZy51aWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbiwgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID09PSBhcmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNvcnQoZnVuYyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuYyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOkZ1bmN0aW9uKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXAodGhpcy5jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9pbmRleE9mKGFycjphbnlbXSwgYXJnOmFueSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFmdW5jLmNhbGwobnVsbCwgdmFsdWUsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLOyAgIC8v5aaC5p6c5YyF5ZCr77yM5YiZ572u6L+U5Zue5YC85Li6dHJ1ZSzot7Plh7rlvqrnjq9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDxhbnk+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICh2YWx1ZS5jb250YWluICYmIHZhbHVlLmNvbnRhaW4odmFsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICh2YWx1ZS5pbmRleE9mICYmIHZhbHVlLmluZGV4T2YodmFsKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLOyAgIC8v5aaC5p6c5YyF5ZCr77yM5YiZ572u6L+U5Zue5YC85Li6dHJ1ZSzot7Plh7rlvqrnjq9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY29udGFpbihhcnI6VFtdLCBhcmc6YW55KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZihhcnIsIGFyZykgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2ZvckVhY2goYXJyOlRbXSwgZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSBjb250ZXh0IHx8IHdpbmRvdyxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbWFwKGFycjpBcnJheTxUPiwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdEFyciA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMoZSwgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXJyLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9lICYmIGVbaGFuZGxlck5hbWVdICYmIGVbaGFuZGxlck5hbWVdLmFwcGx5KGNvbnRleHQgfHwgZSwgdmFsdWVBcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KHJlc3VsdEFycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmVDaGlsZChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuX2luZGV4T2YoYXJyLCAoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFmdW5jLmNhbGwoc2VsZiwgZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9pZiAoaW5kZXggIT09IG51bGwgJiYgaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY29weSAoaXNEZWVwOmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRGVlcCA/IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBIYXNoPFQ+IHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSB7fSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPHsgW3M6c3RyaW5nXTpUIH0+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46eyBbczpzdHJpbmddOlQgfSA9IHt9KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbjp7XG4gICAgICAgICAgICBbczpzdHJpbmddOlRcbiAgICAgICAgfSA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0S2V5cygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IENvbGxlY3Rpb24uY3JlYXRlKCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRDaGlsZChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChrZXk6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShrZXk6c3RyaW5nLCB2YWx1ZTpUKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTpUKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFwcGVuZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc0FycmF5KHRoaXMuX2NoaWxkcmVuW2tleV0pKSB7XG4gICAgICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHJlbltrZXldLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAvL2Vsc2Uge1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IFt2YWx1ZV07XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzU3RyaW5nKGFyZykpe1xuICAgICAgICAgICAgICAgIGxldCBrZXkgPSA8c3RyaW5nPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvL3JldHVybiB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLl9jaGlsZHJlbiwgYXJnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NoaWxkcmVuW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChhcmc6YW55KTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSl7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdE1hcCA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmModmFsLCBrZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgTG9nLmVycm9yKCFKdWRnZVV0aWxzLmlzQXJyYXkocmVzdWx0KSB8fCByZXN1bHQubGVuZ3RoICE9PSAyLCBMb2cuaW5mby5GVU5DX01VU1RfQkUoXCJpdGVyYXRvclwiLCBcIltrZXksIHZhbHVlXVwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwW3Jlc3VsdFswXV0gPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHRNYXApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb2xsZWN0aW9uXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBRdWV1ZTxUPiBleHRlbmRzIExpc3Q8VD57XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0gW10pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDxBcnJheTxUPj5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjpBcnJheTxUPiA9IFtdKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbGxlY3Rpb25cIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFN0YWNrPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHB1c2goZWxlbWVudDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwb3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsZWFyKCl7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEp1ZGdlVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQXJyYXkodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNGdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc1N0cmluZyhzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RyKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNCb29sZWFuKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgQm9vbGVhbl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEb20ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmplY3RbcHJvcGVydHldO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09IFwib2JqZWN0XCIgJiYgISFvYmplY3RbcHJvcGVydHldKSB8fFxuICAgICAgICAgICAgICAgIHR5cGUgPT09IFwidW5rbm93blwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIGR5Q2J7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIEFqYXhVdGlsc3tcbiAgICAgICAgLyohXG4gICAgICAgICDlrp7njrBhamF4XG5cbiAgICAgICAgIGFqYXgoe1xuICAgICAgICAgdHlwZTpcInBvc3RcIiwvL3Bvc3TmiJbogIVnZXTvvIzpnZ7lv4XpobtcbiAgICAgICAgIHVybDpcInRlc3QuanNwXCIsLy/lv4XpobvnmoRcbiAgICAgICAgIGRhdGE6XCJuYW1lPWRpcG9vJmluZm89Z29vZFwiLC8v6Z2e5b+F6aG7XG4gICAgICAgICBkYXRhVHlwZTpcImpzb25cIiwvL3RleHQveG1sL2pzb27vvIzpnZ7lv4XpobtcbiAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7Ly/lm57osIPlh73mlbDvvIzpnZ7lv4XpobtcbiAgICAgICAgIGFsZXJ0KGRhdGEubmFtZSk7XG4gICAgICAgICB9XG4gICAgICAgICB9KTsqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFqYXgoY29uZil7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNvbmYudHlwZTsvL3R5cGXlj4LmlbAs5Y+v6YCJXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZi51cmw7Ly91cmzlj4LmlbDvvIzlv4XloatcbiAgICAgICAgICAgIHZhciBkYXRhID0gY29uZi5kYXRhOy8vZGF0YeWPguaVsOWPr+mAie+8jOWPquacieWcqHBvc3Tor7fmsYLml7bpnIDopoFcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IGNvbmYuZGF0YVR5cGU7Ly9kYXRhdHlwZeWPguaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjb25mLnN1Y2Nlc3M7Ly/lm57osIPlh73mlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNvbmYuZXJyb3I7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHsvL3R5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLpnZXRcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJnZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gbnVsbCkgey8vZGF0YVR5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLp0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyID0gdGhpcy5fY3JlYXRlQWpheChlcnJvcik7XG4gICAgICAgICAgICBpZiAoIXhocikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkdFVFwiIHx8IHR5cGUgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwiUE9TVFwiIHx8IHR5cGUgPT09IFwicG9zdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenGFqYXjorr/pl67nmoTmmK/mnKzlnLDmlofku7bvvIzliJlzdGF0dXPkuLowXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHNlbGYuX2lzTG9jYWxGaWxlKHhoci5zdGF0dXMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBcInRleHRcIiB8fCBkYXRhVHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5pmu6YCa5paH5pysXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwieG1sXCIgfHwgZGF0YVR5cGUgPT09IFwiWE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5o6l5pS2eG1s5paH5qGjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJqc29uXCIgfHwgZGF0YVR5cGUgPT09IFwiSlNPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGV2YWwoXCIoXCIgKyB4aHIucmVzcG9uc2VUZXh0ICsgXCIpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZUFqYXgoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHsvL0lF57O75YiX5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJtaWNyb3NvZnQueG1saHR0cFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsvL+mdnklF5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHhociwge21lc3NhZ2U6IFwi5oKo55qE5rWP6KeI5Zmo5LiN5pSv5oyBYWpheO+8jOivt+abtOaNou+8gVwifSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNMb2NhbEZpbGUoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuVVJMLmNvbnRhaW4oXCJmaWxlOi8vXCIpICYmIHN0YXR1cyA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc1NvdW5kRmlsZShkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNie1xuICAgIGV4cG9ydCBjbGFzcyBDb252ZXJ0VXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdG9TdHJpbmcob2JqOmFueSl7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc051bWJlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc2pRdWVyeShvYmopKSB7XG4gICAgICAgICAgICAvLyAgICByZXR1cm4gX2pxVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2RlVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRGlyZWN0T2JqZWN0KG9iaikgfHwgSnVkZ2VVdGlscy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jb252ZXJ0Q29kZVRvU3RyaW5nKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4udG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuc2xpY2UoMSwgLTEpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICAvL2RlY2xhcmUgdmFyIHdpbmRvdzphbnk7XG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmRFdmVudChjb250ZXh0LCBmdW5jKSB7XG4gICAgICAgICAgICAvL3ZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIC8vICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZnVuLmFwcGx5KG9iamVjdCwgW3NlbGYud3JhcEV2ZW50KGV2ZW50KV0uY29uY2F0KGFyZ3MpKTsgLy/lr7nkuovku7blr7nosaHov5vooYzljIXoo4VcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImF0dGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJkZXRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuZFV0aWxzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3seaLt+i0nVxuICAgICAgICAgKlxuICAgICAgICAgKiDnpLrkvovvvJpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65pWw57uE77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI5LiN5ou36LSdQXJyYXnljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogZXhwZWN0KGV4dGVuZC5leHRlbmREZWVwKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKSkudG9FcXVhbChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSk7XG4gICAgICAgICAqXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuWvueixoe+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOiDveaLt+i0neWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgIGZ1bmN0aW9uIEEoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBBLnByb3RvdHlwZS5hID0gMTtcblxuICAgICAgICAgZnVuY3Rpb24gQigpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEIucHJvdG90eXBlID0gbmV3IEEoKTtcbiAgICAgICAgIEIucHJvdG90eXBlLmIgPSB7IHg6IDEsIHk6IDEgfTtcbiAgICAgICAgIEIucHJvdG90eXBlLmMgPSBbeyB4OiAxIH0sIFsyXV07XG5cbiAgICAgICAgIHZhciB0ID0gbmV3IEIoKTtcblxuICAgICAgICAgcmVzdWx0ID0gZXh0ZW5kLmV4dGVuZERlZXAodCk7XG5cbiAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG4gICAgICAgICB7XG4gICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICBiOiB7IHg6IDEsIHk6IDEgfSxcbiAgICAgICAgICAgICBjOiBbeyB4OiAxIH0sIFsyXV1cbiAgICAgICAgIH0pO1xuICAgICAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAgICAgKiBAcmV0dXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmREZWVwKHBhcmVudCwgY2hpbGQ/LGZpbHRlcj1mdW5jdGlvbih2YWwsIGkpe3JldHVybiB0cnVlO30pIHtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBsZW4gPSAwLFxuICAgICAgICAgICAgICAgIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBzQXJyID0gXCJbb2JqZWN0IEFycmF5XVwiLFxuICAgICAgICAgICAgICAgIHNPYiA9IFwiW29iamVjdCBPYmplY3RdXCIsXG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiXCIsXG4gICAgICAgICAgICAgICAgX2NoaWxkID0gbnVsbDtcblxuICAgICAgICAgICAgLy/mlbDnu4TnmoTor53vvIzkuI3ojrflvpdBcnJheeWOn+Wei+S4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc0Fycikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcGFyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a+56LGh55qE6K+d77yM6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CC5Zug5Li66ICD6JmR5Lul5LiL5oOF5pmv77yaXG4gICAgICAgICAgICAvL+exu0Hnu6fmib/kuo7nsbtC77yM546w5Zyo5oOz6KaB5ou36LSd57G7QeeahOWunuS+i2HnmoTmiJDlkZjvvIjljIXmi6zku47nsbtC57un5om/5p2l55qE5oiQ5ZGY77yJ77yM6YKj5LmI5bCx6ZyA6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBlbHNlIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNPYikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWF5ou36LSdXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29weVB1YmxpY0F0dHJpKHNvdXJjZTphbnkpe1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZERlZXAoc291cmNlLCBkZXN0aW5hdGlvbiwgZnVuY3Rpb24oaXRlbSwgcHJvcGVydHkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5zbGljZSgwLCAxKSAhPT0gXCJfXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgIUp1ZGdlVXRpbHMuaXNGdW5jdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2J7XG4gICAgdmFyIFNQTElUUEFUSF9SRUdFWCA9XG4gICAgICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xuXG4gICAgLy90b2RvIHJlZmVyIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jb29rZnJvbnQvbGVhcm4tbm90ZS9ibG9iL21hc3Rlci9ibG9nLWJhY2t1cC8yMDE0L25vZGVqcy1wYXRoLm1kXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhVdGlsc3tcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlbmFtZShwYXRoOnN0cmluZywgZXh0PzpzdHJpbmcpe1xuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9zcGxpdFBhdGgocGF0aClbMl07XG4gICAgICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gICAgICAgICAgICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgICAgICAgICAgICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGY7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0bmFtZShwYXRoOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3NwbGl0UGF0aChmaWxlTmFtZTpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIFNQTElUUEFUSF9SRUdFWC5leGVjKGZpbGVOYW1lKS5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBEb21RdWVyeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRvbVN0cjpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhkb21TdHIpO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZG9tczphbnkgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRvbVN0cikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEb20oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbYXJndW1lbnRzWzBdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvbVN0cik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RvbXNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=