import { Collection } from "./Collection";
import { JudgeUtils } from "./utils/JudgeUtils";
import { $BREAK, $REMOVE } from "./global/Const";
import { Log } from "./Log";
import { ExtendUtils } from "./utils/ExtendUtils";

export class Hash<T> {
    public static create<T>(children = {}) {
        var obj = new this(<{ [s: string]: T }>children);

        return obj;
    }

    constructor(children: { [s: string]: T } = {}) {
        this._children = children;
    }

    private _children: {
        [s: string]: T
    } = null;

    public getChildren() {
        return this._children;
    }

    public getCount() {
        var result = 0,
            children = this._children,
            key = null;

        for (key in children) {
            if (children.hasOwnProperty(key)) {
                result++;
            }
        }

        return result;
    }

    public getKeys() {
        var result = Collection.create<string>(),
            children = this._children,
            key = null;

        for (key in children) {
            if (children.hasOwnProperty(key)) {
                result.addChild(key);
            }
        }

        return result;
    }

    public getValues() {
        var result = Collection.create<T>(),
            children = this._children,
            key = null;

        for (key in children) {
            if (children.hasOwnProperty(key)) {
                result.addChild(children[key]);
            }
        }

        return result;
    }

    public getChild(key: string) {
        return this._children[key];
    }

    public setValue(key: string, value: any) {
        this._children[key] = value;

        return this;
    }

    public addChild(key: string, value: any) {
        this._children[key] = value;

        return this;
    }

    public addChildren(arg: {} | Hash<T>) {
        var i = null,
            children = null;

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

        return this;
    }

    public appendChild(key: string, value: any) {
        if (this._children[key] instanceof Collection) {
            let c = <any>(this._children[key]);

            c.addChild(<T>value);
        }
        else {
            this._children[key] = <any>(Collection.create<any>().addChild(value));
        }

        return this;
    }

    public setChildren(children: { [s: string]: T }) {
        this._children = children;
    }

    public removeChild(arg: any): Collection<T> {
        var result = [];

        if (JudgeUtils.isString(arg)) {
            let key = <string>arg;

            result.push(this._children[key]);

            this._children[key] = void 0;
            delete this._children[key];
        }
        else if (JudgeUtils.isFunction(arg)) {
            let func = <Function>arg,
                self = this;

            this.forEach((val: any, key: string) => {
                if (func(val, key)) {
                    result.push(self._children[key]);

                    self._children[key] = void 0;
                    delete self._children[key];
                }
            });
        }

        return Collection.create<T>(result);
    }

    public removeAllChildren() {
        this._children = {};
    }

    public hasChild(key: string): boolean {
        return this._children[key] !== void 0;
    }

    public hasChildWithFunc(func: Function): boolean {
        var result = false;

        this.forEach((val: any, key: string) => {
            if (func(val, key)) {
                result = true;
                return $BREAK;
            }
        });

        return result;
    }

    public forEach(func: Function, context?: any) {
        var children = this._children;

        for (let i in children) {
            if (children.hasOwnProperty(i)) {
                if (func.call(context, children[i], i) === $BREAK) {
                    break;
                }
            }
        }

        return this;
    }

    public filter(func: Function): Hash<T> {
        var result = {},
            children = this._children,
            value = null;

        for (let key in children) {
            if (children.hasOwnProperty(key)) {
                value = children[key];

                if (func.call(children, value, key)) {
                    result[key] = value;
                }
            }
        }

        return Hash.create<T>(result);
    }

    public findOne(func: Function) {
        var result = [],
            self = this,
            scope = this._children;

        this.forEach((val: any, key: string) => {
            if (!func.call(scope, val, key)) {
                return;
            }

            result = [key, self.getChild(key)];
            return $BREAK;
        });

        return result;
    }

    public map(func: Function): Hash<T> {
        var resultMap = {};

        this.forEach((val: any, key: string) => {
            var result = func(val, key);

            if (result !== $REMOVE) {
                Log.error(!JudgeUtils.isArray(result) || result.length !== 2, Log.info.FUNC_MUST_BE("iterator", "[key, value]"));

                resultMap[result[0]] = result[1];
            }
        });

        return Hash.create<T>(resultMap);
    }

    public toCollection(): Collection<any> {
        var result = Collection.create<any>();

        this.forEach((val: any, key: string) => {
            if (val instanceof Collection) {
                result.addChildren(val);
            }
            //else if(val instanceof Hash){
            //    Log.error(true, Log.info.FUNC_NOT_SUPPORT("toCollection", "value is Hash"));
            //}
            else {
                result.addChild(val);
            }
        });

        return result;
    }

    public toArray(): Array<T> {
        var result = [];

        this.forEach((val: any, key: string) => {
            if (val instanceof Collection) {
                result = result.concat(val.getChildren());
            }
            else {
                result.push(val);
            }
        });

        return result;
    }

    public clone();
    public clone(isDeep: boolean);
    public clone(target: Hash<T>);
    public clone(target: Hash<T>, isDeep: boolean);

    public clone(...args) {
        var target: Hash<T> = null,
            isDeep: boolean = null;

        if (args.length === 0) {
            isDeep = false;
            target = Hash.create<T>();
        }
        else if (args.length === 1) {
            if (JudgeUtils.isBoolean(args[0])) {
                target = Hash.create<T>();
                isDeep = args[0];
            }
            else {
                target = args[0];
                isDeep = false;
            }
        }
        else {
            target = args[0];
            isDeep = args[1];
        }

        if (isDeep === true) {
            target.setChildren(ExtendUtils.extendDeep(this._children));
        }
        else {
            target.setChildren(ExtendUtils.extend({}, this._children));
        }

        return target;
    }
}