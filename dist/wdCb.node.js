var __extends = (this && this.__extends) || function (d, b) {
for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
function __() { this.constructor = d; }
__.prototype = b.prototype;
d.prototype = new __();
};
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
                this._children[key] = undefined;
                delete this._children[key];
            }
            else if (wdCb.JudgeUtils.isFunction(arg)) {
                var func = arg, self_1 = this;
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        result.push(self_1._children[key]);
                        self_1._children[key] = undefined;
                        delete self_1._children[key];
                    }
                });
            }
            return wdCb.Collection.create(result);
        };
        Hash.prototype.removeAllChildren = function () {
            this._children = {};
        };
        Hash.prototype.hasChild = function (arg) {
            if (wdCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0], result = false;
                this.forEach(function (val, key) {
                    if (func(val, key)) {
                        result = true;
                        return wdCb.$BREAK;
                    }
                });
                return result;
            }
            else {
                var key = arguments[0];
                return this._children[key] !== void 0;
            }
        };
        Hash.prototype.forEach = function (func, context) {
            var i = null, children = this._children;
            for (i in children) {
                if (children.hasOwnProperty(i)) {
                    if (func.call(context, children[i], i) === wdCb.$BREAK) {
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
    var List = (function () {
        function List() {
            this.children = null;
        }
        List.prototype.getCount = function () {
            return this.children.length;
        };
        List.prototype.hasChild = function (arg) {
            if (wdCb.JudgeUtils.isFunction(arguments[0])) {
                var func = arguments[0];
                for (var i = 0, len = this.children.length; i < len; i++) {
                    if (func(this.children[i], i)) {
                        return true;
                    }
                }
            }
            else {
                var child = arguments[0];
                for (var i = 0, len = this.children.length; i < len; i++) {
                    var c = this.children[i];
                    if (child.uid && c.uid) {
                        return child.uid == c.uid;
                    }
                    return child === c;
                }
            }
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

var wdCb;
(function (wdCb) {
    var Log = (function () {
        function Log() {
        }
        /**
         * Output Debug message.
         * @function
         * @param {String} message
         */
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            return Object.prototype.toString.call(obj).match(/\[object HTML\w+/) !== null;
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
    wdCb.JudgeUtils = JudgeUtils;
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
    // performance.now polyfill
    if ('performance' in wdCb.root === false) {
        wdCb.root.performance = {};
    }
    // IE 8
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
            //if (JudgeUtils.isjQuery(obj)) {
            //    return _jqToString(obj);
            //}
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
            //var args = Array.prototype.slice.call(arguments, 2),
            //    self = this;
            return function (event) {
                //return fun.apply(object, [self.wrapEvent(event)].concat(args)); //对事件对象进行包装
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

if (((typeof window != "undefined" && window.module) || (typeof module != "undefined")) && typeof module.exports != "undefined") {
    module.exports = wdCb;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb24udHMiLCJIYXNoLnRzIiwiTGlzdC50cyIsIkxvZy50cyIsIlF1ZXVlLnRzIiwiU3RhY2sudHMiLCJ1dGlscy9KdWRnZVV0aWxzLnRzIiwiZ2xvYmFsL1ZhcmlhYmxlLnRzIiwiZ2xvYmFsL2V4dGVuZC50cyIsImdsb2JhbC9Db25zdC50cyIsInV0aWxzL0FqYXhVdGlscy50cyIsInV0aWxzL0FycmF5VXRpbHMudHMiLCJ1dGlscy9Db252ZXJ0VXRpbHMudHMiLCJ1dGlscy9FdmVudFV0aWxzLnRzIiwidXRpbHMvRXh0ZW5kVXRpbHMudHMiLCJ1dGlscy9QYXRoVXRpbHMudHMiLCJ1dGlscy9GdW5jdGlvblV0aWxzLnRzIiwidXRpbHMvRG9tUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFPLElBQUksQ0FnR1Y7QUFoR0QsV0FBTyxJQUFJLEVBQUMsQ0FBQztJQUNUO1FBQW1DLDhCQUFPO1FBT3RDLG9CQUFZLFFBQXNCO1lBQXRCLHdCQUFzQixHQUF0QixhQUFzQjtZQUM5QixpQkFBTyxDQUFDO1lBRVIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDN0IsQ0FBQztRQVZhLGlCQUFNLEdBQXBCLFVBQXdCLFFBQWE7WUFBYix3QkFBYSxHQUFiLGFBQWE7WUFDakMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQVcsUUFBUSxDQUFDLENBQUM7WUFFdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFRTSx5QkFBSSxHQUFYLFVBQWEsTUFBc0I7WUFBdEIsc0JBQXNCLEdBQXRCLGNBQXNCO1lBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBSSxnQkFBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7a0JBQ3JFLFVBQVUsQ0FBQyxNQUFNLENBQUksZ0JBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFR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SUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFDaEMsTUFBTSxHQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFNUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7Z0JBRXZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQzFCLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFFTyxpQ0FBYyxHQUF0QixVQUF1QixNQUFNO1lBQ3pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDTCxlQUFDO0lBQUQsQ0EzSEEsQUEySEMsSUFBQTtJQTNIWSxhQUFRLFdBMkhwQixDQUFBO0FBQ0wsQ0FBQyxFQS9ITSxJQUFJLEtBQUosSUFBSSxRQStIViIsImZpbGUiOiJ3ZENiLm5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIENvbGxlY3Rpb248VD4gZXh0ZW5kcyBMaXN0PFQ+e1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZTxUPihjaGlsZHJlbiA9IFtdKXtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyg8QXJyYXk8VD4+Y2hpbGRyZW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hpbGRyZW46QXJyYXk8VD4gPSBbXSl7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY29weSAoaXNEZWVwOmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRGVlcCA/IENvbGxlY3Rpb24uY3JlYXRlPFQ+KEV4dGVuZFV0aWxzLmV4dGVuZERlZXAodGhpcy5jaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9uLmNyZWF0ZTxUPihFeHRlbmRVdGlscy5leHRlbmQoW10sIHRoaXMuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaWx0ZXIoZnVuYzoodmFsdWU6VCwgaW5kZXg6bnVtYmVyKSA9PiBib29sZWFuKTpDb2xsZWN0aW9uPFQ+IHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgcmVzdWx0OkFycmF5PFQ+ID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsdWU6VCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bmMuY2FsbChzY29wZSwgdmFsdWUsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4ocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6KHZhbHVlOlQsIGluZGV4Om51bWJlcikgPT4gYm9vbGVhbil7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHJlc3VsdDpUID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWx1ZTpULCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnVuYy5jYWxsKHNjb3BlLCB2YWx1ZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmV2ZXJzZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5jcmVhdGU8VD4odGhpcy5jb3B5Q2hpbGRyZW4oKS5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUNoaWxkKGFyZzphbnkpe1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPFQ+KHRoaXMucmVtb3ZlQ2hpbGRIZWxwZXIoYXJnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc29ydChmdW5jOihhOlQsIGI6VCkgPT4gYW55LCBpc1NvcnRTZWxmID0gZmFsc2Upe1xuICAgICAgICAgICAgaWYoaXNTb3J0U2VsZil7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zb3J0KGZ1bmMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmNyZWF0ZTxUPih0aGlzLmNvcHlDaGlsZHJlbigpLnNvcnQoZnVuYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG1hcChmdW5jOih2YWx1ZTpULCBpbmRleDpudW1iZXIpID0+IGFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyhlLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnIucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2UgJiYgZVtoYW5kbGVyTmFtZV0gJiYgZVtoYW5kbGVyTmFtZV0uYXBwbHkoY29udGV4dCB8fCBlLCB2YWx1ZUFycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlPGFueT4ocmVzdWx0QXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVSZXBlYXRJdGVtcygpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdExpc3QgPSAgQ29sbGVjdGlvbi5jcmVhdGU8VD4oKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKChpdGVtOlQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0TGlzdC5oYXNDaGlsZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0TGlzdC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0TGlzdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENiIHtcbiAgICBleHBvcnQgY2xhc3MgSGFzaDxUPiB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFQ+KGNoaWxkcmVuID0ge30pe1xuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyB0aGlzKDx7IFtzOnN0cmluZ106VCB9PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOnsgW3M6c3RyaW5nXTpUIH0gPSB7fSl7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46e1xuICAgICAgICAgICAgW3M6c3RyaW5nXTpUXG4gICAgICAgIH0gPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb3VudCgpe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbixcbiAgICAgICAgICAgICAgICBrZXkgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3Ioa2V5IGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEtleXMoKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZSgpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAga2V5ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKGtleSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGQoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWVzKCl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQ29sbGVjdGlvbi5jcmVhdGUoKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLFxuICAgICAgICAgICAgICAgIGtleSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihrZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKGNoaWxkcmVuW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChrZXk6c3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShrZXk6c3RyaW5nLCB2YWx1ZTphbnkpe1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5ba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oYXJnOnt9fEhhc2g8VD4pe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gbnVsbDtcblxuICAgICAgICAgICAgaWYoYXJnIGluc3RhbmNlb2YgSGFzaCl7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmcuZ2V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBhcmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihpIGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaSwgY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhcHBlbmRDaGlsZChrZXk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbltrZXldIGluc3RhbmNlb2YgQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBjID0gPGFueT4odGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICBjLmFkZENoaWxkKDxUPnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2tleV0gPSA8YW55PihDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCkuYWRkQ2hpbGQodmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQoYXJnOmFueSl7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGlmKEp1ZGdlVXRpbHMuaXNTdHJpbmcoYXJnKSl7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IDxzdHJpbmc+YXJnO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fY2hpbGRyZW5ba2V5XSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNlbGYuX2NoaWxkcmVuW2tleV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9jaGlsZHJlbltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoaWxkcmVuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uY3JlYXRlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlQWxsQ2hpbGRyZW4oKXtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGQoYXJnOmFueSk6Ym9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0Z1bmN0aW9uKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IDxGdW5jdGlvbj5hcmd1bWVudHNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoKCh2YWw6YW55LCBrZXk6c3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZ1bmModmFsLCBrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJEJSRUFLO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gPHN0cmluZz5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5ba2V5XSAhPT0gdm9pZCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZm9yRWFjaChmdW5jOkZ1bmN0aW9uLCBjb250ZXh0Pzphbnkpe1xuICAgICAgICAgICAgdmFyIGkgPSBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAoaSBpbiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkcmVuW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZmlsdGVyKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gSGFzaC5jcmVhdGUocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmaW5kT25lKGZ1bmM6RnVuY3Rpb24pe1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5fY2hpbGRyZW47XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFmdW5jLmNhbGwoc2NvcGUsIHZhbCwga2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBba2V5LCBzZWxmLmdldENoaWxkKGtleSldO1xuICAgICAgICAgICAgICAgIHJldHVybiAkQlJFQUs7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBtYXAoZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdE1hcCA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmZvckVhY2goKHZhbDphbnksIGtleTpzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyh2YWwsIGtleSk7XG5cbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09ICRSRU1PVkUpe1xuICAgICAgICAgICAgICAgICAgICBMb2cuZXJyb3IoIUp1ZGdlVXRpbHMuaXNBcnJheShyZXN1bHQpIHx8IHJlc3VsdC5sZW5ndGggIT09IDIsIExvZy5pbmZvLkZVTkNfTVVTVF9CRShcIml0ZXJhdG9yXCIsIFwiW2tleSwgdmFsdWVdXCIpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBbcmVzdWx0WzBdXSA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIEhhc2guY3JlYXRlKHJlc3VsdE1hcCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdG9Db2xsZWN0aW9uKCk6IENvbGxlY3Rpb248YW55PntcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBDb2xsZWN0aW9uLmNyZWF0ZTxhbnk+KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaCgodmFsOmFueSwga2V5OnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHZhbCBpbnN0YW5jZW9mIENvbGxlY3Rpb24pe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuYWRkQ2hpbGRyZW4odmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWwgaW5zdGFuY2VvZiBIYXNoKXtcbiAgICAgICAgICAgICAgICAgICAgTG9nLmVycm9yKHRydWUsIExvZy5pbmZvLkZVTkNfTk9UX1NVUFBPUlQoXCJ0b0NvbGxlY3Rpb25cIiwgXCJ2YWx1ZSBpcyBIYXNoXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFkZENoaWxkKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOkFycmF5PFQ+ID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgZ2V0Q291bnQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NoaWxkKGFyZzpGdW5jdGlvbnxUKTpib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZihmdW5jKHRoaXMuY2hpbGRyZW5baV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSA8YW55PmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYzphbnkgPSB0aGlzLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGNoaWxkLnVpZCAmJiBjLnVpZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQudWlkID09IGMudWlkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkID09PSBjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZChpbmRleDpudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZChjaGlsZDpUKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbihhcmc6QXJyYXk8VD58TGlzdDxUPnxhbnkpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzQXJyYXkoYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbjpBcnJheTxUPiA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmNvbmNhdChjaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGFyZyBpbnN0YW5jZW9mIExpc3Qpe1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbjpMaXN0PFQ+ID0gYXJnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuLmdldENoaWxkcmVuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkOmFueSA9IGFyZztcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB1blNoaWZ0Q2hpbGQoY2hpbGQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZUFsbENoaWxkcmVuKCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBmb3JFYWNoKGZ1bmM6RnVuY3Rpb24sIGNvbnRleHQ/OmFueSkge1xuICAgICAgICAgICAgdGhpcy5fZm9yRWFjaCh0aGlzLmNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvL3B1YmxpYyByZW1vdmVDaGlsZEF0IChpbmRleCkge1xuICAgICAgICAvLyAgICBMb2cuZXJyb3IoaW5kZXggPCAwLCBcIuW6j+WPt+W/hemhu+Wkp+S6juetieS6jjBcIik7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGNvcHlDaGlsZHJlbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uc2xpY2UoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgcmVtb3ZlQ2hpbGRIZWxwZXIoYXJnOmFueSk6QXJyYXk8VD4ge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRnVuY3Rpb24oYXJnKSkge1xuICAgICAgICAgICAgICAgIGxldCBmdW5jID0gPEZ1bmN0aW9uPmFyZztcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sIGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYXJnLnVpZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW4sIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZS51aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS51aWQgPT09IGFyZy51aWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuLCAgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUgPT09IGFyZztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2ZvckVhY2goYXJyOlRbXSwgZnVuYzpGdW5jdGlvbiwgY29udGV4dD86YW55KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSBjb250ZXh0IHx8IHJvb3QsXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMuY2FsbChzY29wZSwgYXJyW2ldLCBpKSA9PT0gJEJSRUFLKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZUNoaWxkKGFycjpUW10sIGZ1bmM6RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IG51bGwsXG4gICAgICAgICAgICAgICAgcmVtb3ZlZEVsZW1lbnRBcnIgPSBbXSxcbiAgICAgICAgICAgICAgICByZW1haW5FbGVtZW50QXJyID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuX2ZvckVhY2goYXJyLCAoZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZighIWZ1bmMuY2FsbChzZWxmLCBlKSl7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRFbGVtZW50QXJyLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbkVsZW1lbnRBcnIucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHJlbWFpbkVsZW1lbnRBcnI7XG5cbiAgICAgICAgICAgIHJldHVybiByZW1vdmVkRWxlbWVudEFycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBMb2cge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGluZm8gPSB7XG4gICAgICAgICAgICBJTlZBTElEX1BBUkFNOiBcImludmFsaWQgcGFyYW1ldGVyXCIsXG4gICAgICAgICAgICBBQlNUUkFDVF9BVFRSSUJVVEU6IFwiYWJzdHJhY3QgYXR0cmlidXRlIG5lZWQgb3ZlcnJpZGVcIixcbiAgICAgICAgICAgIEFCU1RSQUNUX01FVEhPRDogXCJhYnN0cmFjdCBtZXRob2QgbmVlZCBvdmVycmlkZVwiLFxuXG4gICAgICAgICAgICBoZWxwZXJGdW5jOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nKHZhbCkgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2VydGlvbjogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgaWYoYXJncy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWxwZXJGdW5jKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGFyZ3MubGVuZ3RoID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVscGVyRnVuYyhhcmdzWzFdLCBhcmdzWzBdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXJncy5sZW5ndGggbXVzdCA8PSAzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIEZVTkNfSU5WQUxJRDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJpbnZhbGlkXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9CRTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IGJlXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfTVVTVF9OT1RfQkU6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBub3QgYmVcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19TSE9VTEQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwic2hvdWxkXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU0hPVUxEX05PVDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJzaG91bGQgbm90XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfU1VQUE9SVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwic3VwcG9ydFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX05PVF9TVVBQT1JUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJub3Qgc3VwcG9ydFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfREVGSU5FOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJtdXN0IGRlZmluZVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX01VU1RfTk9UX0RFRklORTogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibXVzdCBub3QgZGVmaW5lXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZVTkNfVU5LTk9XOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJ1bmtub3dcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NlcnRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRlVOQ19FWFBFQ1Q6IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChcImV4cGVjdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX1VORVhQRUNUOiBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoXCJ1bmV4cGVjdFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBGVU5DX05PVF9FWElTVDogZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KFwibm90IGV4aXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdXRwdXQgRGVidWcgbWVzc2FnZS5cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGxvZyguLi5tZXNzYWdlcykge1xuICAgICAgICAgICAgaWYoIXRoaXMuX2V4ZWMoXCJsb2dcIiwgbWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5hbGVydChtZXNzYWdlcy5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2V4ZWMoXCJ0cmFjZVwiLCBtZXNzYWdlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5pat6KiA5aSx6LSl5pe277yM5Lya5o+Q56S66ZSZ6K+v5L+h5oGv77yM5L2G56iL5bqP5Lya57un57ut5omn6KGM5LiL5Y67XG4gICAgICAgICAqIOS9v+eUqOaWreiogOaNleaNieS4jeW6lOivpeWPkeeUn+eahOmdnuazleaDheWGteOAguS4jeimgea3t+a3humdnuazleaDheWGteS4jumUmeivr+aDheWGteS5i+mXtOeahOWMuuWIq++8jOWQjuiAheaYr+W/heeEtuWtmOWcqOeahOW5tuS4lOaYr+S4gOWumuimgeS9nOWHuuWkhOeQhueahOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiAx77yJ5a+56Z2e6aKE5pyf6ZSZ6K+v5L2/55So5pat6KiAXG4gICAgICAgICDmlq3oqIDkuK3nmoTluIPlsJTooajovr7lvI/nmoTlj43pnaLkuIDlrpropoHmj4/ov7DkuIDkuKrpnZ7pooTmnJ/plJnor6/vvIzkuIvpnaLmiYDov7DnmoTlnKjkuIDlrprmg4XlhrXkuIvkuLrpnZ7pooTmnJ/plJnor6/nmoTkuIDkupvkvovlrZDvvJpcbiAgICAgICAgIO+8iDHvvInnqbrmjIfpkojjgIJcbiAgICAgICAgIO+8iDLvvInovpPlhaXmiJbogIXovpPlh7rlj4LmlbDnmoTlgLzkuI3lnKjpooTmnJ/ojIPlm7TlhoXjgIJcbiAgICAgICAgIO+8iDPvvInmlbDnu4TnmoTotornlYzjgIJcbiAgICAgICAgIOmdnumihOacn+mUmeivr+WvueW6lOeahOWwseaYr+mihOacn+mUmeivr++8jOaIkeS7rOmAmuW4uOS9v+eUqOmUmeivr+WkhOeQhuS7o+eggeadpeWkhOeQhumihOacn+mUmeivr++8jOiAjOS9v+eUqOaWreiogOWkhOeQhumdnumihOacn+mUmeivr+OAguWcqOS7o+eggeaJp+ihjOi/h+eoi+S4re+8jOacieS6m+mUmeivr+awuOi/nOS4jeW6lOivpeWPkeeUn++8jOi/meagt+eahOmUmeivr+aYr+mdnumihOacn+mUmeivr+OAguaWreiogOWPr+S7peiiq+eci+aIkOaYr+S4gOenjeWPr+aJp+ihjOeahOazqOmHiu+8jOS9oOS4jeiDveS+nei1luWug+adpeiuqeS7o+eggeato+W4uOW3peS9nO+8iOOAikNvZGUgQ29tcGxldGUgMuOAi++8ieOAguS+i+Wmgu+8mlxuICAgICAgICAgaW50IG5SZXMgPSBmKCk7IC8vIG5SZXMg55SxIGYg5Ye95pWw5o6n5Yi277yMIGYg5Ye95pWw5L+d6K+B6L+U5Zue5YC85LiA5a6a5ZyoIC0xMDAgfiAxMDBcbiAgICAgICAgIEFzc2VydCgtMTAwIDw9IG5SZXMgJiYgblJlcyA8PSAxMDApOyAvLyDmlq3oqIDvvIzkuIDkuKrlj6/miafooYznmoTms6jph4pcbiAgICAgICAgIOeUseS6jiBmIOWHveaVsOS/neivgeS6hui/lOWbnuWAvOWkhOS6jiAtMTAwIH4gMTAw77yM6YKj5LmI5aaC5p6c5Ye6546w5LqGIG5SZXMg5LiN5Zyo6L+Z5Liq6IyD5Zu055qE5YC85pe277yM5bCx6KGo5piO5LiA5Liq6Z2e6aKE5pyf6ZSZ6K+v55qE5Ye6546w44CC5ZCO6Z2i5Lya6K6y5Yiw4oCc6ZqU5qCP4oCd77yM6YKj5pe25Lya5a+55pat6KiA5pyJ5pu05Yqg5rex5Yi755qE55CG6Kej44CCXG4gICAgICAgICAy77yJ5LiN6KaB5oqK6ZyA6KaB5omn6KGM55qE5Luj56CB5pS+5YWl5pat6KiA5LitXG4gICAgICAgICDmlq3oqIDnlKjkuo7ova/ku7bnmoTlvIDlj5Hlkoznu7TmiqTvvIzogIzpgJrluLjkuI3lnKjlj5HooYzniYjmnKzkuK3ljIXlkKvmlq3oqIDjgIJcbiAgICAgICAgIOmcgOimgeaJp+ihjOeahOS7o+eggeaUvuWFpeaWreiogOS4reaYr+S4jeato+ehrueahO+8jOWboOS4uuWcqOWPkeihjOeJiOacrOS4re+8jOi/meS6m+S7o+eggemAmuW4uOS4jeS8muiiq+aJp+ihjO+8jOS+i+Wmgu+8mlxuICAgICAgICAgQXNzZXJ0KGYoKSk7IC8vIGYg5Ye95pWw6YCa5bi45Zyo5Y+R6KGM54mI5pys5Lit5LiN5Lya6KKr5omn6KGMXG4gICAgICAgICDogIzkvb/nlKjlpoLkuIvmlrnms5XliJnmr5TovoPlronlhajvvJpcbiAgICAgICAgIHJlcyA9IGYoKTtcbiAgICAgICAgIEFzc2VydChyZXMpOyAvLyDlronlhahcbiAgICAgICAgIDPvvInlr7nmnaXmupDkuo7lhoXpg6jns7vnu5/nmoTlj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzogIzkuI3opoHlr7nlpJbpg6jkuI3lj6/pnaDnmoTmlbDmja7kvb/nlKjmlq3oqIDvvIzlr7nkuo7lpJbpg6jkuI3lj6/pnaDmlbDmja7vvIzlupTor6Xkvb/nlKjplJnor6/lpITnkIbku6PnoIHjgIJcbiAgICAgICAgIOWGjeasoeW8uuiwg++8jOaKiuaWreiogOeci+aIkOWPr+aJp+ihjOeahOazqOmHiuOAglxuICAgICAgICAgKiBAcGFyYW0gY29uZCDlpoLmnpxjb25k6L+U5ZueZmFsc2XvvIzliJnmlq3oqIDlpLHotKXvvIzmmL7npLptZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFzc2VydChjb25kLCAuLi5tZXNzYWdlcykge1xuICAgICAgICAgICAgaWYgKGNvbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2V4ZWMoXCJhc3NlcnRcIiwgYXJndW1lbnRzLCAxKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGVycm9yKGNvbmQsIC4uLm1lc3NhZ2UpOmFueSB7XG4gICAgICAgICAgICBpZiAoY29uZCkge1xuICAgICAgICAgICAgICAgIC8qIVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Igd2lsbCBub3QgaW50ZXJydXB0LCBpdCB3aWxsIHRocm93IGVycm9yIGFuZCBjb250aW51ZSBleGVjIHRoZSBsZWZ0IHN0YXRlbWVudHNcblxuICAgICAgICAgICAgICAgIGJ1dCBoZXJlIG5lZWQgaW50ZXJydXB0ISBzbyBub3QgdXNlIGl0IGhlcmUuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy9pZiAoIXRoaXMuX2V4ZWMoXCJlcnJvclwiLCBhcmd1bWVudHMsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmpvaW4oXCJcXG5cIikpO1xuICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB3YXJuKC4uLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9leGVjKFwid2FyblwiLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4ZWMoXCJ0cmFjZVwiLCBbXCJ3YXJuIHRyYWNlXCJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9leGVjKGNvbnNvbGVNZXRob2QsIGFyZ3MsIHNsaWNlQmVnaW4gPSAwKSB7XG4gICAgICAgICAgICBpZiAocm9vdC5jb25zb2xlICYmIHJvb3QuY29uc29sZVtjb25zb2xlTWV0aG9kXSkge1xuICAgICAgICAgICAgICAgIHJvb3QuY29uc29sZVtjb25zb2xlTWV0aG9kXS5hcHBseShyb290LmNvbnNvbGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIHNsaWNlQmVnaW4pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFF1ZXVlPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZyb250KCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlYXIoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHB1c2goZWxlbWVudDpUKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwb3AoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsZWFyKCl7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIFN0YWNrPFQ+IGV4dGVuZHMgTGlzdDxUPntcbiAgICAgICAgcHVibGljIHN0YXRpYyBjcmVhdGU8VD4oY2hpbGRyZW4gPSBbXSl7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IHRoaXMoPEFycmF5PFQ+PmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoaWxkcmVuOkFycmF5PFQ+ID0gW10pe1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBwdXNoKGVsZW1lbnQ6VCl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcG9wKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhcigpe1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGRlY2xhcmUgdmFyIGdsb2JhbDphbnksIG1vZHVsZTphbnk7XG5cbiAgICBleHBvcnQgY2xhc3MgSnVkZ2VVdGlscyB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNBcnJheSh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Z1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNOdW1iZXIob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdHIpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0Jvb2xlYW4ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBCb29sZWFuXVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc0RvbShvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5tYXRjaCgvXFxbb2JqZWN0IEhUTUxcXHcrLykgIT09IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat5piv5ZCm5Li65a+56LGh5a2X6Z2i6YeP77yIe33vvIlcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaXNEaXJlY3RPYmplY3Qob2JqKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeWuv+S4u+WvueixoeaYr+WQpuWPr+iwg+eUqFxuICAgICAgICAgKlxuICAgICAgICAgKiDku7vkvZXlr7nosaHvvIzlpoLmnpzlhbbor63kuYnlnKhFQ01BU2NyaXB06KeE6IyD5Lit6KKr5a6a5LmJ6L+H77yM6YKj5LmI5a6D6KKr56ew5Li65Y6f55Sf5a+56LGh77ybXG4gICAgICAgICDnjq/looPmiYDmj5DkvpvnmoTvvIzogIzlnKhFQ01BU2NyaXB06KeE6IyD5Lit5rKh5pyJ6KKr5o+P6L+w55qE5a+56LGh77yM5oiR5Lus56ew5LmL5Li65a6/5Li75a+56LGh44CCXG5cbiAgICAgICAgIOivpeaWueazleeUqOS6jueJueaAp+ajgOa1i++8jOWIpOaWreWvueixoeaYr+WQpuWPr+eUqOOAgueUqOazleWmguS4i++8mlxuXG4gICAgICAgICBNeUVuZ2luZSBhZGRFdmVudCgpOlxuICAgICAgICAgaWYgKFRvb2wuanVkZ2UuaXNIb3N0TWV0aG9kKGRvbSwgXCJhZGRFdmVudExpc3RlbmVyXCIpKSB7ICAgIC8v5Yik5patZG9t5piv5ZCm5YW35pyJYWRkRXZlbnRMaXN0ZW5lcuaWueazlVxuICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoc0V2ZW50VHlwZSwgZm5IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGlzSG9zdE1ldGhvZChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmplY3RbcHJvcGVydHldO1xuXG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09IFwib2JqZWN0XCIgJiYgISFvYmplY3RbcHJvcGVydHldKSB8fFxuICAgICAgICAgICAgICAgIHR5cGUgPT09IFwidW5rbm93blwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBpc05vZGVKcygpe1xuICAgICAgICAgICAgcmV0dXJuICgodHlwZW9mIGdsb2JhbCAhPSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5tb2R1bGUpIHx8ICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIpKSAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGRlY2xhcmUgdmFyIGdsb2JhbDphbnksd2luZG93OmFueTtcblxuICAgIGV4cG9ydCB2YXIgcm9vdDphbnk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdkQ2IsIFwicm9vdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihKdWRnZVV0aWxzLmlzTm9kZUpzKCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIm1vZHVsZSB3ZENie1xuLy8gcGVyZm9ybWFuY2Uubm93IHBvbHlmaWxsXG5cbiAgICBpZiAoJ3BlcmZvcm1hbmNlJyBpbiByb290ID09PSBmYWxzZSkge1xuICAgICAgICByb290LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4vLyBJRSA4XG4gICAgRGF0ZS5ub3cgPSAoIERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0gKTtcblxuICAgIGlmICgnbm93JyBpbiByb290LnBlcmZvcm1hbmNlID09PSBmYWxzZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcgJiYgcm9vdC5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIHJvb3QucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBvZmZzZXQ7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZXhwb3J0IGNvbnN0ICRCUkVBSyA9IHtcbiAgICAgICAgYnJlYWs6dHJ1ZVxuICAgIH07XG4gICAgZXhwb3J0IGNvbnN0ICRSRU1PVkUgPSB2b2lkIDA7XG59XG5cblxuIiwibW9kdWxlIHdkQ2J7XG4gICAgZGVjbGFyZSB2YXIgZG9jdW1lbnQ6YW55O1xuXG4gICAgZXhwb3J0IGNsYXNzIEFqYXhVdGlsc3tcbiAgICAgICAgLyohXG4gICAgICAgICDlrp7njrBhamF4XG5cbiAgICAgICAgIGFqYXgoe1xuICAgICAgICAgdHlwZTpcInBvc3RcIiwvL3Bvc3TmiJbogIVnZXTvvIzpnZ7lv4XpobtcbiAgICAgICAgIHVybDpcInRlc3QuanNwXCIsLy/lv4XpobvnmoRcbiAgICAgICAgIGRhdGE6XCJuYW1lPWRpcG9vJmluZm89Z29vZFwiLC8v6Z2e5b+F6aG7XG4gICAgICAgICBkYXRhVHlwZTpcImpzb25cIiwvL3RleHQveG1sL2pzb27vvIzpnZ7lv4XpobtcbiAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7Ly/lm57osIPlh73mlbDvvIzpnZ7lv4XpobtcbiAgICAgICAgIGFsZXJ0KGRhdGEubmFtZSk7XG4gICAgICAgICB9XG4gICAgICAgICB9KTsqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGFqYXgoY29uZil7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNvbmYudHlwZTsvL3R5cGXlj4LmlbAs5Y+v6YCJXG4gICAgICAgICAgICB2YXIgdXJsID0gY29uZi51cmw7Ly91cmzlj4LmlbDvvIzlv4XloatcbiAgICAgICAgICAgIHZhciBkYXRhID0gY29uZi5kYXRhOy8vZGF0YeWPguaVsOWPr+mAie+8jOWPquacieWcqHBvc3Tor7fmsYLml7bpnIDopoFcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IGNvbmYuZGF0YVR5cGU7Ly9kYXRhdHlwZeWPguaVsOWPr+mAiVxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjb25mLnN1Y2Nlc3M7Ly/lm57osIPlh73mlbDlj6/pgIlcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNvbmYuZXJyb3I7XG4gICAgICAgICAgICB2YXIgeGhyID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHsvL3R5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLpnZXRcbiAgICAgICAgICAgICAgICB0eXBlID0gXCJnZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gbnVsbCkgey8vZGF0YVR5cGXlj4LmlbDlj6/pgInvvIzpu5jorqTkuLp0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyID0gdGhpcy5fY3JlYXRlQWpheChlcnJvcik7XG4gICAgICAgICAgICBpZiAoIXhocikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU291bmRGaWxlKGRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkdFVFwiIHx8IHR5cGUgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwiUE9TVFwiIHx8IHR5cGUgPT09IFwicG9zdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenGFqYXjorr/pl67nmoTmmK/mnKzlnLDmlofku7bvvIzliJlzdGF0dXPkuLowXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHNlbGYuX2lzTG9jYWxGaWxlKHhoci5zdGF0dXMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09PSBcInRleHRcIiB8fCBkYXRhVHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5pmu6YCa5paH5pysXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09IFwieG1sXCIgfHwgZGF0YVR5cGUgPT09IFwiWE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5o6l5pS2eG1s5paH5qGjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gXCJqc29uXCIgfHwgZGF0YVR5cGUgPT09IFwiSlNPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgIT09IG51bGwpIHsvL+Wwhmpzb27lrZfnrKbkuLLovazmjaLkuLpqc+WvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGV2YWwoXCIoXCIgKyB4aHIucmVzcG9uc2VUZXh0ICsgXCIpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLl9pc1NvdW5kRmlsZShkYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAhPT0gbnVsbCkgey8v5bCGanNvbuWtl+espuS4sui9rOaNouS4umpz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZUFqYXgoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHsvL0lF57O75YiX5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJtaWNyb3NvZnQueG1saHR0cFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsvL+mdnklF5rWP6KeI5ZmoXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHhociwge21lc3NhZ2U6IFwi5oKo55qE5rWP6KeI5Zmo5LiN5pSv5oyBYWpheO+8jOivt+abtOaNou+8gVwifSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaXNMb2NhbEZpbGUoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuVVJMLmNvbnRhaW4oXCJmaWxlOi8vXCIpICYmIHN0YXR1cyA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9pc1NvdW5kRmlsZShkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEFycmF5VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZVJlcGVhdEl0ZW1zKGFycjpBcnJheTxhbnk+LCBpc0VxdWFsOihhOmFueSwgYjphbnkpID0+IGJvb2xlYW4gPSAoYSwgYik9PiB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgICAgfSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdEFyciA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29udGFpbihyZXN1bHRBcnIsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc0VxdWFsKHZhbCwgZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdEFyci5wdXNoKGVsZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdEFycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udGFpbihhcnI6QXJyYXk8YW55PiwgZWxlOmFueSkge1xuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihlbGUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmM6RnVuY3Rpb24gPSBlbGU7XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZnVuYy5jYWxsKG51bGwsIHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZSA9PT0gdmFsdWUgfHwgKHZhbHVlLmNvbnRhaW4gJiYgdmFsdWUuY29udGFpbihlbGUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgIH1cbn1cbiIsIm1vZHVsZSB3ZENie1xuICAgIGV4cG9ydCBjbGFzcyBDb252ZXJ0VXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdG9TdHJpbmcob2JqOmFueSl7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc051bWJlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pZiAoSnVkZ2VVdGlscy5pc2pRdWVyeShvYmopKSB7XG4gICAgICAgICAgICAvLyAgICByZXR1cm4gX2pxVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgaWYgKEp1ZGdlVXRpbHMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2RlVG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzRGlyZWN0T2JqZWN0KG9iaikgfHwgSnVkZ2VVdGlscy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9jb252ZXJ0Q29kZVRvU3RyaW5nKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4udG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuc2xpY2UoMSwgLTEpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50VXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmRFdmVudChjb250ZXh0LCBmdW5jKSB7XG4gICAgICAgICAgICAvL3ZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgIC8vICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZnVuLmFwcGx5KG9iamVjdCwgW3NlbGYud3JhcEV2ZW50KGV2ZW50KV0uY29uY2F0KGFyZ3MpKTsgLy/lr7nkuovku7blr7nosaHov5vooYzljIXoo4VcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkRXZlbnQoZG9tLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChKdWRnZVV0aWxzLmlzSG9zdE1ldGhvZChkb20sIFwiYWRkRXZlbnRMaXN0ZW5lclwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcImF0dGFjaEV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgZG9tLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21bXCJvblwiICsgZXZlbnROYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUV2ZW50KGRvbSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0hvc3RNZXRob2QoZG9tLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikpIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEp1ZGdlVXRpbHMuaXNIb3N0TWV0aG9kKGRvbSwgXCJkZXRhY2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tW1wib25cIiArIGV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGV4cG9ydCBjbGFzcyBFeHRlbmRVdGlscyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7Hmi7fotJ1cbiAgICAgICAgICpcbiAgICAgICAgICog56S65L6L77yaXG4gICAgICAgICAqIOWmguaenOaLt+i0neWvueixoeS4uuaVsOe7hO+8jOiDveWkn+aIkOWKn+aLt+i0ne+8iOS4jeaLt+i0nUFycmF55Y6f5Z6L6ZO+5LiK55qE5oiQ5ZGY77yJXG4gICAgICAgICAqIGV4cGVjdChleHRlbmQuZXh0ZW5kRGVlcChbMSwgeyB4OiAxLCB5OiAxIH0sIFwiYVwiLCB7IHg6IDIgfSwgWzJdXSkpLnRvRXF1YWwoWzEsIHsgeDogMSwgeTogMSB9LCBcImFcIiwgeyB4OiAyIH0sIFsyXV0pO1xuICAgICAgICAgKlxuICAgICAgICAgKiDlpoLmnpzmi7fotJ3lr7nosaHkuLrlr7nosaHvvIzog73lpJ/miJDlip/mi7fotJ3vvIjog73mi7fotJ3ljp/lnovpk77kuIrnmoTmiJDlkZjvvIlcbiAgICAgICAgICogdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICBmdW5jdGlvbiBBKCkge1xuXHQgICAgICAgICAgICB9O1xuICAgICAgICAgQS5wcm90b3R5cGUuYSA9IDE7XG5cbiAgICAgICAgIGZ1bmN0aW9uIEIoKSB7XG5cdCAgICAgICAgICAgIH07XG4gICAgICAgICBCLnByb3RvdHlwZSA9IG5ldyBBKCk7XG4gICAgICAgICBCLnByb3RvdHlwZS5iID0geyB4OiAxLCB5OiAxIH07XG4gICAgICAgICBCLnByb3RvdHlwZS5jID0gW3sgeDogMSB9LCBbMl1dO1xuXG4gICAgICAgICB2YXIgdCA9IG5ldyBCKCk7XG5cbiAgICAgICAgIHJlc3VsdCA9IGV4dGVuZC5leHRlbmREZWVwKHQpO1xuXG4gICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFxuICAgICAgICAge1xuICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgYjogeyB4OiAxLCB5OiAxIH0sXG4gICAgICAgICAgICAgYzogW3sgeDogMSB9LCBbMl1dXG4gICAgICAgICB9KTtcbiAgICAgICAgICogQHBhcmFtIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgICAgICogQHJldHVybnNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kRGVlcChwYXJlbnQsIGNoaWxkPyxmaWx0ZXI9ZnVuY3Rpb24odmFsLCBpKXtyZXR1cm4gdHJ1ZTt9KSB7XG4gICAgICAgICAgICB2YXIgaSA9IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuID0gMCxcbiAgICAgICAgICAgICAgICB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgc0FyciA9IFwiW29iamVjdCBBcnJheV1cIixcbiAgICAgICAgICAgICAgICBzT2IgPSBcIltvYmplY3QgT2JqZWN0XVwiLFxuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlwiLFxuICAgICAgICAgICAgICAgIF9jaGlsZCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8v5pWw57uE55qE6K+d77yM5LiN6I635b6XQXJyYXnljp/lnovkuIrnmoTmiJDlkZjjgIJcbiAgICAgICAgICAgIGlmICh0b1N0ci5jYWxsKHBhcmVudCkgPT09IHNBcnIpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHBhcmVudC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZighZmlsdGVyKHBhcmVudFtpXSwgaSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdG9TdHIuY2FsbChwYXJlbnRbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gc0FyciB8fCB0eXBlID09PSBzT2IpIHsgICAgLy/lpoLmnpzkuLrmlbDnu4TmiJZvYmplY3Tlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZFtpXSA9IHR5cGUgPT09IHNBcnIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZShwYXJlbnRbaV0sIF9jaGlsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSBwYXJlbnRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+WvueixoeeahOivne+8jOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAguWboOS4uuiAg+iZkeS7peS4i+aDheaZr++8mlxuICAgICAgICAgICAgLy/nsbtB57un5om/5LqO57G7Qu+8jOeOsOWcqOaDs+imgeaLt+i0neexu0HnmoTlrp7kvoth55qE5oiQ5ZGY77yI5YyF5ous5LuO57G7Que7p+aJv+adpeeahOaIkOWRmO+8ie+8jOmCo+S5iOWwsemcgOimgeiOt+W+l+WOn+Wei+mTvuS4iueahOaIkOWRmOOAglxuICAgICAgICAgICAgZWxzZSBpZiAodG9TdHIuY2FsbChwYXJlbnQpID09PSBzT2IpIHtcbiAgICAgICAgICAgICAgICBfY2hpbGQgPSBjaGlsZCB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWZpbHRlcihwYXJlbnRbaV0sIGkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRvU3RyLmNhbGwocGFyZW50W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHNBcnIgfHwgdHlwZSA9PT0gc09iKSB7ICAgIC8v5aaC5p6c5Li65pWw57uE5oiWb2JqZWN05a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRbaV0gPSB0eXBlID09PSBzQXJyID8gW10gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUocGFyZW50W2ldLCBfY2hpbGRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoaWxkW2ldID0gcGFyZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX2NoaWxkID0gcGFyZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1heaLt+i0nVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQoZGVzdGluYXRpb246YW55LCBzb3VyY2U6YW55KSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBcIlwiO1xuXG4gICAgICAgICAgICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvcHlQdWJsaWNBdHRyaShzb3VyY2U6YW55KXtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGwsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5leHRlbmREZWVwKHNvdXJjZSwgZGVzdGluYXRpb24sIGZ1bmN0aW9uKGl0ZW0sIHByb3BlcnR5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuc2xpY2UoMCwgMSkgIT09IFwiX1wiXG4gICAgICAgICAgICAgICAgICAgICYmICFKdWRnZVV0aWxzLmlzRnVuY3Rpb24oaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJtb2R1bGUgd2RDYntcbiAgICB2YXIgU1BMSVRQQVRIX1JFR0VYID1cbiAgICAgICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG5cbiAgICAvL3JlZmVyZW5jZSBmcm9tXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vY29va2Zyb250L2xlYXJuLW5vdGUvYmxvYi9tYXN0ZXIvYmxvZy1iYWNrdXAvMjAxNC9ub2RlanMtcGF0aC5tZFxuICAgIGV4cG9ydCBjbGFzcyBQYXRoVXRpbHN7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZW5hbWUocGF0aDpzdHJpbmcsIGV4dD86c3RyaW5nKXtcbiAgICAgICAgICAgIHZhciBmID0gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAgICAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICAgICAgICAgICAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICAgICAgICAgICAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNoYW5nZUV4dG5hbWUocGF0aFN0cjpzdHJpbmcsIGV4dG5hbWU6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgZXh0bmFtZSA9IGV4dG5hbWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIuaW5kZXhPZihcIj9cIiksXG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoaW5kZXgpO1xuICAgICAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gcGF0aFN0ci5sYXN0SW5kZXhPZihcIi5cIik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApe1xuICAgICAgICAgICAgICByZXR1cm4gcGF0aFN0ciArIGV4dG5hbWUgKyB0ZW1wU3RyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpICsgZXh0bmFtZSArIHRlbXBTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNoYW5nZUJhc2VuYW1lKHBhdGhTdHI6c3RyaW5nLCBiYXNlbmFtZTpzdHJpbmcsIGlzU2FtZUV4dDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IG51bGwsXG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IG51bGwsXG4gICAgICAgICAgICAgICAgZXh0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGJhc2VuYW1lLmluZGV4T2YoXCIuXCIpID09IDApe1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VFeHRuYW1lKHBhdGhTdHIsIGJhc2VuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggPSBwYXRoU3RyLmluZGV4T2YoXCI/XCIpO1xuICAgICAgICAgICAgdGVtcFN0ciA9IFwiXCI7XG4gICAgICAgICAgICBleHQgPSBpc1NhbWVFeHQgPyB0aGlzLmV4dG5hbWUocGF0aFN0cikgOiBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgICAgICBwYXRoU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHBhdGhTdHIubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8PSAwID8gMCA6IGluZGV4ICsgMTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGJhc2VuYW1lICsgZXh0ICsgdGVtcFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0bmFtZShwYXRoOnN0cmluZyl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3BsaXRQYXRoKHBhdGgpWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBkaXJuYW1lKHBhdGg6c3RyaW5nKXtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9zcGxpdFBhdGgocGF0aCksXG4gICAgICAgICAgICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgICAgICAgICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgICAgICAgICAgIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgICAgICAgICAgICAgLy9ubyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGlyKSB7XG4gICAgICAgICAgICAgICAgLy9pdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgICAgICAgICAgICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcm9vdCArIGRpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9zcGxpdFBhdGgoZmlsZU5hbWU6c3RyaW5nKXtcbiAgICAgICAgICAgIHJldHVybiBTUExJVFBBVEhfUkVHRVguZXhlYyhmaWxlTmFtZSkuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgd2RDYiB7XG4gICAgZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVXRpbHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGJpbmQob2JqZWN0OmFueSwgZnVuYzpGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShvYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHdkQ2Ige1xuICAgIGRlY2xhcmUgdmFyIGRvY3VtZW50OmFueTtcblxuICAgIGV4cG9ydCBjbGFzcyBEb21RdWVyeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGVsZVN0cjpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkb206SFRNTEVsZW1lbnQpO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBuZXcgdGhpcyhhcmdzWzBdKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2RvbXM6QXJyYXk8SFRNTEVsZW1lbnQ+ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVTdHI6c3RyaW5nKTtcbiAgICAgICAgY29uc3RydWN0b3IoZG9tOkhUTUxFbGVtZW50KTtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAoSnVkZ2VVdGlscy5pc0RvbShhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBbYXJnc1swXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2lzRG9tRWxlU3RyKGFyZ3NbMF0pKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb21zID0gW3RoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3NbMF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXQoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kb21zW2luZGV4XTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoZWxlU3RyOnN0cmluZyk7XG4gICAgICAgIHB1YmxpYyBwcmVwZW5kKGRvbTpIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgcHVibGljIHByZXBlbmQoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIHRhcmdldERvbTpIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRhcmdldERvbSA9IHRoaXMuX2J1aWxkRG9tKGFyZ3NbMF0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkb20gb2YgdGhpcy5fZG9tcykge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tLmluc2VydEJlZm9yZSh0YXJnZXREb20sIGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHByZXBlbmRUbyhlbGVTdHI6c3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RG9tOkRvbVF1ZXJ5ID0gbnVsbDtcblxuICAgICAgICAgICAgdGFyZ2V0RG9tID0gRG9tUXVlcnkuY3JlYXRlKGVsZVN0cik7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXREb20ucHJlcGVuZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZG9tIG9mIHRoaXMuX2RvbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tICYmIGRvbS5wYXJlbnROb2RlICYmIGRvbS50YWdOYW1lICE9ICdCT0RZJykge1xuICAgICAgICAgICAgICAgICAgICBkb20ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3NzKHByb3BlcnR5OnN0cmluZywgdmFsdWU6c3RyaW5nKXtcbiAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgZG9tLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGF0dHIobmFtZTpzdHJpbmcpO1xuICAgICAgICBwdWJsaWMgYXR0cihuYW1lOnN0cmluZywgdmFsdWU6c3RyaW5nKTtcblxuICAgICAgICBwdWJsaWMgYXR0ciguLi5hcmdzKXtcbiAgICAgICAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3NbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoMCkuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJnc1sxXTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGRvbSBvZiB0aGlzLl9kb21zKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2lzRG9tRWxlU3RyKGVsZVN0cjpzdHJpbmcpe1xuICAgICAgICAgICAgcmV0dXJuIGVsZVN0ci5tYXRjaCgvPChcXHcrKVtePl0qPjxcXC9cXDE+LykgIT09IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9idWlsZERvbShlbGVTdHI6c3RyaW5nKTpIVE1MRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oZG9tOkhUTUxIdG1sRWxlbWVudCk6SFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfYnVpbGREb20oLi4uYXJncyk6SFRNTEVsZW1lbnQge1xuICAgICAgICAgICAgaWYoSnVkZ2VVdGlscy5pc1N0cmluZyhhcmdzWzBdKSl7XG4gICAgICAgICAgICAgICAgbGV0IGRpdiA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICAgICAgICAgIGVsZVN0cjpzdHJpbmcgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGVsZVN0cjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jcmVhdGVFbGVtZW50KGVsZVN0cil7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVTdHIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=