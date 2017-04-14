import { List } from "./List";
export declare class Queue<T> extends List<T> {
    static create<T>(children?: any[]): Queue<T>;
    constructor(children?: Array<T>);
    readonly front: T;
    readonly rear: T;
    push(element: T): void;
    pop(): T;
    clear(): void;
}
