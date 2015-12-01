module wdCb {
    export class Log {
        public static info = {
            INVALID_PARAM: "invalid parameter",
            ABSTRACT_ATTRIBUTE: "abstract attribute need override",
            ABSTRACT_METHOD: "abstract method need override",

            helperFunc: function(...args){
                var result = "";

                args.forEach(function(val){
                    result += String(val) + " ";
                });

                return result.slice(0, -1);
            },
            assertion: function(...args){
                if(args.length === 2){
                    return this.helperFunc(args[0], args[1]);
                }
                else if(args.length === 3){
                    return this.helperFunc(args[1], args[0], args[2]);
                }
                else{
                    throw new Error("args.length must <= 3");
                }
            },

            FUNC_INVALID: function (...args) {
                args.unshift("invalid");

                return this.assertion.apply(this, args);
            },
            FUNC_MUST: function (...args) {
                args.unshift("must");

                return this.assertion.apply(this, args);
            },
            FUNC_MUST_BE: function (...args) {
                args.unshift("must be");

                return this.assertion.apply(this, args);
            },
            FUNC_MUST_NOT_BE: function (...args) {
                args.unshift("must not be");

                return this.assertion.apply(this, args);
            },
            FUNC_SHOULD: function (...args) {
                args.unshift("should");

                return this.assertion.apply(this, args);
            },
            FUNC_SHOULD_NOT: function (...args) {
                args.unshift("should not");

                return this.assertion.apply(this, args);
            },
            FUNC_SUPPORT: function(...args){
                args.unshift("support");

                return this.assertion.apply(this, args);
            },
            FUNC_NOT_SUPPORT: function(...args){
                args.unshift("not support");

                return this.assertion.apply(this, args);
            },
            FUNC_MUST_DEFINE: function(...args){
                args.unshift("must define");

                return this.assertion.apply(this, args);
            },
            FUNC_MUST_NOT_DEFINE: function(...args){
                args.unshift("must not define");

                return this.assertion.apply(this, args);
            },
            FUNC_UNKNOW: function(...args){
                args.unshift("unknow");

                return this.assertion.apply(this, args);
            },
            FUNC_EXPECT: function(...args){
                args.unshift("expect");

                return this.assertion.apply(this, args);
            },
            FUNC_UNEXPECT: function(...args){
                args.unshift("unexpect");

                return this.assertion.apply(this, args);
            },
            FUNC_NOT_EXIST: function(...args){
                args.unshift("not exist");

                return this.assertion.apply(this, args);
            }
        };

        /**
         * Output Debug message.
         * @function
         * @param {String} message
         */
        public static log(...messages) {
            if(!this._exec("log", messages)) {
                root.alert(messages.join(","));
            }

            this._exec("trace", messages);
        }

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
        public static assert(cond, ...messages) {
            if (cond) {
                if (!this._exec("assert", arguments, 1)) {
                    this.log.apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }
        }

        public static error(cond, ...message):any {
            if (cond) {
                /*!
                console.error will not interrupt, it will throw error and continue exec the left statements

                but here need interrupt! so not use it here.
                 */
                //if (!this._exec("error", arguments, 1)) {
                    throw new Error(Array.prototype.slice.call(arguments, 1).join("\n"));
                //}
            }
        }

        public static warn(...message) {
            var result = this._exec("warn", arguments);

            if (!result) {
                this.log.apply(this, arguments);
            }
            else{
                this._exec("trace", ["warn trace"]);
            }
        }

        private static _exec(consoleMethod, args, sliceBegin = 0) {
            if (root.console && root.console[consoleMethod]) {
                root.console[consoleMethod].apply(root.console, Array.prototype.slice.call(args, sliceBegin));

                return true;
            }

            return false;
        }
    }
}
