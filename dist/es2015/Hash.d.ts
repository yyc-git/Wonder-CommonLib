import { Collection } from "./Collection";
export declare class Hash<T> {
    static create<T>(children?: {}): Hash<T>;
    constructor(children?: {
        [s: string]: T;
    });
    private _children;
    getChildren(): {
        [s: string]: T;
    };
    getCount(): number;
    getKeys(): Collection<string>;
    getValues(): Collection<T>;
    getChild(key: string): T;
    setValue(key: string, value: any): this;
    addChild(key: string, value: any): this;
    addChildren(arg: {} | Hash<T>): this;
    appendChild(key: string, value: any): this;
    setChildren(children: {
        [s: string]: T;
    }): void;
    removeChild(arg: any): Collection<T>;
    removeAllChildren(): void;
    hasChild(key: string): boolean;
    hasChildWithFunc(func: Function): boolean;
    forEach(func: Function, context?: any): this;
    filter(func: Function): Hash<T>;
    findOne(func: Function): any[];
    map(func: Function): Hash<T>;
    toCollection(): Collection<any>;
    toArray(): Array<T>;
    clone(): any;
    clone(isDeep: boolean): any;
    clone(target: Hash<T>): any;
    clone(target: Hash<T>, isDeep: boolean): any;
}
