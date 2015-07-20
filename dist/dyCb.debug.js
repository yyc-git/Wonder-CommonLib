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
        function Hash(childs) {
            if (childs === void 0) { childs = {}; }
            this._childs = null;
            this._childs = childs;
        }
        Hash.create = function (childs) {
            if (childs === void 0) { childs = {}; }
            var obj = new this(childs);
            return obj;
        };
        Hash.prototype.getChilds = function () {
            return this._childs;
        };
        Hash.prototype.getCount = function () {
            var result = 0, childs = this._childs, key = null;
            for (key in childs) {
                if (childs.hasOwnProperty(key)) {
                    result++;
                }
            }
            return result;
        };
        Hash.prototype.getKeys = function () {
            var result = dyCb.Collection.create(), childs = this._childs, key = null;
            for (key in childs) {
                if (childs.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }
            return result;
        };
        Hash.prototype.getChild = function (key) {
            return this._childs[key];
        };
        Hash.prototype.addChild = function (key, value) {
            this._childs[key] = value;
            return this;
        };
        Hash.prototype.appendChild = function (key, value) {
            //if (JudgeUtils.isArray(this._childs[key])) {
            //    this._childs[key].push(value);
            //}
            //else {
            //    this._childs[key] = [value];
            //}
            if (this._childs[key] instanceof dyCb.Collection) {
                this._childs[key].addChild(value);
            }
            else {
                this._childs[key] = dyCb.Collection.create().addChild(value);
            }
            return this;
        };
        Hash.prototype.removeChild = function (arg) {
            if (dyCb.JudgeUtils.isString(arg)) {
                var key = arg;
                this._childs[key] = undefined;
            }
            else if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg, self_1 = this;
                //return this._removeChild(this._childs, arg);
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        self_1._childs[key] = undefined;
                        delete self_1._childs[key];
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
            return !!this._childs[key];
        };
        Hash.prototype.forEach = function (func, context) {
            var i = null, childs = this._childs;
            for (i in childs) {
                if (childs.hasOwnProperty(i)) {
                    if (func.call(context, childs[i], i) === dyCb.$BREAK) {
                        break;
                    }
                }
            }
            return this;
        };
        Hash.prototype.filter = function (func) {
            var result = {}, scope = this._childs;
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
            FUNC_NOT_SUPPORT: function (value) {
                return this.assertion("not support", value);
            },
            FUNC_MUST_DEFINE: function (value) {
                return this.assertion("must define", value);
            },
            FUNC_UNKNOW: function (value) {
                return this.assertion("unknow", value);
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
        function Collection(childs) {
            if (childs === void 0) { childs = []; }
            this._childs = null;
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
            this._childs = childs;
        }
        Collection.create = function (childs) {
            if (childs === void 0) { childs = []; }
            var obj = new this(childs);
            return obj;
        };
        Collection.prototype.getCount = function () {
            return this._childs.length;
        };
        Collection.prototype.hasChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0];
                return this._contain(this._childs, function (c, i) {
                    return func(c, i);
                });
            }
            var child = arguments[0];
            return this._contain(this._childs, function (c, i) {
                if (c === child
                    || (c.uid && child.uid && c.uid === child.uid)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };
        Collection.prototype.getChilds = function () {
            return this._childs;
        };
        Collection.prototype.getChild = function (index) {
            return this._childs[index];
        };
        Collection.prototype.addChild = function (child) {
            this._childs.push(child);
            return this;
        };
        Collection.prototype.addChilds = function (arg) {
            if (dyCb.JudgeUtils.isArray(arg)) {
                var childs = arg;
                this._childs = this._childs.concat(childs);
            }
            else if (arg instanceof Collection) {
                var childs = arg;
                this._childs = this._childs.concat(childs.toArray());
            }
            else {
                var child = arg;
                this.addChild(child);
            }
            return this;
        };
        Collection.prototype.removeAllChilds = function () {
            this._childs = [];
            return this;
        };
        Collection.prototype.forEach = function (func, context) {
            this._forEach(this._childs, func, context);
            return this;
        };
        Collection.prototype.filter = function (func) {
            return this._filter(this._childs, func, this._childs);
        };
        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this._childs.splice(index, 1);
        //}
        //
        //public copy () {
        //    return ExtendUtils.extendDeep(this._childs);
        //}
        //
        //public reverse () {
        //    this._childs.reverse();
        //}
        Collection.prototype.removeChild = function (arg) {
            if (dyCb.JudgeUtils.isFunction(arg)) {
                var func = arg;
                this._removeChild(this._childs, func);
            }
            else if (arg.uid) {
                this._removeChild(this._childs, function (e) {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                this._removeChild(this._childs, function (e) {
                    return e === arg;
                });
            }
            return this;
        };
        Collection.prototype.sort = function (func) {
            this._childs.sort(func);
            return this;
        };
        Collection.prototype.map = function (func) {
            return this._map(this._childs, func);
        };
        Collection.prototype.toArray = function () {
            return this._childs;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC9Db25zdC50cyIsIkhhc2gudHMiLCJ1dGlscy9KdWRnZVV0aWxzLnRzIiwidXRpbHMvQWpheFV0aWxzLnRzIiwidXRpbHMvQ29udmVydFV0aWxzLnRzIiwidXRpbHMvRXZlbnRVdGlscy50cyIsInV0aWxzL0V4dGVuZFV0aWxzLnRzIiwiTG9nLnRzIiwiQ29sbGVjdGlvbi50cyIsInV0aWxzL0RvbVF1ZXJ5LnRzIl0sIm5hbWVzIjpbImR5Q2IiLCJkeUNiLkhhc2giLCJkeUNiLkhhc2guY29uc3RydWN0b3IiLCJkeUNiLkhhc2guY3JlYXRlIiwiZHlDYi5IYXNoLmdldENoaWxkcyIsImR5Q2IuSGFzaC5nZXRDb3VudCIsImR5Q2IuSGFzaC5nZXRLZXlzIiwiZHlDYi5IYXNoLmdldENoaWxkIiwiZHlDYi5IYXNoLmFkZENoaWxkIiwiZHlDYi5IYXNoLmFwcGVuZENoaWxkIiwiZHlDYi5IYXNoLnJlbW92ZUNoaWxkIiwiZHlDYi5IYXNoLmhhc0NoaWxkIiwiZHlDYi5IYXNoLmZvckVhY2giLCJkeUNiLkhhc2guZmlsdGVyIiwiZHlDYi5IYXNoLm1hcCIsImR5Q2IuSnVkZ2VVdGlscyIsImR5Q2IuSnVkZ2VVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuSnVkZ2VVdGlscy5pc0FycmF5IiwiZHlDYi5KdWRnZVV0aWxzLmlzRnVuY3Rpb24iLCJkeUNiLkp1ZGdlVXRpbHMuaXNOdW1iZXIiLCJkeUNiLkp1ZGdlVXRpbHMuaXNTdHJpbmciLCJkeUNiLkp1ZGdlVXRpbHMuaXNEb20iLCJkeUNiLkp1ZGdlVXRpbHMuaXNEaXJlY3RPYmplY3QiLCJkeUNiLkp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kIiwiZHlDYi5BamF4VXRpbHMiLCJkeUNiLkFqYXhVdGlscy5jb25zdHJ1Y3RvciIsImR5Q2IuQWpheFV0aWxzLmFqYXgiLCJkeUNiLkFqYXhVdGlscy5fY3JlYXRlQWpheCIsImR5Q2IuQWpheFV0aWxzLl9pc0xvY2FsRmlsZSIsImR5Q2IuQWpheFV0aWxzLl9pc1NvdW5kRmlsZSIsImR5Q2IuQ29udmVydFV0aWxzIiwiZHlDYi5Db252ZXJ0VXRpbHMuY29uc3RydWN0b3IiLCJkeUNiLkNvbnZlcnRVdGlscy50b1N0cmluZyIsImR5Q2IuQ29udmVydFV0aWxzLl9jb252ZXJ0Q29kZVRvU3RyaW5nIiwiZHlDYi5FdmVudFV0aWxzIiwiZHlDYi5FdmVudFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FdmVudFV0aWxzLmJpbmRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5hZGRFdmVudCIsImR5Q2IuRXZlbnRVdGlscy5yZW1vdmVFdmVudCIsImR5Q2IuRXh0ZW5kVXRpbHMiLCJkeUNiLkV4dGVuZFV0aWxzLmNvbnN0cnVjdG9yIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmREZWVwIiwiZHlDYi5FeHRlbmRVdGlscy5leHRlbmQiLCJkeUNiLkV4dGVuZFV0aWxzLmNvcHlQdWJsaWNBdHRyaSIsImR5Q2IuTG9nIiwiZHlDYi5Mb2cuY29uc3RydWN0b3IiLCJkeUNiLkxvZy5sb2ciLCJkeUNiLkxvZy5hc3NlcnQiLCJkeUNiLkxvZy5lcnJvciIsImR5Q2IuQ29sbGVjdGlvbiIsImR5Q2IuQ29sbGVjdGlvbi5jb25zdHJ1Y3RvciIsImR5Q2IuQ29sbGVjdGlvbi5jcmVhdGUiLCJkeUNiLkNvbGxlY3Rpb24uZ2V0Q291bnQiLCJkeUNiLkNvbGxlY3Rpb24uaGFzQ2hpbGQiLCJkeUNiLkNvbGxlY3Rpb24uZ2V0Q2hpbGRzIiwiZHlDYi5Db2xsZWN0aW9uLmdldENoaWxkIiwiZHlDYi5Db2xsZWN0aW9uLmFkZENoaWxkIiwiZHlDYi5Db2xsZWN0aW9uLmFkZENoaWxkcyIsImR5Q2IuQ29sbGVjdGlvbi5yZW1vdmVBbGxDaGlsZHMiLCJkeUNiLkNvbGxlY3Rpb24uZm9yRWFjaCIsImR5Q2IuQ29sbGVjdGlvbi5maWx0ZXIiLCJkeUNiLkNvbGxlY3Rpb24ucmVtb3ZlQ2hpbGQiLCJkeUNiLkNvbGxlY3Rpb24uc29ydCIsImR5Q2IuQ29sbGVjdGlvbi5tYXAiLCJkeUNiLkNvbGxlY3Rpb24udG9BcnJheSIsImR5Q2IuQ29sbGVjdGlvbi5faW5kZXhPZiIsImR5Q2IuQ29sbGVjdGlvbi5fY29udGFpbiIsImR5Q2IuQ29sbGVjdGlvbi5fZm9yRWFjaCIsImR5Q2IuQ29sbGVjdGlvbi5fbWFwIiwiZHlDYi5Db2xsZWN0aW9uLl9yZW1vdmVDaGlsZCIsImR5Q2IuRG9tUXVlcnkiLCJkeUNiLkRvbVF1ZXJ5LmNvbnN0cnVjdG9yIiwiZHlDYi5Eb21RdWVyeS5jcmVhdGUiLCJkeUNiLkRvbVF1ZXJ5LmdldCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxJQUFJLENBS1Y7QUFMRCxXQUFPLElBQUksRUFBQSxDQUFDO0lBQ0tBLFdBQU1BLEdBQUdBO1FBQ2xCQSxLQUFLQSxFQUFDQSxJQUFJQTtLQUNiQSxDQUFDQTtJQUNXQSxZQUFPQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUNsQ0EsQ0FBQ0EsRUFMTSxJQUFJLEtBQUosSUFBSSxRQUtWOztBQ0xELHdDQUF3QztBQUN4QyxJQUFPLElBQUksQ0FrS1Y7QUFsS0QsV0FBTyxJQUFJLEVBQUMsQ0FBQztJQUNUQTtRQU9JQyxjQUFZQSxNQUFlQTtZQUFmQyxzQkFBZUEsR0FBZkEsV0FBZUE7WUFJbkJBLFlBQU9BLEdBQU9BLElBQUlBLENBQUNBO1lBSHZCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7UUFSYUQsV0FBTUEsR0FBcEJBLFVBQXFCQSxNQUFXQTtZQUFYRSxzQkFBV0EsR0FBWEEsV0FBV0E7WUFDNUJBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBRTNCQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNmQSxDQUFDQTtRQVFNRix3QkFBU0EsR0FBaEJBO1lBQ0lHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUVNSCx1QkFBUUEsR0FBZkE7WUFDSUksSUFBSUEsTUFBTUEsR0FBR0Es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QTtnQkFFckJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUM1Q0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7d0JBQ3RCQSxRQUFRQSxDQUFDQTtvQkFDYkEsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxJQUFJQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDcENBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUdEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbENBLE1BQU1BLEdBQUdBLEtBQUtBLElBQUlB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QVZBLFVBQVdBLEtBQUtBO1lBQ1pHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzdCQSxDQUFDQTtRQUNMSCxlQUFDQTtJQUFEQSxDQXZCQXRFLEFBdUJDc0UsSUFBQXRFO0lBdkJZQSxhQUFRQSxXQXVCcEJBLENBQUFBO0FBQ0xBLENBQUNBLEVBekJNLElBQUksS0FBSixJQUFJLFFBeUJWIiwiZmlsZSI6ImR5Q2IuZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgZHlDYntcbiAgICBleHBvcnQgY29uc3QgJEJSRUFLID0ge1xuICAgICAgICBicmVhazp0cnVlXG4gICAgfTtcbiAgICBleHBvcnQgY29uc3QgJFJFTU9WRSA9IHZvaWQgMDtcbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaCB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGNoaWxkcyA9IHt9KXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhjaGlsZHMpO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRzOmFueSA9IHt9KXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcyA9IGNoaWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NoaWxkczphbnkgPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMCxcbiAgICAgICAgICAgICAgICBjaGlsZHMgPSB0aGlzLl9jaGlsZHMsXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHMpe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcyA9IHRoaXMuX2NoaWxkcyxcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcyl7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENoaWxkKGtleTpzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkc1trZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFwcGVuZENoaWxkKGtleTpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc0FycmF5KHRoaXMuX2NoaWxkc1trZXldKSkge1xuICAgICAgICAgICAgLy8gICAgdGhpcy5fY2hpbGRzW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vZWxzZSB7XG4gICAgICAgICAgICAvLyAgICB0aGlzLl9jaGlsZHNba2V5XSA9IFt2YWx1ZV07XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHNba2V5XSBpbnN0YW5jZW9mIENvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHNba2V5XS5hZGRDaGlsZCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHNba2V5XSA9IENvbGxlY3Rpb24uY3JlYXRlKCkuYWRkQ2hpbGQodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVDaGlsZChhcmc6YW55KXtcbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvL3JldHVybiB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLl9jaGlsZHMsIGFyZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihmdW5jKHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHNba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl9jaGlsZHNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZChhcmc6YW55KTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX2NoaWxkc1trZXldO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0Pzphbnkpe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcyA9IHRoaXMuX2NoaWxkcztcblxuICAgICAgICAgICAgZm9yIChpIGluIGNoaWxkcykge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZHNbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLl9jaGlsZHM7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZighZnVuYy5jYWxsKHNjb3BlLCB2YWwsIGtleSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIEhhc2guY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbWFwKGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRNYXAgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWwsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jKHZhbCwga2V5KTtcblxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gJFJFTU9WRSl7XG4gICAgICAgICAgICAgICAgICAgIExvZy5lcnJvcighSnVkZ2VVdGlscy5pc0FycmF5KHJlc3VsdCkgfHwgcmVzdWx0Lmxlbmd0aCAhPT0gMiwgTG9nLmluZm8uRlVOQ19NVVNUX0JFKFwiaXRlcmF0b3JcIiwgXCJba2V5LCB2YWx1ZV1cIikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcFtyZXN1bHRbMF1dID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0TWFwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCJtb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEp1ZGdlVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzQXJyYXkodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNGdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzTnVtYmVyKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc1N0cmluZyhzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RyKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEb20ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmplY3RbcHJvcGVydHldO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09IFwib2JqZWN0XCIgJiYgISFvYmplY3RbcHJvcGVydHldKSB8fFxuICAgICAgICAgICAgICAgIHR5cGUgPT09IFwidW5rbm93blwiO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIGR5Q2J7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIEFqYXhVdGlsc3tcbiAgICAgICAgLyohXG4gICAgICAgICDlrp7njrBhamF4XG5cbiAgICAgICAgIGFqYXgoe1xuICAgICAgICAgdHlwZTpcInBvc3RcIiwvL3Bvc3TmiJbogIVnZXTvvIzpnZ7lv4XpobtcbiAgICAgICAgIHVybDpcInRlc3QuanNwXCIsLy/lv4XpobvnmoRcbiAgICAgICAgIGRhdGE6XCJuYW1lPWRpcG9vJmluZm89Z29vZFwiLC8v6Z2e5b+F6aG7XG4gICAgICAgICBkYXRhVHlwZTpcImpzb25cIiwvL3RleHQveG1sL2pzb27vvIzpnZ7lv4XpobtcbiAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7Ly/lm57osIPlh73mlbDvvIzpnZ7lv4XpobtcbiAgICAgICAgIGFsZXJ0KGRhdGEubmFtZSk7XG4gICAgICAgICB9XG4gICAgICAgICB9KTsqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFqYXgoY29uZil7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNvbmYudHlwZTsvL3R5cGXlj4LmlbAs5Y+v6YCJXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZi51cmw7Ly91cmzlj4LmlbDvvIzlv4XloatcbiAgICAgICAgICAgIHZhciBkYXRhID0gY29uZi5kYXRhOy8vZGF0YeWPguaVsOWPr+mAie+8jOWPquacieWcqHBvc3Tor7fmsYLml7bpnIDopoFcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IGNvbmYuZGF0YVR5cGU7Ly9kYXRhdHlwZeWPguaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjb25mLnN1Y2Nlc3M7Ly/lm57osIPlh73mlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNvbmYuZXJyb3I7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHsvL3R5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLpnZXRcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJnZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gbnVsbCkgey8vZGF0YVR5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLp0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyID0gdGhpcy5fY3JlYXRlQWpheChlcnJvcik7XG4gICAgICAgICAgICBpZiAoIXhocikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkdFVFwiIHx8IHR5cGUgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwiUE9TVFwiIHx8IHR5cGUgPT09IFwicG9zdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenGFqYXjorr/pl67nmoTmmK/mnKzlnLDmlofku7bvvIzliJlzdGF0dXPkuLowXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHNlbGYuX2lzTG9jYWxGaWxlKHhoci5zdGF0dXMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBcInRleHRcIiB8fCBkYXRhVHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5pmu6YCa5paH5pysXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwieG1sXCIgfHwgZGF0YVR5cGUgPT09IFwiWE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5o6l5pS2eG1s5paH5qGjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJqc29uXCIgfHwgZGF0YVR5cGUgPT09IFwiSlNPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGV2YWwoXCIoXCIgKyB4aHIucmVzcG9uc2VUZXh0ICsgXCIpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZUFqYXgoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHsvL0lF57O75YiX5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJtaWNyb3NvZnQueG1saHR0cFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsvL+mdnklF5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHhociwge21lc3NhZ2U6IFwi5oKo55qE5rWP6KeI5Zmo5LiN5pSv5oyBYWpheO+8jOivt+abtOaNou+8gVwifSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNMb2NhbEZpbGUoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuVVJMLmNvbnRhaW4oXCJmaWxlOi8vXCIpICYmIHN0YXR1cyA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc1NvdW5kRmlsZShkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNie1xuICAgIGV4cG9ydCBjbGFzcyBDb252ZXJ0VXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdG9TdHJpbmcob2JqOmFueSl7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc051bWJlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc2pRdWVyeShvYmopKSB7XG4gICAgICAgICAgICAvLyAgICByZXR1cm4gX2pxVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2RlVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRGlyZWN0T2JqZWN0KG9iaikgfHwgSnVkZ2VVdGlscy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jb252ZXJ0Q29kZVRvU3RyaW5nKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4udG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuc2xpY2UoMSwgLTEpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICAvL2RlY2xhcmUgdmFyIHdpbmRvdzphbnk7XG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmRFdmVudChjb250ZXh0LCBmdW5jKSB7XG4gICAgICAgICAgICAvL3ZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIC8vICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZnVuLmFwcGx5KG9iamVjdCwgW3NlbGYud3JhcEV2ZW50KGV2ZW50KV0uY29uY2F0KGFyZ3MpKTsgLy/lr7nkuovku7blr7nosaHov5vooYzljIXoo4VcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImF0dGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJkZXRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZmluaXRpb25zLmQudHNcIi8+XG5tb2R1bGUgZHlDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuZFV0aWxzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3seaLt+i0nVxuICAgICAgICAgKlxuICAgICAgICAgKiDnpLrkvovvvJpcbiAgICAgICAgICog5aaC5p6c5ou36LSd5a+56LGh5Li65pWw57uE77yM6IO95aSf5oiQ5Yqf5ou36LSd77yI5LiN5ou36LSdQXJyYXnljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogZXhwZWN0KGV4dGVuZC5leHRlbmREZWVwKFsxLCB7IHg6IDEsIHk6IDEgfSwgXCJhXCIsIHsgeDogMiB9LCBbMl1dKSkudG9FcXVhbChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSk7XG4gICAgICAgICAqXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuWvueixoe+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOiDveaLt+i0neWOn+Wei+mTvuS4iueahOaIkOWRmO+8iVxuICAgICAgICAgKiB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgIGZ1bmN0aW9uIEEoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBBLnByb3RvdHlwZS5hID0gMTtcblxuICAgICAgICAgZnVuY3Rpb24gQigpIHtcblx0ICAgICAgICAgICAgfTtcbiAgICAgICAgIEIucHJvdG90eXBlID0gbmV3IEEoKTtcbiAgICAgICAgIEIucHJvdG90eXBlLmIgPSB7IHg6IDEsIHk6IDEgfTtcbiAgICAgICAgIEIucHJvdG90eXBlLmMgPSBbeyB4OiAxIH0sIFsyXV07XG5cbiAgICAgICAgIHZhciB0ID0gbmV3IEIoKTtcblxuICAgICAgICAgcmVzdWx0ID0gZXh0ZW5kLmV4dGVuZERlZXAodCk7XG5cbiAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG4gICAgICAgICB7XG4gICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICBiOiB7IHg6IDEsIHk6IDEgfSxcbiAgICAgICAgICAgICBjOiBbeyB4OiAxIH0sIFsyXV1cbiAgICAgICAgIH0pO1xuICAgICAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAgICAgKiBAcmV0dXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmREZWVwKHBhcmVudCwgY2hpbGQ/LGZpbHRlcj1mdW5jdGlvbih2YWwsIGkpe3JldHVybiB0cnVlO30pIHtcbiAgICAgICAgICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgICAgICAgICBsZW4gPSAwLFxuICAgICAgICAgICAgICAgIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBzQXJyID0gXCJbb2JqZWN0IEFycmF5XVwiLFxuICAgICAgICAgICAgICAgIHNPYiA9IFwiW29iamVjdCBPYmplY3RdXCIsXG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiXCIsXG4gICAgICAgICAgICAgICAgX2NoaWxkID0gbnVsbDtcblxuICAgICAgICAgICAgLy/mlbDnu4TnmoTor53vvIzkuI3ojrflvpdBcnJheeWOn+Wei+S4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgaWYgKHRvU3RyLmNhbGwocGFyZW50KSA9PT0gc0Fycikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcGFyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFmaWx0ZXIocGFyZW50W2ldLCBpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0b1N0ci5jYWxsKHBhcmVudFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBzQXJyIHx8IHR5cGUgPT09IHNPYikgeyAgICAvL+WmguaenOS4uuaVsOe7hOaIlm9iamVjdOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gdHlwZSA9PT0gc0FyciA/IFtdIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlKHBhcmVudFtpXSwgX2NoaWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHBhcmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a+56LGh55qE6K+d77yM6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CC5Zug5Li66ICD6JmR5Lul5LiL5oOF5pmv77yaXG4gICAgICAgICAgICAvL+exu0Hnu6fmib/kuo7nsbtC77yM546w5Zyo5oOz6KaB5ou36LSd57G7QeeahOWunuS+i2HnmoTmiJDlkZjvvIjljIXmi6zku47nsbtC57un5om/5p2l55qE5oiQ5ZGY77yJ77yM6YKj5LmI5bCx6ZyA6KaB6I635b6X5Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY44CCXG4gICAgICAgICAgICBlbHNlIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNPYikge1xuICAgICAgICAgICAgICAgIF9jaGlsZCA9IGNoaWxkIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWF5ou36LSdXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChkZXN0aW5hdGlvbjphbnksIHNvdXJjZTphbnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29weVB1YmxpY0F0dHJpKHNvdXJjZTphbnkpe1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZERlZXAoc291cmNlLCBkZXN0aW5hdGlvbiwgZnVuY3Rpb24oaXRlbSwgcHJvcGVydHkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5zbGljZSgwLCAxKSAhPT0gXCJfXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgIUp1ZGdlVXRpbHMuaXNGdW5jdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsIm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgTG9nIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbmZvID0ge1xuICAgICAgICAgICAgSU5WQUxJRF9QQVJBTTogXCJpbnZhbGlkIHBhcmFtZXRlclwiLFxuICAgICAgICAgICAgQUJTVFJBQ1RfQVRUUklCVVRFOiBcImFic3RyYWN0IGF0dHJpYnV0ZSBuZWVkIG92ZXJyaWRlXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9NRVRIT0Q6IFwiYWJzdHJhY3QgbWV0aG9kIG5lZWQgb3ZlcnJpZGVcIixcblxuICAgICAgICAgICAgaGVscGVyRnVuYzogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZyh2YWwpICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3NlcnRpb246IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVscGVyRnVuYyhhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXJndW1lbnRzLmxlbmd0aCBtdXN0IDw9IDNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgRlVOQ19JTlZBTElEOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJpbnZhbGlkXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgICAgICBhcnIudW5zaGlmdChcIm11c3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0JFOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQoXCJtdXN0IG5vdCBiZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcnIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTk9UX1NVUFBPUlQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24oXCJub3Qgc3VwcG9ydFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19NVVNUX0RFRklORTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcIm11c3QgZGVmaW5lXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VOS05PVzogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInVua25vd1wiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19VTkVYUEVDVDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbihcInVuZXhwZWN0ZWRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdXRwdXQgRGVidWcgbWVzc2FnZS5cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGxvZyhtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5pat6KiA5aSx6LSl5pe277yM5Lya5o+Q56S66ZSZ6K+v5L+h5oGv77yM5L2G56iL5bqP5Lya57un57ut5omn6KGM5LiL5Y67XG4gICAgICAgICAqIOS9v+eUqOaWreiogOaNleaNieS4jeW6lOivpeWPkeeUn+eahOmdnuazleaDheWGteOAguS4jeimgea3t+a3humdnuazleaDheWGteS4jumUmeivr+aDheWGteS5i+mXtOeahOWMuuWIq++8jOWQjuiAheaYr+W/heeEtuWtmOWcqOeahOW5tuS4lOaYr+S4gOWumuimgeS9nOWHuuWkhOeQhueahOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiAx77yJ5a+56Z2e6aKE5pyf6ZSZ6K+v5L2/55So5pat6KiAXG4gICAgICAgICDmlq3oqIDkuK3nmoTluIPlsJTooajovr7lvI/nmoTlj43pnaLkuIDlrpropoHmj4/ov7DkuIDkuKrpnZ7pooTmnJ/plJnor6/vvIzkuIvpnaLmiYDov7DnmoTlnKjkuIDlrprmg4XlhrXkuIvkuLrpnZ7pooTmnJ/plJnor6/nmoTkuIDkupvkvovlrZDvvJpcbiAgICAgICAgIO+8iDHvvInnqbrmjIfpkojjgIJcbiAgICAgICAgIO+8iDLvvInovpPlhaXmiJbogIXovpPlh7rlj4LmlbDnmoTlgLzkuI3lnKjpooTmnJ/ojIPlm7TlhoXjgIJcbiAgICAgICAgIO+8iDPvvInmlbDnu4TnmoTotornlYzjgIJcbiAgICAgICAgIOmdnumihOacn+mUmeivr+WvueW6lOeahOWwseaYr+mihOacn+mUmeivr++8jOaIkeS7rOmAmuW4uOS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeadpeWkhOeQhumihOacn+mUmeivr++8jOiAjOS9v+eUqOaWreiogOWkhOeQhumdnumihOacn+mUmeivr+OAguWcqOS7o+eggeaJp+ihjOi/h+eoi+S4re+8jOacieS6m+mUmeivr+awuOi/nOS4jeW6lOivpeWPkeeUn++8jOi/meagt+eahOmUmeivr+aYr+mdnumihOacn+mUmeivr+OAguaWreiogOWPr+S7peiiq+eci+aIkOaYr+S4gOenjeWPr+aJp+ihjOeahOazqOmHiu+8jOS9oOS4jeiDveS+nei1luWug+adpeiuqeS7o+eggeato+W4uOW3peS9nO+8iOOAikNvZGUgQ29tcGxldGUgMuOAi++8ieOAguS+i+Wmgu+8mlxuICAgICAgICAgaW50IG5SZXMgPSBmKCk7IC8vIG5SZXMg55SxIGYg5Ye95pWw5o6n5Yi277yMIGYg5Ye95pWw5L+d6K+B6L+U5Zue5YC85LiA5a6a5ZyoIC0xMDAgfiAxMDBcbiAgICAgICAgIEFzc2VydCgtMTAwIDw9IG5SZXMgJiYgblJlcyA8PSAxMDApOyAvLyDmlq3oqIDvvIzkuIDkuKrlj6/miafooYznmoTms6jph4pcbiAgICAgICAgIOeUseS6jiBmIOWHveaVsOS/neivgeS6hui/lOWbnuWAvOWkhOS6jiAtMTAwIH4gMTAw77yM6YKj5LmI5aaC5p6c5Ye6546w5LqGIG5SZXMg5LiN5Zyo6L+Z5Liq6IyD5Zu055qE5YC85pe277yM5bCx6KGo5piO5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v55qE5Ye6546w44CC5ZCO6Z2i5Lya6K6y5Yiw4oCc6ZqU5qCP4oCd77yM6YKj5pe25Lya5a+55pat6KiA5pyJ5pu05Yqg5rex5Yi755qE55CG6Kej44CCXG4gICAgICAgICAy77yJ5LiN6KaB5oqK6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5LitXG4gICAgICAgICDmlq3oqIDnlKjkuo7ova/ku7bnmoTlvIDlj5Hlkoznu7TmiqTvvIzogIzpgJrluLjkuI3lnKjlj5HooYzniYjmnKzkuK3ljIXlkKvmlq3oqIDjgIJcbiAgICAgICAgIOmcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4reaYr+S4jeato+ehrueahO+8jOWboOS4uuWcqOWPkeihjOeJiOacrOS4re+8jOi/meS6m+S7o+eggemAmuW4uOS4jeS8muiiq+aJp+ihjO+8jOS+i+Wmgu+8mlxuICAgICAgICAgQXNzZXJ0KGYoKSk7IC8vIGYg5Ye95pWw6YCa5bi45Zyo5Y+R6KGM54mI5pys5Lit5LiN5Lya6KKr5omn6KGMXG4gICAgICAgICDogIzkvb/nlKjlpoLkuIvmlrnms5XliJnmr5TovoPlronlhajvvJpcbiAgICAgICAgIHJlcyA9IGYoKTtcbiAgICAgICAgIEFzc2VydChyZXMpOyAvLyDlronlhahcbiAgICAgICAgIDPvvInlr7nmnaXmupDkuo7lhoXpg6jns7vnu5/nmoTlj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzogIzkuI3opoHlr7nlpJbpg6jkuI3lj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzlr7nkuo7lpJbpg6jkuI3lj6/pnaDmlbDmja7vvIzlupTor6Xkvb/nlKjplJnor6/lpITnkIbku6PnoIHjgIJcbiAgICAgICAgIOWGjeasoeW8uuiwg++8jOaKiuaWreiogOeci+aIkOWPr+aJp+ihjOeahOazqOmHiuOAglxuICAgICAgICAgKiBAcGFyYW0gY29uZCDlpoLmnpxjb25k6L+U5ZueZmFsc2XvvIzliJnmlq3oqIDlpLHotKXvvIzmmL7npLptZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFzc2VydChjb25kLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAoY29uc29sZS5hc3NlcnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChjb25kLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghY29uZCAmJiBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBlcnJvcihjb25kLCBtZXNzYWdlKTphbnkge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZGVmaW5pdGlvbnMuZC50c1wiLz5cbm1vZHVsZSBkeUNiIHtcbiAgICBleHBvcnQgY2xhc3MgQ29sbGVjdGlvbiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGNoaWxkcyA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhjaGlsZHMpO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRzOmFueSA9IFtdKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcyA9IGNoaWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NoaWxkczphbnlbXSA9IG51bGw7XG5cbiAgICAgICAgcHVibGljIGdldENvdW50KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHMubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZyk6Ym9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbih0aGlzLl9jaGlsZHMsIChjLCBpKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhjLCBpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkID0gPGFueT5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250YWluKHRoaXMuX2NoaWxkcywgKGMsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgfHwgKGMudWlkICYmIGNoaWxkLnVpZCAmJiBjLnVpZCA9PT0gY2hpbGQudWlkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHMgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChpbmRleDpudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHNbaW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHMucHVzaChjaGlsZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkcyhhcmc6YW55W118Q29sbGVjdGlvbnxhbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzQXJyYXkoYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHMgPSA8YW55W10+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRzID0gdGhpcy5fY2hpbGRzLmNvbmNhdChjaGlsZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihhcmcgaW5zdGFuY2VvZiBDb2xsZWN0aW9uKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRzID0gPENvbGxlY3Rpb24+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRzID0gdGhpcy5fY2hpbGRzLmNvbmNhdChjaGlsZHMudG9BcnJheSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IDxhbnk+YXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUFsbENoaWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcyA9IFtdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaCh0aGlzLl9jaGlsZHMsIGZ1bmMsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlcih0aGlzLl9jaGlsZHMsIGZ1bmMsIHRoaXMuX2NoaWxkcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3B1YmxpYyByZW1vdmVDaGlsZEF0IChpbmRleCkge1xuICAgICAgICAvLyAgICBMb2cuZXJyb3IoaW5kZXggPCAwLCBcIuW6j+WPt+W/hemhu+Wkp+S6juetieS6jjBcIik7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIHRoaXMuX2NoaWxkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy9wdWJsaWMgY29weSAoKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBFeHRlbmRVdGlscy5leHRlbmREZWVwKHRoaXMuX2NoaWxkcyk7XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuICAgICAgICAvL3B1YmxpYyByZXZlcnNlICgpIHtcbiAgICAgICAgLy8gICAgdGhpcy5fY2hpbGRzLnJldmVyc2UoKTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuX2NoaWxkcywgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhcmcudWlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRzLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudWlkID09PSBhcmcudWlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGQodGhpcy5fY2hpbGRzLCAgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUgPT09IGFyZztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcy5zb3J0KGZ1bmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbil7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwKHRoaXMuX2NoaWxkcywgZnVuYyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdG9BcnJheSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2luZGV4T2YoYXJyOmFueVtdLCBhcmc6YW55KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIWZ1bmMuY2FsbChudWxsLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7ICAgLy/lpoLmnpzljIXlkKvvvIzliJnnva7ov5Tlm57lgLzkuLp0cnVlLOi3s+WHuuW+queOr1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gPGFueT5hcmc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHZhbHVlLmNvbnRhaW4gJiYgdmFsdWUuY29udGFpbih2YWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHZhbHVlLmluZGV4T2YgJiYgdmFsdWUuaW5kZXhPZih2YWwpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7ICAgLy/lpoLmnpzljIXlkKvvvIzliJnnva7ov5Tlm57lgLzkuLp0cnVlLOi3s+WHuuW+queOr1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jb250YWluKGFycjphbnlbXSwgYXJnOmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2YoYXJyLCBhcmcpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9mb3JFYWNoKGFycjphbnlbXSwgZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSBjb250ZXh0IHx8IHdpbmRvdyxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpID09PSAkQlJFQUspIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbWFwKGFycjphbnlbXSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdEFyciA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMoZSwgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSAkUkVNT1ZFKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXJyLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9lICYmIGVbaGFuZGxlck5hbWVdICYmIGVbaGFuZGxlck5hbWVdLmFwcGx5KGNvbnRleHQgfHwgZSwgdmFsdWVBcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZShyZXN1bHRBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlQ2hpbGQoYXJyOmFueVtdLCBmdW5jOkZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuX2luZGV4T2YoYXJyLCAoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFmdW5jLmNhbGwoc2VsZiwgZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9pZiAoaW5kZXggIT09IG51bGwgJiYgaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2ZpbHRlciA9IGZ1bmN0aW9uIChhcnIsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IGNvbnRleHQgfHwgd2luZG93LFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9mb3JFYWNoKGFyciwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZShyZXN1bHQpO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZpbml0aW9ucy5kLnRzXCIvPlxubW9kdWxlIGR5Q2Ige1xuICAgIGV4cG9ydCBjbGFzcyBEb21RdWVyeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRvbVN0cjpzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhkb21TdHIpO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZG9tczphbnkgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRvbVN0cikge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNEb20oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbYXJndW1lbnRzWzBdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvbVN0cik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RvbXNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=