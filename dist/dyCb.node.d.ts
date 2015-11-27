declare module dyCb {
    class JudgeUtils {
        static isArray(val: any): boolean;
        static isFunction(func: any): boolean;
        static isNumber(obj: any): boolean;
        static isString(str: any): boolean;
        static isBoolean(obj: any): boolean;
        static isDom(obj: any): boolean;
        /**
         * 判断是否为对象字面量（{}）
         */
        static isDirectObject(obj: any): boolean;
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
        static isHostMethod(object: any, property: any): boolean;
        static isNodeJs(): boolean;
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    var root: any;
}

declare module dyCb {
}

declare module dyCb {
    const $BREAK: {
        break: boolean;
    };
    const $REMOVE: any;
}

declare module dyCb {
    class Log {
        static info: {
            INVALID_PARAM: string;
            ABSTRACT_ATTRIBUTE: string;
            ABSTRACT_METHOD: string;
            helperFunc: (...args: any[]) => string;
            assertion: (...args: any[]) => any;
            FUNC_INVALID: (...args: any[]) => any;
            FUNC_MUST: (...args: any[]) => any;
            FUNC_MUST_BE: (...args: any[]) => any;
            FUNC_MUST_NOT_BE: (...args: any[]) => any;
            FUNC_SHOULD: (...args: any[]) => any;
            FUNC_SHOULD_NOT: (...args: any[]) => any;
            FUNC_SUPPORT: (...args: any[]) => any;
            FUNC_NOT_SUPPORT: (...args: any[]) => any;
            FUNC_MUST_DEFINE: (...args: any[]) => any;
            FUNC_MUST_NOT_DEFINE: (...args: any[]) => any;
            FUNC_UNKNOW: (...args: any[]) => any;
            FUNC_EXPECT: (...args: any[]) => any;
            FUNC_UNEXPECT: (...args: any[]) => any;
            FUNC_NOT_EXIST: (...args: any[]) => any;
        };
        /**
         * Output Debug message.
         * @function
         * @param {String} message
         */
        static log(...message: any[]): void;
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
        static assert(cond: any, ...message: any[]): void;
        static error(cond: any, ...message: any[]): any;
        static warn(...message: any[]): void;
        private static _exec(consoleMethod, args, sliceBegin?);
    }
}

/// <reference path="filePath.d.ts" />
declare module dyCb {
    class List<T> {
        protected children: Array<T>;
        getCount(): number;
        hasChild(arg: Function | T): boolean;
        getChildren(): T[];
        getChild(index: number): T;
        addChild(child: T): List<T>;
        addChildren(arg: Array<T> | List<T> | any): List<T>;
        unShiftChild(child: T): void;
        removeAllChildren(): List<T>;
        forEach(func: Function, context?: any): List<T>;
        toArray(): T[];
        protected copyChildren(): T[];
        protected removeChildHelper(arg: any): Array<T>;
        private _indexOf(arr, arg);
        private _contain(arr, arg);
        private _forEach(arr, func, context?);
        private _removeChild(arr, func);
    }
}

/// <reference path="filePath.d.ts" />
declare module dyCb {
    class Hash<T> {
        static create<T>(children?: {}): Hash<T>;
        constructor(children?: {
            [s: string]: T;
        });
        private _children;
        getChildren(): {
            [s: string]: T;
        };
        getCount(): number;
        getKeys(): Collection<{}>;
        getValues(): Collection<{}>;
        getChild(key: string): T;
        setValue(key: string, value: any): Hash<T>;
        addChild(key: string, value: any): Hash<T>;
        addChildren(arg: {} | Hash<T>): void;
        appendChild(key: string, value: any): Hash<T>;
        removeChild(arg: any): Collection<{}>;
        removeAllChildren(): void;
        hasChild(arg: any): boolean;
        forEach(func: Function, context?: any): Hash<T>;
        filter(func: Function): Hash<{}>;
        findOne(func: Function): any[];
        map(func: Function): Hash<{}>;
        toCollection(): Collection<any>;
    }
}

declare module dyCb {
    class Queue<T> extends List<T> {
        static create<T>(children?: any[]): Queue<T>;
        constructor(children?: Array<T>);
        push(element: T): void;
        pop(): T;
        clear(): void;
    }
}

declare module dyCb {
    class Stack<T> extends List<T> {
        static create<T>(children?: any[]): Stack<T>;
        constructor(children?: Array<T>);
        push(element: T): void;
        pop(): T;
        clear(): void;
    }
}

declare module dyCb {
    class AjaxUtils {
        static ajax(conf: any): void;
        private static _createAjax(error);
        private static _isLocalFile(status);
        private static _isSoundFile(dataType);
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class ArrayUtils {
        static removeRepeatItems(arr: Array<any>, isEqual?: (a: any, b: any) => boolean): any[];
        static contain(arr: Array<any>, ele: any): boolean;
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class ConvertUtils {
        static toString(obj: any): string;
        private static _convertCodeToString(fn);
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class EventUtils {
        static bindEvent(context: any, func: any): (event: any) => any;
        static addEvent(dom: any, eventName: any, handler: any): void;
        static removeEvent(dom: any, eventName: any, handler: any): void;
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class ExtendUtils {
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
        static extendDeep(parent: any, child?: any, filter?: (val: any, i: any) => boolean): any;
        /**
         * 浅拷贝
         */
        static extend(destination: any, source: any): any;
        static copyPublicAttri(source: any): {};
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class PathUtils {
        static basename(path: string, ext?: string): string;
        static extname(path: string): string;
        static dirname(path: string): string;
        private static _splitPath(fileName);
    }
}

/// <reference path="../filePath.d.ts" />
declare module dyCb {
    class DomQuery {
        static create(eleStr: string): DomQuery;
        private _doms;
        constructor(eleStr: any);
        get(index: any): HTMLElement;
        createElement(eleStr: any): any;
        prepend(eleStr: string): DomQuery;
        remove(): DomQuery;
        private _buildDom(eleStr);
    }
}

/// <reference path="filePath.d.ts" />
declare module dyCb {
    class Collection<T> extends List<T> {
        static create<T>(children?: any[]): Collection<T>;
        constructor(children?: Array<T>);
        copy(isDeep?: boolean): Collection<T>;
        filter(func: (value: T, index: number) => boolean): Collection<T>;
        findOne(func: (value: T, index: number) => boolean): T;
        reverse(): Collection<T>;
        removeChild(arg: any): Collection<T>;
        sort(func: (a: T, b: T) => any): Collection<T>;
        map(func: (value: T, index: number) => any): Collection<any>;
        removeRepeatItems(): Collection<T>;
    }
}

declare module "dycb" {
export = dyCb;
}