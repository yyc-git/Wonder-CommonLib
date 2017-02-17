import { List } from "./List";

export class Queue<T> extends List<T>{
    public static create<T>(children = []) {
        var obj = new this(<Array<T>>children);

        return obj;
    }

    constructor(children: Array<T> = []) {
        super();

        this.children = children;
    }

    get front() {
        return this.children[this.children.length - 1];
    }

    get rear() {
        return this.children[0];
    }

    public push(element: T) {
        this.children.unshift(element);
    }

    public pop() {
        return this.children.pop();
    }

    public clear() {
        this.removeAllChildren();
    }
}