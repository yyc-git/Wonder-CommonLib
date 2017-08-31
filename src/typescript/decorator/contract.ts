import { Log } from "../../";

var _describeContext = null;

export function assert(cond: boolean, message: string = "contract error") {
    Log.error(!cond, message);
}

export function describe(message: string, func: Function, preCondition: Function = () => true, context: any = this) {
    if (preCondition.call(context, null)) {
        _describeContext = context;

        try {
            func.call(context, null);
        }
        catch (e) {
            assert(false, `${message}->${e.message}`);
        }
        finally {
            _describeContext = null;
        }
    }
}

export function it(message: string, func: Function, context?: any) {
    try {
        if (arguments.length === 3) {
            func.call(context, null);
        }
        else {
            if (_describeContext) {
                func.call(_describeContext, null);
            }
            else {
                func();
            }
        }
    }
    catch (e) {
        assert(false, `${message}->${e.message}`);
    }
}

export function requireFunc(checkFunc: Function, bodyFunc: Function, compileIsTest: boolean, runtimeIsTestFunc: Function) {
    if (!compileIsTest) {
        return bodyFunc;
    }

    return (...paramArr) => {
        if (!runtimeIsTestFunc()) {
            return bodyFunc.apply(null, paramArr);
        }

        checkFunc.apply(null, paramArr);

        return bodyFunc.apply(null, paramArr);
    }
}

export function ensureFunc(checkFunc: Function, bodyFunc: Function, compileIsTest: boolean, runtimeIsTestFunc: Function) {
    if (!compileIsTest) {
        return bodyFunc;
    }

    return (...paramArr) => {
        if (!runtimeIsTestFunc()) {
            return bodyFunc.apply(null, paramArr);
        }

        let result = bodyFunc.apply(null, paramArr);

        checkFunc.apply(null, [result].concat(paramArr));

        return result;
    }
}
