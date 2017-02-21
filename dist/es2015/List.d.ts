export declare class List<T> {
    protected children: Array<T>;
    getCount(): number;
    hasChild(child: any): boolean;
    hasChildWithFunc(func: Function): boolean;
    getChildren(): T[];
    getChild(index: number): T;
    addChild(child: T): this;
    addChildren(arg: Array<T> | List<T> | any): this;
    setChildren(children: Array<T>): this;
    unShiftChild(child: T): void;
    removeAllChildren(): this;
    forEach(func: Function, context?: any): this;
    toArray(): T[];
    protected copyChildren(): T[];
    protected removeChildHelper(arg: any): Array<T>;
    private _forEach(arr, func, context?);
    private _removeChild(arr, func);
}
