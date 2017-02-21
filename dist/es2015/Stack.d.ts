import { List } from "./List";
import { Collection } from "./Collection";
export declare class Stack<T> extends List<T> {
    static create<T>(children?: any[]): Stack<T>;
    constructor(children?: Array<T>);
    readonly top: T;
    push(element: T): void;
    pop(): T;
    clear(): void;
    clone(): any;
    clone(isDeep: boolean): any;
    clone(target: Stack<T>): any;
    clone(target: Stack<T>, isDeep: boolean): any;
    filter(func: (value: T, index: number) => boolean): Collection<T>;
    findOne(func: (value: T, index: number) => boolean): T;
    reverse(): Collection<T>;
    removeChild(arg: any): Collection<T>;
    sort(func: (a: T, b: T) => any, isSortSelf?: boolean): Collection<T>;
    map(func: (value: T, index: number) => any): Collection<any>;
    removeRepeatItems(): Collection<T>;
    hasRepeatItems(): boolean;
}
