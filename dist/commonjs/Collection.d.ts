import { List } from "./List";
export declare class Collection<T> extends List<T> {
    static create<T>(children?: any[]): Collection<T>;
    constructor(children?: Array<T>);
    clone(): any;
    clone(isDeep: boolean): any;
    clone(target: Collection<T>): any;
    clone(target: Collection<T>, isDeep: boolean): any;
    filter(func: (value: T, index: number) => boolean): Collection<T>;
    findOne(func: (value: T, index: number) => boolean): T;
    reverse(): Collection<T>;
    removeChild(arg: any): Collection<T>;
    sort(func: (a: T, b: T) => any, isSortSelf?: boolean): Collection<T>;
    map(func: (value: T, index: number) => any): Collection<any>;
    removeRepeatItems(): Collection<T>;
    hasRepeatItems(): boolean;
}
