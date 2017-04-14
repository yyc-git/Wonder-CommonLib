export declare class Log {
    static info: {
        INVALID_PARAM: string;
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
        FUNC_EXIST: (...args: any[]) => any;
        FUNC_NOT_EXIST: (...args: any[]) => any;
        FUNC_ONLY: (...args: any[]) => any;
        FUNC_CAN_NOT: (...args: any[]) => any;
    };
    static log(...messages: any[]): void;
    static assert(cond: any, ...messages: any[]): void;
    static error(cond: any, ...message: any[]): any;
    static warn(...message: any[]): void;
    private static _exec(consoleMethod, args, sliceBegin?);
}
