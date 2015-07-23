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
                this._children[key].addChild(value);
            }
            else {
                this._children[key] = dyCb.Collection.create().addChild(value);
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
            this._filter = function (arr, func, context) {
                var scope = context || window, result = [];
                this._forEach(arr, function (value, index) {
                    if (!func.call(scope, value, index)) {
                        return;
                    }
                    result.push(value);
                });
                return Collection.create(result);
            };
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
            return this._filter(this._children, func, this._children);
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
        //public reverse () {
        //    this._children.reverse();
        //}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC9Db25zdC50cyIsIkhhc2gudHMiLCJ1dGlscy9KdWRnZVV0aWxzLnRzIiwidXRpbHMvQWpheFV0aWxzLnRzIiwidXRpbHMvQ29udmVydFV0aWxzLnRzIiwidXRpbHMvRXZlbnRVdGlscy50cyIsInV0aWxzL0V4dGVuZFV0aWxzLnRzIiwiTG9nLnRzIiwiQ29sbGVjdGlvbi50cyIsInV0aWxzL0RvbVF1ZXJ5LnRzIl0sIm5hbWVzIjpbImR5Q2IiLCJkeUNiLkhhc2giLCJkeUNiLkhhc2guY29uc3RydWN0b3IiLCJkeUNiLkhhc2guY3JlYXRlIiwiZHlDYi5IYXNoLmdldENoaWxkcmVuIiwiZHlDYi5IYXNoLmdldENvdW50IiwiZHlDYi5IYXNoLmdldEtleXMiLCJkeUNiLkhhc2guZ2V0Q2hpbGQiLCJkeUNiLkhhc2guYWRkQ2hpbGQiLCJkeUNiLkhhc2guYXBwZW5kQ2hpbGQiLCJkeUNiLkhhc2gucmVtb3ZlQ2hpbGQiLCJkeUNiLkhhc2guaGFzQ2hpbGQiLCJkeUNiLkhhc2guZm9yRWFjaCIsImR5Q2IuSGFzaC5maWx0ZXIiLCJkeUNiLkhhc2gubWFwIiwiZHlDYi5KdWRnZVV0aWxzIiwiZHlDYi5KdWRnZVV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5KdWRnZVV0aWxzLmlzQXJyYXkiLCJkeUNiLkp1ZGdlVXRpbHMuaXNGdW5jdGlvbiIsImR5Q2IuSnVkZ2VVdGlscy5pc051bWJlciIsImR5Q2IuSnVkZ2VVdGlscy5pc1N0cmluZyIsImR5Q2IuSnVkZ2VVdGlscy5pc0RvbSIsImR5Q2IuSnVkZ2VVdGlscy5pc0RpcmVjdE9iamVjdCIsImR5Q2IuSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QiLCJkeUNiLkFqYXhVdGlscyIsImR5Q2IuQWpheFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5BamF4VXRpbHMuYWpheCIsImR5Q2IuQWpheFV0aWxzLl9jcmVhdGVBamF4IiwiZHlDYi5BamF4VXRpbHMuX2lzTG9jYWxGaWxlIiwiZHlDYi5BamF4VXRpbHMuX2lzU291bmRGaWxlIiwiZHlDYi5Db252ZXJ0VXRpbHMiLCJkeUNiLkNvbnZlcnRVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQ29udmVydFV0aWxzLnRvU3RyaW5nIiwiZHlDYi5Db252ZXJ0VXRpbHMuX2NvbnZlcnRDb2RlVG9TdHJpbmciLCJkeUNiLkV2ZW50VXRpbHMiLCJkeUNiLkV2ZW50VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV2ZW50VXRpbHMuYmluZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLmFkZEV2ZW50IiwiZHlDYi5FdmVudFV0aWxzLnJlbW92ZUV2ZW50IiwiZHlDYi5FeHRlbmRVdGlscyIsImR5Q2IuRXh0ZW5kVXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZERlZXAiLCJkeUNiLkV4dGVuZFV0aWxzLmV4dGVuZCIsImR5Q2IuRXh0ZW5kVXRpbHMuY29weVB1YmxpY0F0dHJpIiwiZHlDYi5Mb2ciLCJkeUNiLkxvZy5jb25zdHJ1Y3RvciIsImR5Q2IuTG9nLmxvZyIsImR5Q2IuTG9nLmFzc2VydCIsImR5Q2IuTG9nLmVycm9yIiwiZHlDYi5Db2xsZWN0aW9uIiwiZHlDYi5Db2xsZWN0aW9uLmNvbnN0cnVjdG9yIiwiZHlDYi5Db2xsZWN0aW9uLmNyZWF0ZSIsImR5Q2IuQ29sbGVjdGlvbi5nZXRDb3VudCIsImR5Q2IuQ29sbGVjdGlvbi5oYXNDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5nZXRDaGlsZHJlbiIsImR5Q2IuQ29sbGVjdGlvbi5nZXRDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5hZGRDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5hZGRDaGlsZHJlbiIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVBbGxDaGlsZHJlbiIsImR5Q2IuQ29sbGVjdGlvbi5mb3JFYWNoIiwiZHlDYi5Db2xsZWN0aW9uLmZpbHRlciIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVDaGlsZCIsImR5Q2IuQ29sbGVjdGlvbi5zb3J0IiwiZHlDYi5Db2xsZWN0aW9uLm1hcCIsImR5Q2IuQ29sbGVjdGlvbi50b0FycmF5IiwiZHlDYi5Db2xsZWN0aW9uLl9pbmRleE9mIiwiZHlDYi5Db2xsZWN0aW9uLl9jb250YWluIiwiZHlDYi5Db2xsZWN0aW9uLl9mb3JFYWNoIiwiZHlDYi5Db2xsZWN0aW9uLl9tYXAiLCJkeUNiLkNvbGxlY3Rpb24uX3JlbW92ZUNoaWxkIiwiZHlDYi5Eb21RdWVyeSIsImR5Q2IuRG9tUXVlcnkuY29uc3RydWN0b3IiLCJkeUNiLkRvbVF1ZXJ5LmNyZWF0ZSIsImR5Q2IuRG9tUXVlcnkuZ2V0Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLElBQUksQ0FLVjtBQUxELFdBQU8sSUFBSSxFQUFBLENBQUM7SUFDS0EsV0FBTUEsR0FBR0E7UUFDbEJBLEtBQUtBLEVBQUNBLElBQUlBO0tBQ2JBLENBQUNBO0lBQ1dBLFlBQU9BLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBO0FBQ2xDQSxDQUFDQSxFQUxNLElBQUksS0FBSixJQUFJLFFBS1Y7O0FDTEQsd0NBQXdDO0FBQ3hDLElBQU8sSUFBSSxDQW1LVjtBQW5LRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBQ1RBO1FBT0lDLGNBQVlBLFFBQWlCQTtZQUFqQkMsd0JBQWlCQSxHQUFqQkEsYUFBaUJBO1lBSXJCQSxjQUFTQSxHQUFPQSxJQUFJQSxDQUFDQTtZQUh6QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDOUJBLENBQUNBO1FBUmFELFdBQU1BLEdBQXBCQSxVQUFxQkEsUUFBYUE7WUFBYkUsd0JBQWFBLEdBQWJBLGFBQWFBO1lBQzlCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUU3QkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDZkEsQ0FBQ0E7UUFRTUYsMEJBQVdBLEdBQWxCQTtZQUNJRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7UUFFTUgsdUJBQVFBLEdBQWZBO1lBQ0lJLElBQUlB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VUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xDQSxJQUFJQSxJQUFJQSxHQUFhQSxHQUFHQSxFQUNwQkEsTUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBRWhCQSxnREFBZ0RBO2dCQUNoREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0E7b0JBQ2xCQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTt3QkFDZkEsTUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsU0FBU0EsQ0FBQ0E7d0JBQ2hDQSxPQUFPQSxNQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDL0JBLENBQUNBO2dCQUNMQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNQQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFFTVQsdUJBQVFBLEdBQWZBLFVBQWdCQSxHQUFPQTtZQUNuQlUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RDQSxJQUFJQSxJQUFJQSxHQUFhQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUM3QkEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBRW5CQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFDQSxHQUFHQSxFQUFFQSxHQUFHQTtvQkFDbEJBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO3dCQUNmQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTt3QkFDZEEsTUFBTUEsQ0FBQ0EsV0FBTUEsQ0FBQ0E7b0JBQ2xCQSxDQUFDQTtnQkFDTEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRUhBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1lBQ2xCQSxDQUFDQTtZQUVEQSxJQUFJQSxHQUFHQSxHQUFXQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUvQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDakNBLENBQUNBO1FBR01WLHNCQUFPQSxHQUFkQSxVQUFlQSxJQUFhQSxFQUFFQSxPQUFZQTtZQUN0Q1csSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsRUFDUkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFFOUJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxXQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaERBLEtBQUtBLENBQUNBO29CQUNWQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBRU1YLHFCQUFNQSxHQUFiQSxVQUFjQSxJQUFhQTtZQUN2QlksSUFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsRUFDWEEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFFM0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBO2dCQUNsQkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7b0JBQzVCQSxNQUFNQSxDQUFDQTtnQkFDWEEsQ0FBQ0E7Z0JBRURBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ3RCQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVIQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7UUFFTVosa0JBQUdBLEdBQVZBLFVBQVdBLElBQWFBO1lBQ3BCYSxJQUFJQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUVuQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0E7Z0JBQ2xCQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFFNUJBLEVBQUVBLENBQUFBLENBQUNBLE1BQU1BLEtBQUtBLFlBQU9BLENBQUNBLENBQUFBLENBQUNBO29CQUNuQkEsUUFBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsZUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsTUFBTUEsS0FBS0EsQ0FBQ0EsRUFBRUEsUUFBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRWpIQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckNBLENBQUNBO1lBQ0xBLENBQUNBLENBQUNBLENBQUNBO1lBRUhBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQ2xDQSxDQUFDQTtRQUNMYixXQUFDQTtJQUFEQSxDQWpLQUQsQUFpS0NDLElBQUFEO0lBaktZQSxTQUFJQSxPQWlLaEJBLENBQUFBO0FBQ0xBLENBQUNBLEVBbktNLElBQUksS0FBSixJQUFJLFFBbUtWOztBQ3BLRCxJQUFPLElBQUksQ0FzRFY7QUF0REQsV0FBTyxJQUFJLEVBQUMsQ0FBQztJQUNUQTtRQUFBZTtRQW9EQUMsQ0FBQ0E7UUFuRGlCRCxrQkFBT0EsR0FBckJBLFVBQXNCQSxHQUFHQTtZQUNyQkUsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsZ0JBQWdCQSxDQUFDQTtRQUNwRUEsQ0FBQ0E7UUFFYUYscUJBQVVBLEdBQXhCQSxVQUF5QkEsSUFBSUE7WUFDekJHLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLG1CQUFtQkEsQ0FBQ0E7UUFDeEVBLENBQUNBO1FBRWFILG1CQUFRQSxHQUF0QkEsVUFBdUJBLEdBQUdBO1lBQ3RCSSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxpQkFBaUJBLENBQUNBO1FBQ3JFQSxDQUFDQTtRQUVhSixtQkFBUUEsR0FBdEJBLFVBQXVCQSxHQUFHQTtZQUN0QkssTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsaUJBQWlCQSxDQUFDQTtRQUNyRUEsQ0FBQ0E7UUFFYUwsZ0JBQUtBLEdBQW5CQSxVQUFvQkEsR0FBR0E7WUFDbkJNLE1BQU1BLENBQUNBLEdBQUdBLFlBQVlBLFdBQVdBLENBQUNBO1FBQ3RDQSxDQUFDQTtRQUVETjs7V0FFR0E7UUFDV0EseUJBQWNBLEdBQTVCQSxVQUE2QkEsR0FBR0E7WUFDNUJPLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNoQkEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBO1FBRURQOzs7Ozs7Ozs7Ozs7V0FZR0E7UUFDV0EsdUJBQVlBLEdBQTFCQSxVQUEyQkEsTUFBTUEsRUFBRUEsUUFBUUE7WUFDdkNRLElBQUlBLElBQUlBLEdBQUdBLE9BQU9BLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1lBRW5DQSxNQUFNQSxDQUFDQSxJQUFJQSxLQUFLQSxVQUFVQTtnQkFDdEJBLENBQUNBLElBQUlBLEtBQUtBLFFBQVFBLElBQUlBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUN6Q0EsSUFBSUEsS0FBS0EsU0FBU0EsQ0FBQ0E7UUFDM0JBLENBQUNBO1FBQ0xSLGlCQUFDQTtJQUFEQSxDQXBEQWYsQUFvRENlLElBQUFmO0lBcERZQSxlQUFVQSxhQW9EdEJBLENBQUFBO0FBQ0xBLENBQUNBLEVBdERNLElBQUksS0FBSixJQUFJLFFBc0RWOztBQ3RERCxJQUFPLElBQUksQ0E0R1Y7QUE1R0QsV0FBTyxJQUFJLEVBQUEsQ0FBQztJQUdSQTtRQUFBd0I7UUF3R0FDLENBQUNBO1FBdkdHRDs7Ozs7Ozs7Ozs7Y0FXTUE7UUFDUUEsY0FBSUEsR0FBbEJBLFVBQW1CQSxJQUFJQTtZQUNuQkUsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUEsV0FBV0E7WUFDaENBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUFBLFVBQVVBO1lBQzdCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQSx1QkFBdUJBO1lBQzVDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFBQSxjQUFjQTtZQUMzQ0EsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQUEsUUFBUUE7WUFDbkNBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3ZCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNmQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUVoQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hCQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNqQkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUN0QkEsQ0FBQ0E7WUFFREEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNQQSxNQUFNQSxDQUFDQTtZQUNYQSxDQUFDQTtZQUVEQSxJQUFJQSxDQUFDQTtnQkFDREEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBRTFCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDOUJBLEdBQUdBLENBQUNBLFlBQVlBLEdBQUdBLGFBQWFBLENBQUNBO2dCQUNyQ0EsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLEtBQUtBLElBQUlBLElBQUlBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO29CQUNuQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ25CQSxDQUFDQTtnQkFDREEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsTUFBTUEsSUFBSUEsSUFBSUEsS0FBS0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGNBQWNBLEVBQUVBLG1DQUFtQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFFQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDbkJBLENBQUNBO2dCQUVEQSxHQUFHQSxDQUFDQSxrQkFBa0JBLEdBQUdBO29CQUNyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLENBQUM7MkJBRWpCLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQzdDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUM5QixDQUFDO3dCQUNMLENBQUM7d0JBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxLQUFLLElBQUksUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUM3QixDQUFDO3dCQUNMLENBQUM7d0JBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ2xELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2hELENBQUM7d0JBQ0wsQ0FBQzt3QkFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ25DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUMxQixDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDLENBQUNBO1lBQ05BLENBQ0FBO1lBQUFBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNQQSxLQUFLQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFY0YscUJBQVdBLEdBQTFCQSxVQUEyQkEsS0FBS0E7WUFDNUJHLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2ZBLElBQUlBLENBQUNBO2dCQUNEQSxHQUFHQSxHQUFHQSxJQUFJQSxhQUFhQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBO1lBQ2pEQSxDQUFFQTtZQUFBQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsSUFBSUEsQ0FBQ0E7b0JBQ0RBLEdBQUdBLEdBQUdBLElBQUlBLGNBQWNBLEVBQUVBLENBQUNBO2dCQUMvQkEsQ0FBRUE7Z0JBQUFBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUNWQSxLQUFLQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFDQSxPQUFPQSxFQUFFQSxtQkFBbUJBLEVBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ2hCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNmQSxDQUFDQTtRQUVjSCxzQkFBWUEsR0FBM0JBLFVBQTRCQSxNQUFNQTtZQUM5QkksTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsTUFBTUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDM0RBLENBQUNBO1FBRWNKLHNCQUFZQSxHQUEzQkEsVUFBNEJBLFFBQVFBO1lBQ2hDSyxNQUFNQSxDQUFDQSxRQUFRQSxLQUFLQSxhQUFhQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7UUFDTEwsZ0JBQUNBO0lBQURBLENBeEdBeEIsQUF3R0N3QixJQUFBeEI7SUF4R1lBLGNBQVNBLFlBd0dyQkEsQ0FBQUE7QUFDTEEsQ0FBQ0EsRUE1R00sSUFBSSxLQUFKLElBQUksUUE0R1Y7O0FDNUdELDJDQUEyQztBQUMzQyxJQUFPLElBQUksQ0FzQlY7QUF0QkQsV0FBTyxJQUFJLEVBQUEsQ0FBQztJQUNSQTtRQUFBOEI7UUFvQkFDLENBQUNBO1FBbkJpQkQscUJBQVFBLEdBQXRCQSxVQUF1QkEsR0FBT0E7WUFDMUJFLEVBQUVBLENBQUNBLENBQUNBLGVBQVVBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLENBQUNBO1lBQ0RBLGlDQUFpQ0E7WUFDakNBLDhCQUE4QkE7WUFDOUJBLEdBQUdBO1lBQ0hBLEVBQUVBLENBQUNBLENBQUNBLGVBQVVBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUMxQ0EsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsZUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLENBQUNBO1FBRWNGLGlDQUFvQkEsR0FBbkNBLFVBQW9DQSxFQUFFQTtZQUNsQ0csTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDcEVBLENBQUNBO1FBQ0xILG1CQUFDQTtJQUFEQSxDQXBCQTlCLEFBb0JDOEIsSUFBQTlCO0lBcEJZQSxpQkFBWUEsZUFvQnhCQSxDQUFBQTtBQUNMQSxDQUFDQSxFQXRCTSxJQUFJLEtBQUosSUFBSSxRQXNCVjs7QUN2QkQsMkNBQTJDO0FBQzNDLElBQU8sSUFBSSxDQXFDVjtBQXJDRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBQ1RBLHlCQUF5QkE7SUFDekJBO1FBQUFrQztRQWtDQUMsQ0FBQ0E7UUFqQ2lCRCxvQkFBU0EsR0FBdkJBLFVBQXdCQSxPQUFPQSxFQUFFQSxJQUFJQTtZQUNqQ0Usc0RBQXNEQTtZQUN0REEsa0JBQWtCQTtZQUVsQkEsTUFBTUEsQ0FBQ0EsVUFBVUEsS0FBS0E7Z0JBQ2xCLDZFQUE2RTtnQkFDN0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQUE7UUFDTEEsQ0FBQ0E7UUFFYUYsbUJBQVFBLEdBQXRCQSxVQUF1QkEsR0FBR0EsRUFBRUEsU0FBU0EsRUFBRUEsT0FBT0E7WUFDMUNHLEVBQUVBLENBQUNBLENBQUNBLGVBQVVBLENBQUNBLFlBQVlBLENBQUNBLEdBQUdBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFNBQVNBLEVBQUVBLE9BQU9BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBQ3BEQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxlQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxFQUFFQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLEdBQUdBLFNBQVNBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBO1lBQy9DQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDRkEsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBR0EsU0FBU0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0E7WUFDcENBLENBQUNBO1FBQ0xBLENBQUNBO1FBRWFILHNCQUFXQSxHQUF6QkEsVUFBMEJBLEdBQUdBLEVBQUVBLFNBQVNBLEVBQUVBLE9BQU9BO1lBQzdDSSxFQUFFQSxDQUFDQSxDQUFDQSxlQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxFQUFFQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0REEsR0FBR0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxTQUFTQSxFQUFFQSxPQUFPQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN2REEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsRUFBRUEsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxHQUFHQSxTQUFTQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUMvQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0ZBLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLFNBQVNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pDQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUNMSixpQkFBQ0E7SUFBREEsQ0FsQ0FsQyxBQWtDQ2tDLElBQUFsQztJQWxDWUEsZUFBVUEsYUFrQ3RCQSxDQUFBQTtBQUNMQSxDQUFDQSxFQXJDTSxJQUFJLEtBQUosSUFBSSxRQXFDVjs7QUN0Q0QsMkNBQTJDO0FBQzNDLElBQU8sSUFBSSxDQWdIVjtBQWhIRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBQ1RBO1FBQUF1QztRQThHQUMsQ0FBQ0E7UUE3R0dEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQWdDR0E7UUFDV0Esc0JBQVVBLEdBQXhCQSxVQUF5QkEsTUFBTUEsRUFBRUEsS0FBTUEsRUFBQ0EsTUFBcUNBO1lBQXJDRSxzQkFBcUNBLEdBQXJDQSxtQkFBZ0JBLEdBQUdBLEVBQUVBLENBQUNBLElBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUM7WUFDekVBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLEVBQ1JBLEdBQUdBLEdBQUdBLENBQUNBLEVBQ1BBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEVBQ2pDQSxJQUFJQSxHQUFHQSxnQkFBZ0JBLEVBQ3ZCQSxHQUFHQSxHQUFHQSxpQkFBaUJBLEVBQ3ZCQSxJQUFJQSxHQUFHQSxFQUFFQSxFQUNUQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUVsQkEsc0JBQXNCQTtZQUN0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxNQUFNQSxHQUFHQSxLQUFLQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFFckJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUM1Q0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7d0JBQ3RCQSxRQUFRQSxDQUFDQTtvQkFDYkEsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxJQUFJQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDcENBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUdEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbENBLE1BQU1BLEdBQUdBLEtBQUtBLElBQUlBLEVBQUVBLENBQUNBO2dCQUVyQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO3dCQUN0QkEsUUFBUUEsQ0FBQ0E7b0JBQ2JBLENBQUNBO29CQUVEQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLElBQUlBLElBQUlBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsS0FBS0EsSUFBSUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0NBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0ZBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO1lBQ3BCQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFREY7O1dBRUdB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Q2pDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0ZBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLFFBQVFBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDbkRBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQWpCYUQsZUFBTUEsR0FBcEJBLFVBQXFCQSxNQUFhQTtZQUM5QkUsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFFM0JBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO1FBQ2ZBLENBQUNBO1FBZU1GLHNCQUFHQSxHQUFWQSxVQUFXQSxLQUFLQTtZQUNaRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7UUFDTEgsZUFBQ0E7SUFBREEsQ0F2QkF0RSxBQXVCQ3NFLElBQUF0RTtJQXZCWUEsYUFBUUEsV0F1QnBCQSxDQUFBQTtBQUNMQSxDQUFDQSxFQXpCTSxJQUFJLEtBQUosSUFBSSxRQXlCViIsImZpbGUiOiJkeUNiLmRlYnVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGR5Q2J7XG4gICAgZXhwb3J0IGNvbnN0ICRCUkVBSyA9IHtcbiAgICAgICAgYnJlYWs6dHJ1ZVxuICAgIH07XG4gICAgZXhwb3J0IGNvbnN0ICRSRU1PVkUgPSB2b2lkIDA7XG59XG5cblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEhhc2gge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShjaGlsZHJlbiA9IHt9KXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhjaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjphbnkgPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46YW55ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRLZXlzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGtleTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIC8vaWYgKEp1ZGdlVXRpbHMuaXNBcnJheSh0aGlzLl9jaGlsZHJlbltrZXldKSkge1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fY2hpbGRyZW5ba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9lbHNlIHtcbiAgICAgICAgICAgIC8vICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSBbdmFsdWVdO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW5ba2V5XSBpbnN0YW5jZW9mIENvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldLmFkZENoaWxkKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLmFkZENoaWxkKHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzU3RyaW5nKGFyZykpe1xuICAgICAgICAgICAgICAgIGxldCBrZXkgPSA8c3RyaW5nPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvL3JldHVybiB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLl9jaGlsZHJlbiwgYXJnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NoaWxkcmVuW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChhcmc6YW55KTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX2NoaWxkcmVuW2tleV07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSl7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChpIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jLmNhbGwoY29udGV4dCwgY2hpbGRyZW5baV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHJlbjtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdE1hcCA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmModmFsLCBrZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgTG9nLmVycm9yKCFKdWRnZVV0aWxzLmlzQXJyYXkocmVzdWx0KSB8fCByZXN1bHQubGVuZ3RoICE9PSAyLCBMb2cuaW5mby5GVU5DX01VU1RfQkUoXCJpdGVyYXRvclwiLCBcIltrZXksIHZhbHVlXVwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwW3Jlc3VsdFswXV0gPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBIYXNoLmNyZWF0ZShyZXN1bHRNYXApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbiIsIm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgSnVkZ2VVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheSh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOdW1iZXIob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdHIpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RvbShvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKTmlq3mmK/lkKbkuLrlr7nosaHlrZfpnaLph4/vvIh7fe+8iVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RpcmVjdE9iamVjdChvYmopIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5qOA5p+l5a6/5Li75a+56LGh5piv5ZCm5Y+v6LCD55SoXG4gICAgICAgICAqXG4gICAgICAgICAqIOS7u+S9leWvueixoe+8jOWmguaenOWFtuivreS5ieWcqEVDTUFTY3JpcHTop4TojIPkuK3ooqvlrprkuYnov4fvvIzpgqPkuYjlroPooqvnp7DkuLrljp/nlJ/lr7nosaHvvJtcbiAgICAgICAgIOeOr+Wig+aJgOaPkOS+m+eahO+8jOiAjOWcqEVDTUFTY3JpcHTop4TojIPkuK3msqHmnInooqvmj4/ov7DnmoTlr7nosaHvvIzmiJHku6znp7DkuYvkuLrlrr/kuLvlr7nosaHjgIJcblxuICAgICAgICAg6K+l5pa55rOV55So5LqO54m55oCn5qOA5rWL77yM5Yik5pat5a+56LGh5piv5ZCm5Y+v55So44CC55So5rOV5aaC5LiL77yaXG5cbiAgICAgICAgIE15RW5naW5lIGFkZEV2ZW50KCk6XG4gICAgICAgICBpZiAoVG9vbC5qdWRnZS5pc0hvc3RNZXRob2QoZG9tLCBcImFkZEV2ZW50TGlzdGVuZXJcIikpIHsgICAgLy/liKTmlq1kb23mmK/lkKblhbfmnIlhZGRFdmVudExpc3RlbmVy5pa55rOVXG4gICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihzRXZlbnRUeXBlLCBmbkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNIb3N0TWV0aG9kKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iamVjdFtwcm9wZXJ0eV0pIHx8XG4gICAgICAgICAgICAgICAgdHlwZSA9PT0gXCJ1bmtub3duXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgZHlDYntcbiAgICBkZWNsYXJlIHZhciBkb2N1bWVudDphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgQWpheFV0aWxze1xuICAgICAgICAvKiFcbiAgICAgICAgIOWunueOsGFqYXhcblxuICAgICAgICAgYWpheCh7XG4gICAgICAgICB0eXBlOlwicG9zdFwiLC8vcG9zdOaIluiAhWdldO+8jOmdnuW/hemhu1xuICAgICAgICAgdXJsOlwidGVzdC5qc3BcIiwvL+W/hemhu+eahFxuICAgICAgICAgZGF0YTpcIm5hbWU9ZGlwb28maW5mbz1nb29kXCIsLy/pnZ7lv4XpobtcbiAgICAgICAgIGRhdGFUeXBlOlwianNvblwiLC8vdGV4dC94bWwvanNvbu+8jOmdnuW/hemhu1xuICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXsvL+Wbnuiwg+WHveaVsO+8jOmdnuW/hemhu1xuICAgICAgICAgYWxlcnQoZGF0YS5uYW1lKTtcbiAgICAgICAgIH1cbiAgICAgICAgIH0pOyovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWpheChjb25mKXtcbiAgICAgICAgICAgIHZhciB0eXBlID0gY29uZi50eXBlOy8vdHlwZeWPguaVsCzlj6/pgIlcbiAgICAgICAgICAgIHZhciB1cmwgPSBjb25mLnVybDsvL3VybOWPguaVsO+8jOW/heWhq1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBjb25mLmRhdGE7Ly9kYXRh5Y+C5pWw5Y+v6YCJ77yM5Y+q5pyJ5ZyocG9zdOivt+axguaXtumcgOimgVxuICAgICAgICAgICAgdmFyIGRhdGFUeXBlID0gY29uZi5kYXRhVHlwZTsvL2RhdGF0eXBl5Y+C5pWw5Y+v6YCJXG4gICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNvbmYuc3VjY2VzczsvL+Wbnuiwg+WHveaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIGVycm9yID0gY29uZi5lcnJvcjtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gbnVsbCkgey8vdHlwZeWPguaVsOWPr+mAie+8jOm7mOiupOS4umdldFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcImdldFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBudWxsKSB7Ly9kYXRhVHlwZeWPguaVsOWPr+mAie+8jOm7mOiupOS4unRleHRcbiAgICAgICAgICAgICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIgPSB0aGlzLl9jcmVhdGVBamF4KGVycm9yKTtcbiAgICAgICAgICAgIGlmICgheGhyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKHR5cGUsIHVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNTb3VuZEZpbGUoZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiR0VUXCIgfHwgdHlwZSA9PT0gXCJnZXRcIikge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gXCJQT1NUXCIgfHwgdHlwZSA9PT0gXCJwb3N0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJjb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6cYWpheOiuv+mXrueahOaYr+acrOWcsOaWh+S7tu+8jOWImXN0YXR1c+S4ujBcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICh4aHIuc3RhdHVzID09PSAyMDAgfHwgc2VsZi5faXNMb2NhbEZpbGUoeGhyLnN0YXR1cykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09IFwidGV4dFwiIHx8IGRhdGFUeXBlID09PSBcIlRFWFRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/mma7pgJrmlofmnKxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJ4bWxcIiB8fCBkYXRhVHlwZSA9PT0gXCJYTUxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/mjqXmlLZ4bWzmlofmoaNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2VYTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSBcImpzb25cIiB8fCBkYXRhVHlwZSA9PT0gXCJKU09OXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoZXZhbChcIihcIiArIHhoci5yZXNwb25zZVRleHQgKyBcIilcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICE9PSBudWxsKSB7Ly/lsIZqc29u5a2X56ym5Liy6L2s5o2i5Li6anPlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzcyh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9yKHhociwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfY3JlYXRlQWpheChlcnJvcikge1xuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XG4gICAgICAgICAgICB0cnkgey8vSUXns7vliJfmtY/op4jlmahcbiAgICAgICAgICAgICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdChcIm1pY3Jvc29mdC54bWxodHRwXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTEpIHtcbiAgICAgICAgICAgICAgICB0cnkgey8v6Z2eSUXmtY/op4jlmahcbiAgICAgICAgICAgICAgICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoeGhyLCB7bWVzc2FnZTogXCLmgqjnmoTmtY/op4jlmajkuI3mlK/mjIFhamF477yM6K+35pu05o2i77yBXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHhocjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc0xvY2FsRmlsZShzdGF0dXMpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5VUkwuY29udGFpbihcImZpbGU6Ly9cIikgJiYgc3RhdHVzID09PSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2lzU291bmRGaWxlKGRhdGFUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVR5cGUgPT09IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2J7XG4gICAgZXhwb3J0IGNsYXNzIENvbnZlcnRVdGlsc3tcbiAgICAgICAgcHVibGljIHN0YXRpYyB0b1N0cmluZyhvYmo6YW55KXtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzTnVtYmVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2lmIChKdWRnZVV0aWxzLmlzalF1ZXJ5KG9iaikpIHtcbiAgICAgICAgICAgIC8vICAgIHJldHVybiBfanFUb1N0cmluZyhvYmopO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udmVydENvZGVUb1N0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEaXJlY3RPYmplY3Qob2JqKSB8fCBKdWRnZVV0aWxzLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NvbnZlcnRDb2RlVG9TdHJpbmcoZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbi50b1N0cmluZygpLnNwbGl0KCdcXG4nKS5zbGljZSgxLCAtMSkuam9pbignXFxuJykgKyAnXFxuJztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIC8vZGVjbGFyZSB2YXIgd2luZG93OmFueTtcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmluZEV2ZW50KGNvbnRleHQsIGZ1bmMpIHtcbiAgICAgICAgICAgIC8vdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgICAgICAgLy8gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiBmdW4uYXBwbHkob2JqZWN0LCBbc2VsZi53cmFwRXZlbnQoZXZlbnQpXS5jb25jYXQoYXJncykpOyAvL+WvueS6i+S7tuWvueixoei/m+ihjOWMheijhVxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBhZGRFdmVudChkb20sIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYXR0YWNoRXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICBkb20uYXR0YWNoRXZlbnQoXCJvblwiICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVtcIm9uXCIgKyBldmVudE5hbWVdID0gaGFuZGxlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImRldGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmRldGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5kVXRpbHMge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rex5ou36LSdXG4gICAgICAgICAqXG4gICAgICAgICAqIOekuuS+i++8mlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrmlbDnu4TvvIzog73lpJ/miJDlip/mi7fotJ3vvIjkuI3mi7fotJ1BcnJheeWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiBleHBlY3QoZXh0ZW5kLmV4dGVuZERlZXAoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pKS50b0VxdWFsKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKTtcbiAgICAgICAgICpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65a+56LGh77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI6IO95ou36LSd5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICAgZnVuY3Rpb24gQSgpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEEucHJvdG90eXBlLmEgPSAxO1xuXG4gICAgICAgICBmdW5jdGlvbiBCKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQi5wcm90b3R5cGUgPSBuZXcgQSgpO1xuICAgICAgICAgQi5wcm90b3R5cGUuYiA9IHsgeDogMSwgeTogMSB9O1xuICAgICAgICAgQi5wcm90b3R5cGUuYyA9IFt7IHg6IDEgfSwgWzJdXTtcblxuICAgICAgICAgdmFyIHQgPSBuZXcgQigpO1xuXG4gICAgICAgICByZXN1bHQgPSBleHRlbmQuZXh0ZW5kRGVlcCh0KTtcblxuICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcbiAgICAgICAgIHtcbiAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgIGI6IHsgeDogMSwgeTogMSB9LFxuICAgICAgICAgICAgIGM6IFt7IHg6IDEgfSwgWzJdXVxuICAgICAgICAgfSk7XG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIGNoaWxkXG4gICAgICAgICAqIEByZXR1cm5zXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZERlZXAocGFyZW50LCBjaGlsZD8sZmlsdGVyPWZ1bmN0aW9uKHZhbCwgaSl7cmV0dXJuIHRydWU7fSkge1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGxlbiA9IDAsXG4gICAgICAgICAgICAgICAgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIHNBcnIgPSBcIltvYmplY3QgQXJyYXldXCIsXG4gICAgICAgICAgICAgICAgc09iID0gXCJbb2JqZWN0IE9iamVjdF1cIixcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJcIixcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBudWxsO1xuXG4gICAgICAgICAgICAvL+aVsOe7hOeahOivne+8jOS4jeiOt+W+l0FycmF55Y6f5Z6L5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzQXJyKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwgW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXJlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/lr7nosaHnmoTor53vvIzopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgILlm6DkuLrogIPomZHku6XkuIvmg4Xmma/vvJpcbiAgICAgICAgICAgIC8v57G7Qee7p+aJv+S6juexu0LvvIznjrDlnKjmg7PopoHmi7fotJ3nsbtB55qE5a6e5L6LYeeahOaIkOWRmO+8iOWMheaLrOS7juexu0Lnu6fmib/mnaXnmoTmiJDlkZjvvInvvIzpgqPkuYjlsLHpnIDopoHojrflvpfljp/lnovpk77kuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc09iKSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gY2hpbGQgfHwge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IHBhcmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9jaGlsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtYXmi7fotJ1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kKGRlc3RpbmF0aW9uOmFueSwgc291cmNlOmFueSkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gXCJcIjtcblxuICAgICAgICAgICAgZm9yIChwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBjb3B5UHVibGljQXR0cmkoc291cmNlOmFueSl7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZXh0ZW5kRGVlcChzb3VyY2UsIGRlc3RpbmF0aW9uLCBmdW5jdGlvbihpdGVtLCBwcm9wZXJ0eSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnNsaWNlKDAsIDEpICE9PSBcIl9cIlxuICAgICAgICAgICAgICAgICAgICAmJiAhSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwibW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9BVFRSSUJVVEU6IFwiYWJzdHJhY3QgYXR0cmlidXRlIG5lZWQgb3ZlcnJpZGVcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX01FVEhPRDogXCJhYnN0cmFjdCBtZXRob2QgbmVlZCBvdmVycmlkZVwiLFxuXG4gICAgICAgICAgICBoZWxwZXJGdW5jOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nKHZhbCkgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2VydGlvbjogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhlbHBlckZ1bmMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudHMubGVuZ3RoIG11c3QgPD0gM1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGVU5DX0lOVkFMSUQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcImludmFsaWRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgICAgIGFyci51bnNoaWZ0KFwibXVzdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcIm11c3Qgbm90IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TVVBQT1JUOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwic3VwcG9ydFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19OT1RfU1VQUE9SVDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm5vdCBzdXBwb3J0XCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfREVGSU5FOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwibXVzdCBkZWZpbmVcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfREVGSU5FOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uKFwibXVzdCBub3QgZGVmaW5lXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VOS05PVzogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInVua25vd1wiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19FWFBFQ1Q6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJleHBlY3RcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5FWFBFQ1Q6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJ1bmV4cGVjdGVkXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3V0cHV0IERlYnVnIG1lc3NhZ2UuXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBsb2cobWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaWreiogOWksei0peaXtu+8jOS8muaPkOekuumUmeivr+S/oeaBr++8jOS9hueoi+W6j+S8mue7p+e7reaJp+ihjOS4i+WOu1xuICAgICAgICAgKiDkvb/nlKjmlq3oqIDmjZXmjYnkuI3lupTor6Xlj5HnlJ/nmoTpnZ7ms5Xmg4XlhrXjgILkuI3opoHmt7fmt4bpnZ7ms5Xmg4XlhrXkuI7plJnor6/mg4XlhrXkuYvpl7TnmoTljLrliKvvvIzlkI7ogIXmmK/lv4XnhLblrZjlnKjnmoTlubbkuJTmmK/kuIDlrpropoHkvZzlh7rlpITnkIbnmoTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogMe+8ieWvuemdnumihOacn+mUmeivr+S9v+eUqOaWreiogFxuICAgICAgICAg5pat6KiA5Lit55qE5biD5bCU6KGo6L6+5byP55qE5Y+N6Z2i5LiA5a6a6KaB5o+P6L+w5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v77yM5LiL6Z2i5omA6L+w55qE5Zyo5LiA5a6a5oOF5Ya15LiL5Li66Z2e6aKE5pyf6ZSZ6K+v55qE5LiA5Lqb5L6L5a2Q77yaXG4gICAgICAgICDvvIgx77yJ56m65oyH6ZKI44CCXG4gICAgICAgICDvvIgy77yJ6L6T5YWl5oiW6ICF6L6T5Ye65Y+C5pWw55qE5YC85LiN5Zyo6aKE5pyf6IyD5Zu05YaF44CCXG4gICAgICAgICDvvIgz77yJ5pWw57uE55qE6LaK55WM44CCXG4gICAgICAgICDpnZ7pooTmnJ/plJnor6/lr7nlupTnmoTlsLHmmK/pooTmnJ/plJnor6/vvIzmiJHku6zpgJrluLjkvb/nlKjplJnor6/lpITnkIbku6PnoIHmnaXlpITnkIbpooTmnJ/plJnor6/vvIzogIzkvb/nlKjmlq3oqIDlpITnkIbpnZ7pooTmnJ/plJnor6/jgILlnKjku6PnoIHmiafooYzov4fnqIvkuK3vvIzmnInkupvplJnor6/msLjov5zkuI3lupTor6Xlj5HnlJ/vvIzov5nmoLfnmoTplJnor6/mmK/pnZ7pooTmnJ/plJnor6/jgILmlq3oqIDlj6/ku6XooqvnnIvmiJDmmK/kuIDnp43lj6/miafooYznmoTms6jph4rvvIzkvaDkuI3og73kvp3otZblroPmnaXorqnku6PnoIHmraPluLjlt6XkvZzvvIjjgIpDb2RlIENvbXBsZXRlIDLjgIvvvInjgILkvovlpoLvvJpcbiAgICAgICAgIGludCBuUmVzID0gZigpOyAvLyBuUmVzIOeUsSBmIOWHveaVsOaOp+WItu+8jCBmIOWHveaVsOS/neivgei/lOWbnuWAvOS4gOWumuWcqCAtMTAwIH4gMTAwXG4gICAgICAgICBBc3NlcnQoLTEwMCA8PSBuUmVzICYmIG5SZXMgPD0gMTAwKTsgLy8g5pat6KiA77yM5LiA5Liq5Y+v5omn6KGM55qE5rOo6YeKXG4gICAgICAgICDnlLHkuo4gZiDlh73mlbDkv53or4Hkuobov5Tlm57lgLzlpITkuo4gLTEwMCB+IDEwMO+8jOmCo+S5iOWmguaenOWHuueOsOS6hiBuUmVzIOS4jeWcqOi/meS4quiMg+WbtOeahOWAvOaXtu+8jOWwseihqOaYjuS4gOS4qumdnumihOacn+mUmeivr+eahOWHuueOsOOAguWQjumdouS8muiusuWIsOKAnOmalOagj+KAne+8jOmCo+aXtuS8muWvueaWreiogOacieabtOWKoOa3seWIu+eahOeQhuino+OAglxuICAgICAgICAgMu+8ieS4jeimgeaKiumcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4rVxuICAgICAgICAg5pat6KiA55So5LqO6L2v5Lu255qE5byA5Y+R5ZKM57u05oqk77yM6ICM6YCa5bi45LiN5Zyo5Y+R6KGM54mI5pys5Lit5YyF5ZCr5pat6KiA44CCXG4gICAgICAgICDpnIDopoHmiafooYznmoTku6PnoIHmlL7lhaXmlq3oqIDkuK3mmK/kuI3mraPnoa7nmoTvvIzlm6DkuLrlnKjlj5HooYzniYjmnKzkuK3vvIzov5nkupvku6PnoIHpgJrluLjkuI3kvJrooqvmiafooYzvvIzkvovlpoLvvJpcbiAgICAgICAgIEFzc2VydChmKCkpOyAvLyBmIOWHveaVsOmAmuW4uOWcqOWPkeihjOeJiOacrOS4reS4jeS8muiiq+aJp+ihjFxuICAgICAgICAg6ICM5L2/55So5aaC5LiL5pa55rOV5YiZ5q+U6L6D5a6J5YWo77yaXG4gICAgICAgICByZXMgPSBmKCk7XG4gICAgICAgICBBc3NlcnQocmVzKTsgLy8g5a6J5YWoXG4gICAgICAgICAz77yJ5a+55p2l5rqQ5LqO5YaF6YOo57O757uf55qE5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM6ICM5LiN6KaB5a+55aSW6YOo5LiN5Y+v6Z2g55qE5pWw5o2u5L2/55So5pat6KiA77yM5a+55LqO5aSW6YOo5LiN5Y+v6Z2g5pWw5o2u77yM5bqU6K+l5L2/55So6ZSZ6K+v5aSE55CG5Luj56CB44CCXG4gICAgICAgICDlho3mrKHlvLrosIPvvIzmiormlq3oqIDnnIvmiJDlj6/miafooYznmoTms6jph4rjgIJcbiAgICAgICAgICogQHBhcmFtIGNvbmQg5aaC5p6cY29uZOi/lOWbnmZhbHNl77yM5YiZ5pat6KiA5aSx6LSl77yM5pi+56S6bWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3NlcnQoY29uZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKGNvbnNvbGUuYXNzZXJ0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoY29uZCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbmQgJiYgbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoY29uZCwgbWVzc2FnZSk6YW55IHtcbiAgICAgICAgICAgIGlmIChjb25kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb24ge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhjaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihjaGlsZHJlbjphbnkgPSBbXSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46YW55W10gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZyk6Ym9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbih0aGlzLl9jaGlsZHJlbiwgKGMsIGkpICA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jKGMsIGkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSA8YW55PmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW4odGhpcy5fY2hpbGRyZW4sIChjLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHx8IChjLnVpZCAmJiBjaGlsZC51aWQgJiYgYy51aWQgPT09IGNoaWxkLnVpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGluZGV4Om51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChjaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKGFyZzphbnlbXXxDb2xsZWN0aW9ufGFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gPGFueVtdPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYXJnIGluc3RhbmNlb2YgQ29sbGVjdGlvbil7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gPENvbGxlY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4udG9BcnJheSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IDxhbnk+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUFsbENoaWxkcmVuKCkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0PzphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2godGhpcy5fY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlcih0aGlzLl9jaGlsZHJlbiwgZnVuYywgdGhpcy5fY2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wdWJsaWMgcmVtb3ZlQ2hpbGRBdCAoaW5kZXgpIHtcbiAgICAgICAgLy8gICAgTG9nLmVycm9yKGluZGV4IDwgMCwgXCLluo/lj7flv4XpobvlpKfkuo7nrYnkuo4wXCIpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy9wdWJsaWMgY29weSAoKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuX2NoaWxkcmVuKTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIC8vcHVibGljIHJldmVyc2UgKCkge1xuICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHJlbi5yZXZlcnNlKCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVDaGlsZChhcmc6YW55KSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLl9jaGlsZHJlbiwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRyZW4sIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZS51aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS51aWQgPT09IGFyZy51aWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLl9jaGlsZHJlbiwgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID09PSBhcmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNvcnQoZnVuYyl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5zb3J0KGZ1bmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwKHRoaXMuX2NoaWxkcmVuLCBmdW5jKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b0FycmF5KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9pbmRleE9mKGFycjphbnlbXSwgYXJnOmFueSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFmdW5jLmNhbGwobnVsbCwgdmFsdWUsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLOyAgIC8v5aaC5p6c5YyF5ZCr77yM5YiZ572u6L+U5Zue5YC85Li6dHJ1ZSzot7Plh7rlvqrnjq9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDxhbnk+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICh2YWx1ZS5jb250YWluICYmIHZhbHVlLmNvbnRhaW4odmFsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICh2YWx1ZS5pbmRleE9mICYmIHZhbHVlLmluZGV4T2YodmFsKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLOyAgIC8v5aaC5p6c5YyF5ZCr77yM5YiZ572u6L+U5Zue5YC85Li6dHJ1ZSzot7Plh7rlvqrnjq9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY29udGFpbihhcnI6YW55W10sIGFyZzphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleE9mKGFyciwgYXJnKSA+IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9yRWFjaChhcnI6YW55W10sIGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gY29udGV4dCB8fCB3aW5kb3csXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChzY29wZSwgYXJyW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX21hcChhcnI6YW55W10sIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRBcnIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsIChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vZSAmJiBlW2hhbmRsZXJOYW1lXSAmJiBlW2hhbmRsZXJOYW1lXS5hcHBseShjb250ZXh0IHx8IGUsIHZhbHVlQXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGUocmVzdWx0QXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZUNoaWxkKGFycjphbnlbXSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbnVsbDtcblxuICAgICAgICAgICAgaW5kZXggPSB0aGlzLl9pbmRleE9mKGFyciwgKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhZnVuYy5jYWxsKHNlbGYsIGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vaWYgKGluZGV4ICE9PSBudWxsICYmIGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBhcnI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9maWx0ZXIgPSBmdW5jdGlvbiAoYXJyLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSBjb250ZXh0IHx8IHdpbmRvdyxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaChhcnIsICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bmMuY2FsbChzY29wZSwgdmFsdWUsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGUocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgRG9tUXVlcnkge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb21TdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoZG9tU3RyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6YW55ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihkb21TdHIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRG9tKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW2FyZ3VtZW50c1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb21TdHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9