var dyCb;
(function (dyCb) {
    dyCb.$BREAK = {
        break: true
    };
    dyCb.$REMOVE = void 0;
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
            if (console && console.log) {
                console.log(message);
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
            if (console.assert) {
                console.assert(cond, message);
            }
            else {
                if (!cond && message) {
                    if (console && console.log) {
                        console.log(message);
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
    var Collection = (function () {
        function Collection(children) {
            if (children === void 0) { children = []; }
            this._children = null;
            this._children = children;
        }
        Collection.create = function (children) {
            if (children === void 0) { children = []; }
            var obj = new this(children);
            return obj;
        };
        Collection.prototype.getCount = function () {
            return this._children.length;
        };
        Collection.prototype.hasChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0];
                return this._contain(this._children, function (c, i) {
                    return func(c, i);
                });
            }
            var child = arguments[0];
            return this._contain(this._children, function (c, i) {
                if (c === child
                    || (c.uid && child.uid && c.uid === child.uid)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };
        Collection.prototype.getChildren = function () {
            return this._children;
        };
        Collection.prototype.getChild = function (index) {
            return this._children[index];
        };
        Collection.prototype.addChild = function (child) {
            this._children.push(child);
            return this;
        };
        Collection.prototype.addChildren = function (arg) {
            if (dyCb.JudgeUtils.isArray(arg)) {
                var children = arg;
                this._children = this._children.concat(children);
            }
            else if (arg instanceof Collection) {
                var children = arg;
                this._children = this._children.concat(children.toArray());
            }
            else {
                var child = arg;
                this.addChild(child);
            }
            return this;
        };
        Collection.prototype.removeAllChildren = function () {
            this._children = [];
            return this;
        };
        Collection.prototype.forEach = function (func, context) {
            this._forEach(this._children, func, context);
            return this;
        };
        Collection.prototype.filter = function (func) {
            var scope = this._children, result = [];
            this._forEach(this._children, function (value, index) {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });
            return Collection.create(result);
        };
        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this._children.splice(index, 1);
        //}
        //
        //public copy () {
        //    return ExtendUtils.extendDeep(this._children);
        //}
        //
        Collection.prototype.reverse = function () {
            this._children.reverse();
            return this;
        };
        Collection.prototype.removeChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg;
                this._removeChild(this._children, func);
            }
            else if (arg.uid) {
                this._removeChild(this._children, function (e) {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                this._removeChild(this._children, function (e) {
                    return e === arg;
                });
            }
            return this;
        };
        Collection.prototype.sort = function (func) {
            this._children.sort(func);
            return this;
        };
        Collection.prototype.map = function (func) {
            return this._map(this._children, func);
        };
        Collection.prototype.toArray = function () {
            return this._children;
        };
        Collection.prototype._indexOf = function (arr, arg) {
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
        Collection.prototype._contain = function (arr, arg) {
            return this._indexOf(arr, arg) > -1;
        };
        Collection.prototype._forEach = function (arr, func, context) {
            var scope = context || window, i = 0, len = arr.length;
            for (i = 0; i < len; i++) {
                if (func.call(scope, arr[i], i) === dyCb.$BREAK) {
                    break;
                }
            }
        };
        Collection.prototype._map = function (arr, func) {
            var resultArr = [];
            this._forEach(arr, function (e, index) {
                var result = func(e, index);
                if (result !== dyCb.$REMOVE) {
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
            });
            return Collection.create(resultArr);
        };
        Collection.prototype._removeChild = function (arr, func) {
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
        Collection.prototype._filter = function (arr, func, context) {
        };
        return Collection;
    })();
    dyCb.Collection = Collection;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC9Db25zdC50cyIsIkhhc2gudHMiLCJ1dGlscy9KdWRnZVV0aWxzLnRzIiwidXRpbHMvQWpheFV0aWxzLnRzIiwidXRpbHMvQ29udmVydFV0aWxzLnRzIiwidXRpbHMvRXZlbnRVdGlscy50cyIsInV0aWxzL0V4dGVuZFV0aWxzLnRzIiwiTG9nLnRzIiwiQ29sbGVjdGlvbi50cyIsInV0aWxzL0RvbVF1ZXJ5LnRzIl0sIm5hbWVzIjpbImR5Q2IiLCJkeUNiLkhhc2giLCJkeUNiLkhhc2guY29uc3RydWN0b3IiLCJkeUNiLkhhc2guY3JlYXRlIiwiZHlDYi5IYXNoLmdldENoaWxkcmVuIiwiZHlDYi5IYXNoLmdldENvdW50IiwiZHlDYi5IYXNoLmdldEtleXMiLCJkeUNiLkhhc2guZ2V0Q2hpbGQiLCJkeUNiLkhhc2guYWRkQ2hpbGQiLCJkeUNiLkhhc2guYXBwZW5kQ2hpbGQiLCJkeUNiLkhhc2gucmVtb3ZlQ2hpbGQiLCJkeUNiLkhhc2guaGFzQ2hpbGQiLCJkeUNiLkhhc2guZm9yRWFjaCIsImR5Q2IuSGFzaC5maWx0ZXIiLCJkeUNiLkhhc2gubWFwIiwiZHlDYi5KdWRnZVV0aWxzIiwiZHlDYi5KdWRnZVV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5KdWRnZVV0aWxzLmlzQXJyYXkiLCJkeUNiLkp1ZGdlVXRpbHMuaXNGdW5jdGlvbiIsImR5Q2IuSnVkZ2VVdGlscy5pc051bWJlciIsImR5Q2IuSnVkZ2VVdGlscy5pc1N0cmluZyIsImR5Q2IuSnVkZ2VVdGlscy5pc0Jvb2xlYW4iLCJkeUNiLkp1ZGdlVXRpbHMuaXNEb20iLCJkeUNiLkp1ZGdlVXRpbHMuaXNEaXJlY3RPYmplY3QiLCJkeUNiLkp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kIiwiZHlDYi5BamF4VXRpbHMiLCJkeUNiLkFqYXhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQWpheFV0aWxzLmFqYXgiLCJkeUNiLkFqYXhVdGlscy5fY3JlYXRlQWpheCIsImR5Q2IuQWpheFV0aWxzLl9pc0xvY2FsRmlsZSIsImR5Q2IuQWpheFV0aWxzLl9pc1NvdW5kRmlsZSIsImR5Q2IuQ29udmVydFV0aWxzIiwiZHlDYi5Db252ZXJ0VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkNvbnZlcnRVdGlscy50b1N0cmluZyIsImR5Q2IuQ29udmVydFV0aWxzLl9jb252ZXJ0Q29kZVRvU3RyaW5nIiwiZHlDYi5FdmVudFV0aWxzIiwiZHlDYi5FdmVudFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FdmVudFV0aWxzLmJpbmRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5hZGRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5yZW1vdmVFdmVudCIsImR5Q2IuRXh0ZW5kVXRpbHMiLCJkeUNiLkV4dGVuZFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmREZWVwIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmQiLCJkeUNiLkV4dGVuZFV0aWxzLmNvcHlQdWJsaWNBdHRyaSIsImR5Q2IuTG9nIiwiZHlDYi5Mb2cuY29uc3RydWN0b3IiLCJkeUNiLkxvZy5sb2ciLCJkeUNiLkxvZy5hc3NlcnQiLCJkeUNiLkxvZy5lcnJvciIsImR5Q2IuQ29sbGVjdGlvbiIsImR5Q2IuQ29sbGVjdGlvbi5jb25zdHJ1Y3RvciIsImR5Q2IuQ29sbGVjdGlvbi5jcmVhdGUiLCJkeUNiLkNvbGxlY3Rpb24uZ2V0Q291bnQiLCJkeUNiLkNvbGxlY3Rpb24uaGFzQ2hpbGQiLCJkeUNiLkNvbGxlY3Rpb24uZ2V0Q2hpbGRyZW4iLCJkeUNiLkNvbGxlY3Rpb24uZ2V0Q2hpbGQiLCJkeUNiLkNvbGxlY3Rpb24uYWRkQ2hpbGQiLCJkeUNiLkNvbGxlY3Rpb24uYWRkQ2hpbGRyZW4iLCJkeUNiLkNvbGxlY3Rpb24ucmVtb3ZlQWxsQ2hpbGRyZW4iLCJkeUNiLkNvbGxlY3Rpb24uZm9yRWFjaCIsImR5Q2IuQ29sbGVjdGlvbi5maWx0ZXIiLCJkeUNiLkNvbGxlY3Rpb24ucmV2ZXJzZSIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5zb3J0IiwiZHlDYi5Db2xsZWN0aW9uLm1hcCIsImR5Q2IuQ29sbGVjdGlvbi50b0FycmF5IiwiZHlDYi5Db2xsZWN0aW9uLl9pbmRleE9mIiwiZHlDYi5Db2xsZWN0aW9uLl9jb250YWluIiwiZHlDYi5Db2xsZWN0aW9uLl9mb3JFYWNoIiwiZHlDYi5Db2xsZWN0aW9uLl9tYXAiLCJkeUNiLkNvbGxlY3Rpb24uX3JlbW92ZUNoaWxkIiwiZHlDYi5Db2xsZWN0aW9uLl9maWx0ZXIiLCJkeUNiLkRvbVF1ZXJ5IiwiZHlDYi5Eb21RdWVyeS5jb25zdHJ1Y3RvciIsImR5Q2IuRG9tUXVlcnkuY3JlYXRlIiwiZHlDYi5Eb21RdWVyeS5nZXQiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sSUFBSSxDQUtWO0FBTEQsV0FBTyxJQUFJLEVBQUEsQ0FBQztJQUNLQSxXQUFNQSxHQUFHQTtRQUNsQkEsS0FBS0EsRUFBQ0EsSUFBSUE7S0FDYkEsQ0FBQ0E7SUFDV0EsWUFBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7QUFDbENBLENBQUNBLEVBTE0sSUFBSSxLQUFKLElBQUksUUFLVjs7QUNMRCx3Q0FBd0M7QUFDeEMsSUFBTyxJQUFJLENBdUtWO0FBdktELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFDVEE7UUFPSUMsY0FBWUEsUUFBOEJBO1lBQTlCQyx3QkFBOEJBLEdBQTlCQSxhQUE4QkE7WUFJbENBLGNBQVNBLEdBRWJBLElBQUlBLENBQUNBO1lBTExBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFFBQVFBLENBQUNBO1FBQzlCQSxDQUFDQTtRQVJhRCxXQUFNQSxHQUFwQkEsVUFBd0JBLFFBQWFBO1lBQWJFLHdCQUFhQSxHQUFiQSxhQUFhQTtZQUNqQ0EsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBbUJBLFFBQVFBLENBQUNBLENBQUNBO1lBRS9DQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNmQSxDQUFDQTtRQVVNRiwwQkFBV0EsR0FBbEJBO1lBQ0lH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Q0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQkEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO1lBQ0xBLENBQUNBO1lBR0RBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQ0EsTUFBTUEsR0FBR0EsS0FBS0EsSUFBSUEsRUFBRUEsQ0FBQ0E7Z0JBRXJCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7d0JBQ3RCQSxRQUFRQSxDQUFDQTtvQkFDYkEsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxJQUFJQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDcENBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDRkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDcEJBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBQ2xCQSxDQUFDQTtRQUVERjs7V0FFR0E7UUFDV0Esa0JBQU1BLEdBQXBCQSxVQUFxQkEsV0FBZUEsRUFBRUEsTUFBVUE7WUFDNUNHLElBQUlBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO1lBRWxCQSxHQUFHQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1lBQzdDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7UUFFYUgsMkJBQWVBLEdBQTdCQSxVQUE4QkEsTUFBVUE7WUFDcENJLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLEVBQ2ZBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO1lBRXJCQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxXQUFXQSxFQUFFQSxVQUFTQSxJQUFJQSxFQUFFQSxRQUFRQTtnQkFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUc7dUJBQzVCLENBQUMsZUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUNBLENBQUNBO1lBRUhBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO1FBQ3ZCQSxDQUFDQTtRQUNMSixrQkFBQ0E7SUFBREEsQ0E5R0F4QyxBQThHQ3dDLElBQUF4QztJQTlHWUEsZ0JBQVdBLGNBOEd2QkEsQ0FBQUE7QUFDTEEsQ0FBQ0EsRUFoSE0sSUFBSSxLQUFKLElBQUksUUFnSFY7O0FDakhELElBQU8sSUFBSSxDQStJVjtBQS9JRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBQ1RBO1FBQUE2QztRQTZJQUMsQ0FBQ0E7UUE1REdEOzs7O1dBSUdBO1FBQ1dBLE9BQUdBLEdBQWpCQSxVQUFrQkEsT0FBT0E7WUFDckJFLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6QkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLENBQUNBO2dCQUNGQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUNuQkEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFREY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQXdCR0E7UUFDV0EsVUFBTUEsR0FBcEJBLFVBQXFCQSxJQUFJQSxFQUFFQSxPQUFPQTtZQUM5QkcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pCQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0ZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUNuQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDekJBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDRkEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25CQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFYUgsU0FBS0EsR0FBbkJBLFVBQW9CQSxJQUFJQSxFQUFFQSxPQUFPQTtZQUM3QkksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQzdCQSxDQUFDQTtRQUNMQSxDQUFDQTtRQTNJYUosUUFBSUEsR0FBR0E7WUFDakJBLGFBQWFBLEVBQUVBLG1CQUFtQkE7WUFDbENBLGtCQUFrQkEsRUFBRUEsa0NBQWtDQTtZQUN0REEsZUFBZUEsRUFBRUEsK0JBQStCQTtZQUVoREEsVUFBVUEsRUFBRUE7Z0JBQVMsY0FBTztxQkFBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO29CQUFQLDZCQUFPOztnQkFDeEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUVoQixLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEdBQUc7b0JBQ3pELE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQ0RBLFNBQVNBLEVBQUVBO2dCQUFTLGNBQU87cUJBQVAsV0FBTyxDQUFQLHNCQUFPLENBQVAsSUFBTztvQkFBUCw2QkFBTzs7Z0JBQ3ZCLEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUEsQ0FBQztvQkFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUNELElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7b0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLENBQUM7Z0JBQ0QsSUFBSSxDQUFBLENBQUM7b0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO1lBQ0wsQ0FBQztZQUVEQSxZQUFZQSxFQUFFQSxVQUFVQSxLQUFLQTtnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFDREEsU0FBU0EsRUFBRUE7Z0JBQVUsY0FBTztxQkFBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO29CQUFQLDZCQUFPOztnQkFDeEIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFbkQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQ0RBLFlBQVlBLEVBQUVBO2dCQUFVLGNBQU87cUJBQVAsV0FBTyxDQUFQLHNCQUFPLENBQVAsSUFBTztvQkFBUCw2QkFBTzs7Z0JBQzNCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRW5ELEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNEQSxnQkFBZ0JBLEVBQUVBO2dCQUFVLGNBQU87cUJBQVAsV0FBTyxDQUFQLHNCQUFPLENBQVAsSUFBTztvQkFBUCw2QkFBTzs7Z0JBQy9CLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRW5ELEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNEQSxXQUFXQSxFQUFFQTtnQkFBVSxjQUFPO3FCQUFQLFdBQU8sQ0FBUCxzQkFBTyxDQUFQLElBQU87b0JBQVAsNkJBQU87O2dCQUMxQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUVuRCxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV0QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFDREEsWUFBWUEsRUFBRUEsVUFBU0EsS0FBS0E7Z0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBQ0RBLGdCQUFnQkEsRUFBRUEsVUFBU0EsS0FBS0E7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBQ0RBLGdCQUFnQkEsRUFBRUEsVUFBU0EsS0FBS0E7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBQ0RBLG9CQUFvQkEsRUFBRUEsVUFBU0EsS0FBS0E7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BELENBQUM7WUFDREEsV0FBV0EsRUFBRUEsVUFBU0EsS0FBS0E7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQ0RBLFdBQVdBLEVBQUVBLFVBQVNBLEtBQUtBO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNEQSxhQUFhQSxFQUFFQSxVQUFTQSxLQUFLQTtnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLENBQUM7U0FDSkEsQ0FBQ0E7UUE4RE5BLFVBQUNBO0lBQURBLENBN0lBN0MsQUE2SUM2QyxJQUFBN0M7SUE3SVlBLFFBQUdBLE1BNklmQSxDQUFBQTtBQUNMQSxDQUFDQSxFQS9JTSxJQUFJLEtBQUosSUFBSSxRQStJVjs7QUMvSUQsd0NBQXdDO0FBQ3hDLElBQU8sSUFBSSxDQTBPVjtBQTFPRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBQ1RBO1FBT0lrRCxvQkFBWUEsUUFBc0JBO1lBQXRCQyx3QkFBc0JBLEdBQXRCQSxhQUFzQkE7WUFJMUJBLGNBQVNBLEdBQVlBLElBQUlBLENBQUNBO1lBSDlCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7UUFSYUQsaUJBQU1BLEdBQXBCQSxVQUF3QkEsUUFBYUE7WUFBYkUsd0JBQWFBLEdBQWJBLGFBQWFBO1lBQ2pDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFXQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUV2Q0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDZkEsQ0FBQ0E7UUFRTUYsNkJBQVFBLEdBQWZBO1lBQ0lHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO1FBQ2pDQSxDQUFDQTtRQUVNSCw2QkFBUUEsR0FBZkEsVUFBZ0JBLEdBQWNBO1lBQzFCSSxFQUFFQSxDQUFDQSxDQUFDQSxlQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdENBLElBQUlBLElBQUlBLEdBQWFBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUVsQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsVUFBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBQ3RDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLENBQUNBLENBQUNBLENBQUNBO1lBQ1BBLENBQUNBO1lBRURBLElBQUlBLEtBQUtBLEdBQVFBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRTlCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFDQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBO3VCQUNSQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFD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QSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0ZBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLFFBQVFBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDbkRBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQWpCYUQsZUFBTUEsR0FBcEJBLFVBQXFCQSxNQUFhQTtZQUM5QkUsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFFM0JBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO1FBQ2ZBLENBQUNBO1FBZU1GLHNCQUFHQSxHQUFWQSxVQUFXQSxLQUFLQTtZQUNaRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7UUFDTEgsZUFBQ0E7SUFBREEsQ0F2QkF6RSxBQXVCQ3lFLElBQUF6RTtJQXZCWUEsYUFBUUEsV0F1QnBCQSxDQUFBQTtBQUNMQSxDQUFDQSxFQXpCTSxJQUFJLEtBQUosSUFBSSxRQXlCViIsImZpbGUiOiJkeUNiLmRlYnVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGR5Q2J7XG4gICAgZXhwb3J0IGNvbnN0ICRCUkVBSyA9IHtcbiAgICAgICAgYnJlYWs6dHJ1ZVxuICAgIH07XG4gICAgZXhwb3J0IGNvbnN0ICRSRU1PVkUgPSB2b2lkIDA7XG59XG5cblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEhhc2g8VD4ge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IHt9KXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8eyBbczpzdHJpbmddOlQgfT5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjp7IFtzOnN0cmluZ106VCB9ID0ge30pe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NoaWxkcmVuOntcbiAgICAgICAgICAgIFtzOnN0cmluZ106VFxuICAgICAgICB9ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRLZXlzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGtleTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOlQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYXBwZW5kQ2hpbGQoa2V5OnN0cmluZywgdmFsdWU6YW55KSB7XG4gICAgICAgICAgICAvL2lmIChKdWRnZVV0aWxzLmlzQXJyYXkodGhpcy5fY2hpbGRyZW5ba2V5XSkpIHtcbiAgICAgICAgICAgIC8vICAgIHRoaXMuX2NoaWxkcmVuW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vZWxzZSB7XG4gICAgICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gW3ZhbHVlXTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuW2tleV0gaW5zdGFuY2VvZiBDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSA8YW55Pih0aGlzLl9jaGlsZHJlbltrZXldKTtcblxuICAgICAgICAgICAgICAgIGMuYWRkQ2hpbGQoPFQ+dmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IDxhbnk+KENvbGxlY3Rpb24uY3JlYXRlPGFueT4oKS5hZGRDaGlsZCh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVDaGlsZChhcmc6YW55KXtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnLFxuICAgICAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuX2NoaWxkcmVuLCBhcmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fY2hpbGRyZW5ba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzphbnkpOmJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZnVuYyh2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBrZXkgPSA8c3RyaW5nPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KXtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICBmb3IgKGkgaW4gY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZHJlbltpXSwgaSkgPT09ICRCUkVBSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZpbHRlcihmdW5jOkZ1bmN0aW9uKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuX2NoaWxkcmVuO1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWZ1bmMuY2FsbChzY29wZSwgdmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TWFwID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyh2YWwsIGtleSk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICBMb2cuZXJyb3IoIUp1ZGdlVXRpbHMuaXNBcnJheShyZXN1bHQpIHx8IHJlc3VsdC5sZW5ndGggIT09IDIsIExvZy5pbmZvLkZVTkNfTVVTVF9CRShcIml0ZXJhdG9yXCIsIFwiW2tleSwgdmFsdWVdXCIpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBbcmVzdWx0WzBdXSA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIEhhc2guY3JlYXRlKHJlc3VsdE1hcCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuIiwibW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBKdWRnZVV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0FycmF5KHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmdW5jKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc051bWJlcihvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQm9vbGVhbihvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEJvb2xlYW5dXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRG9tKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIpOaWreaYr+WQpuS4uuWvueixoeWtl+mdoumHj++8iHt977yJXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzRGlyZWN0T2JqZWN0KG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmo4Dmn6Xlrr/kuLvlr7nosaHmmK/lkKblj6/osIPnlKhcbiAgICAgICAgICpcbiAgICAgICAgICog5Lu75L2V5a+56LGh77yM5aaC5p6c5YW26K+t5LmJ5ZyoRUNNQVNjcmlwdOinhOiMg+S4reiiq+WumuS5iei/h++8jOmCo+S5iOWug+iiq+ensOS4uuWOn+eUn+Wvueixoe+8m1xuICAgICAgICAg546v5aKD5omA5o+Q5L6b55qE77yM6ICM5ZyoRUNNQVNjcmlwdOinhOiMg+S4reayoeacieiiq+aPj+i/sOeahOWvueixoe+8jOaIkeS7rOensOS5i+S4uuWuv+S4u+WvueixoeOAglxuXG4gICAgICAgICDor6Xmlrnms5XnlKjkuo7nibnmgKfmo4DmtYvvvIzliKTmlq3lr7nosaHmmK/lkKblj6/nlKjjgILnlKjms5XlpoLkuIvvvJpcblxuICAgICAgICAgTXlFbmdpbmUgYWRkRXZlbnQoKTpcbiAgICAgICAgIGlmIChUb29sLmp1ZGdlLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkgeyAgICAvL+WIpOaWrWRvbeaYr+WQpuWFt+aciWFkZEV2ZW50TGlzdGVuZXLmlrnms5VcbiAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKHNFdmVudFR5cGUsIGZuSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0hvc3RNZXRob2Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgICAgICAgICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmICEhb2JqZWN0W3Byb3BlcnR5XSkgfHxcbiAgICAgICAgICAgICAgICB0eXBlID09PSBcInVua25vd25cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBkeUNie1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBBamF4VXRpbHN7XG4gICAgICAgIC8qIVxuICAgICAgICAg5a6e546wYWpheFxuXG4gICAgICAgICBhamF4KHtcbiAgICAgICAgIHR5cGU6XCJwb3N0XCIsLy9wb3N05oiW6ICFZ2V077yM6Z2e5b+F6aG7XG4gICAgICAgICB1cmw6XCJ0ZXN0LmpzcFwiLC8v5b+F6aG755qEXG4gICAgICAgICBkYXRhOlwibmFtZT1kaXBvbyZpbmZvPWdvb2RcIiwvL+mdnuW/hemhu1xuICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsLy90ZXh0L3htbC9qc29u77yM6Z2e5b+F6aG7XG4gICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpey8v5Zue6LCD5Ye95pWw77yM6Z2e5b+F6aG7XG4gICAgICAgICBhbGVydChkYXRhLm5hbWUpO1xuICAgICAgICAgfVxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhamF4KGNvbmYpe1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjb25mLnR5cGU7Ly90eXBl5Y+C5pWwLOWPr+mAiVxuICAgICAgICAgICAgdmFyIHVybCA9IGNvbmYudXJsOy8vdXJs5Y+C5pWw77yM5b+F5aGrXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGNvbmYuZGF0YTsvL2RhdGHlj4LmlbDlj6/pgInvvIzlj6rmnInlnKhwb3N06K+35rGC5pe26ZyA6KaBXG4gICAgICAgICAgICB2YXIgZGF0YVR5cGUgPSBjb25mLmRhdGFUeXBlOy8vZGF0YXR5cGXlj4LmlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY29uZi5zdWNjZXNzOy8v5Zue6LCD5Ye95pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjb25mLmVycm9yO1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBudWxsKSB7Ly90eXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6Z2V0XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IG51bGwpIHsvL2RhdGFUeXBl5Y+C5pWw5Y+v6YCJ77yM6buY6K6k5Li6dGV4dFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhociA9IHRoaXMuX2NyZWF0ZUFqYXgoZXJyb3IpO1xuICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJHRVRcIiB8fCB0eXBlID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcIlBPU1RcIiB8fCB0eXBlID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxhamF46K6/6Zeu55qE5piv5pys5Zyw5paH5Lu277yM5YiZc3RhdHVz5Li6MFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCBzZWxmLl9pc0xvY2FsRmlsZSh4aHIuc3RhdHVzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZGF0YVR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aZrumAmuaWh+acrFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcInhtbFwiIHx8IGRhdGFUeXBlID09PSBcIlhNTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+aOpeaUtnhtbOaWh+aho1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZVhNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwianNvblwiIHx8IGRhdGFUeXBlID09PSBcIkpTT05cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhldmFsKFwiKFwiICsgeGhyLnJlc3BvbnNlVGV4dCArIFwiKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jcmVhdGVBamF4KGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7Ly9JReezu+WIl+a1j+iniOWZqFxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwibWljcm9zb2Z0LnhtbGh0dHBcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7Ly/pnZ5JRea1j+iniOWZqFxuICAgICAgICAgICAgICAgICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih4aHIsIHttZXNzYWdlOiBcIuaCqOeahOa1j+iniOWZqOS4jeaUr+aMgWFqYXjvvIzor7fmm7TmjaLvvIFcIn0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGhyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzTG9jYWxGaWxlKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LlVSTC5jb250YWluKFwiZmlsZTovL1wiKSAmJiBzdGF0dXMgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNTb3VuZEZpbGUoZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhVHlwZSA9PT0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY2xhc3MgQ29udmVydFV0aWxze1xuICAgICAgICBwdWJsaWMgc3RhdGljIHRvU3RyaW5nKG9iajphbnkpe1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNOdW1iZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNqUXVlcnkob2JqKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIF9qcVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb252ZXJ0Q29kZVRvU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdChvYmopIHx8IEp1ZGdlVXRpbHMuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY29udmVydENvZGVUb1N0cmluZyhmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpLnNsaWNlKDEsIC0xKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgLy9kZWNsYXJlIHZhciB3aW5kb3c6YW55O1xuICAgIGV4cG9ydCBjbGFzcyBFdmVudFV0aWxzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBiaW5kRXZlbnQoY29udGV4dCwgZnVuYykge1xuICAgICAgICAgICAgLy92YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAvLyAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZ1bi5hcHBseShvYmplY3QsIFtzZWxmLndyYXBFdmVudChldmVudCldLmNvbmNhdChhcmdzKSk7IC8v5a+55LqL5Lu25a+56LGh6L+b6KGM5YyF6KOFXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGFkZEV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhdHRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiZGV0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFeHRlbmRVdGlscyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7Hmi7fotJ1cbiAgICAgICAgICpcbiAgICAgICAgICog56S65L6L77yaXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuaVsOe7hO+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOS4jeaLt+i0nUFycmF55Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIGV4cGVjdChleHRlbmQuZXh0ZW5kRGVlcChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSkpLnRvRXF1YWwoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pO1xuICAgICAgICAgKlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrlr7nosaHvvIzog73lpJ/miJDlip/mi7fotJ3vvIjog73mi7fotJ3ljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICBmdW5jdGlvbiBBKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQS5wcm90b3R5cGUuYSA9IDE7XG5cbiAgICAgICAgIGZ1bmN0aW9uIEIoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBCLnByb3RvdHlwZSA9IG5ldyBBKCk7XG4gICAgICAgICBCLnByb3RvdHlwZS5iID0geyB4OiAxLCB5OiAxIH07XG4gICAgICAgICBCLnByb3RvdHlwZS5jID0gW3sgeDogMSB9LCBbMl1dO1xuXG4gICAgICAgICB2YXIgdCA9IG5ldyBCKCk7XG5cbiAgICAgICAgIHJlc3VsdCA9IGV4dGVuZC5leHRlbmREZWVwKHQpO1xuXG4gICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFxuICAgICAgICAge1xuICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgYjogeyB4OiAxLCB5OiAxIH0sXG4gICAgICAgICAgICAgYzogW3sgeDogMSB9LCBbMl1dXG4gICAgICAgICB9KTtcbiAgICAgICAgICogQHBhcmFtIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgICAgICogQHJldHVybnNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kRGVlcChwYXJlbnQsIGNoaWxkPyxmaWx0ZXI9ZnVuY3Rpb24odmFsLCBpKXtyZXR1cm4gdHJ1ZTt9KSB7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuID0gMCxcbiAgICAgICAgICAgICAgICB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgc0FyciA9IFwiW29iamVjdCBBcnJheV1cIixcbiAgICAgICAgICAgICAgICBzT2IgPSBcIltvYmplY3QgT2JqZWN0XVwiLFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlwiLFxuICAgICAgICAgICAgICAgIF9jaGlsZCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8v5pWw57uE55qE6K+d77yM5LiN6I635b6XQXJyYXnljp/lnovkuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNBcnIpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHBhcmVudC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+WvueixoeeahOivne+8jOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAguWboOS4uuiAg+iZkeS7peS4i+aDheaZr++8mlxuICAgICAgICAgICAgLy/nsbtB57un5om/5LqO57G7Qu+8jOeOsOWcqOaDs+imgeaLt+i0neexu0HnmoTlrp7kvoth55qE5oiQ5ZGY77yI5YyF5ous5LuO57G7Que7p+aJv+adpeeahOaIkOWRmO+8ie+8jOmCo+S5iOWwsemcgOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgZWxzZSBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzT2IpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gcGFyZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1heaLt+i0nVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQoZGVzdGluYXRpb246YW55LCBzb3VyY2U6YW55KSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBcIlwiO1xuXG4gICAgICAgICAgICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvcHlQdWJsaWNBdHRyaShzb3VyY2U6YW55KXtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGwsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5leHRlbmREZWVwKHNvdXJjZSwgZGVzdGluYXRpb24sIGZ1bmN0aW9uKGl0ZW0sIHByb3BlcnR5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuc2xpY2UoMCwgMSkgIT09IFwiX1wiXG4gICAgICAgICAgICAgICAgICAgICYmICFKdWRnZVV0aWxzLmlzRnVuY3Rpb24oaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIExvZyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW5mbyA9IHtcbiAgICAgICAgICAgIElOVkFMSURfUEFSQU06IFwiaW52YWxpZCBwYXJhbWV0ZXJcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX0FUVFJJQlVURTogXCJhYnN0cmFjdCBhdHRyaWJ1dGUgbmVlZCBvdmVycmlkZVwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfTUVUSE9EOiBcImFic3RyYWN0IG1ldGhvZCBuZWVkIG92ZXJyaWRlXCIsXG5cbiAgICAgICAgICAgIGhlbHBlckZ1bmM6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcodmFsKSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNzZXJ0aW9uOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVscGVyRnVuYyhhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3VtZW50cy5sZW5ndGggbXVzdCA8PSAzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIEZVTkNfSU5WQUxJRDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwiaW52YWxpZFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX05PVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBub3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1NIT1VMRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwic2hvdWxkXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwic3VwcG9ydFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfU1VQUE9SVDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm5vdCBzdXBwb3J0XCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfREVGSU5FOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwibXVzdCBkZWZpbmVcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwibXVzdCBub3QgZGVmaW5lXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VOS05PVzogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInVua25vd1wiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19FWFBFQ1Q6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJleHBlY3RcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJ1bmV4cGVjdGVkXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3V0cHV0IERlYnVnIG1lc3NhZ2UuXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBsb2cobWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKGNvbnNvbGUuYXNzZXJ0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoY29uZCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbmQgJiYgbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgbWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4ge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46QXJyYXk8VD4gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzpGdW5jdGlvbnxUKTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuX2NoaWxkcmVuLCAoYywgaSkgID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMoYywgaSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGlsZCA9IDxhbnk+YXJndW1lbnRzWzBdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbih0aGlzLl9jaGlsZHJlbiwgKGMsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgfHwgKGMudWlkICYmIGNoaWxkLnVpZCAmJiBjLnVpZCA9PT0gY2hpbGQudWlkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGQoaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkOlQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goY2hpbGQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbihhcmc6QXJyYXk8VD58Q29sbGVjdGlvbjxUPnxhbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzQXJyYXkoYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbjpBcnJheTxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgQ29sbGVjdGlvbil7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuOkNvbGxlY3Rpb248VD4gPSBhcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmNvbmNhdChjaGlsZHJlbi50b0FycmF5KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkOmFueSA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVBbGxDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGZvckVhY2goZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKHRoaXMuX2NoaWxkcmVuLCBmdW5jLCBjb250ZXh0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmlsdGVyKGZ1bmMpOkNvbGxlY3Rpb248VD4ge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0OkFycmF5PFQ+ID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2godGhpcy5fY2hpbGRyZW4sICh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy9wdWJsaWMgY29weSAoKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuX2NoaWxkcmVuKTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIHB1YmxpYyByZXZlcnNlICgpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnJldmVyc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRyZW4sIGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYXJnLnVpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuX2NoaWxkcmVuLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRyZW4sICAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZSA9PT0gYXJnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzb3J0KGZ1bmMpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4uc29ydChmdW5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcCh0aGlzLl9jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaW5kZXhPZihhcnI6YW55W10sIGFyZzphbnkpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAtMTtcblxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSA8RnVuY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZnVuYy5jYWxsKG51bGwsIHZhbHVlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSzsgICAvL+WmguaenOWMheWQq++8jOWImee9rui/lOWbnuWAvOS4unRydWUs6Lez5Ye65b6q546vXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSA8YW55PmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAodmFsdWUuY29udGFpbiAmJiB2YWx1ZS5jb250YWluKHZhbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAodmFsdWUuaW5kZXhPZiAmJiB2YWx1ZS5pbmRleE9mKHZhbCkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRCUkVBSzsgICAvL+WmguaenOWMheWQq++8jOWImee9rui/lOWbnuWAvOS4unRydWUs6Lez5Ye65b6q546vXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NvbnRhaW4oYXJyOlRbXSwgYXJnOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2YoYXJyLCBhcmcpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9mb3JFYWNoKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gY29udGV4dCB8fCB3aW5kb3csXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChzY29wZSwgYXJyW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX21hcChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyhlLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2UgJiYgZVtoYW5kbGVyTmFtZV0gJiYgZVtoYW5kbGVyTmFtZV0uYXBwbHkoY29udGV4dCB8fCBlLCB2YWx1ZUFycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHJlc3VsdEFycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmVDaGlsZChhcnI6VFtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuX2luZGV4T2YoYXJyLCAoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFmdW5jLmNhbGwoc2VsZiwgZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9pZiAoaW5kZXggIT09IG51bGwgJiYgaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2ZpbHRlciAoYXJyLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgRG9tUXVlcnkge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb21TdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoZG9tU3RyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6YW55ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihkb21TdHIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRG9tKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW2FyZ3VtZW50c1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb21TdHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9