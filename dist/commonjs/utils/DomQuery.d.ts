export declare class DomQuery {
    static create(eleStr: string): any;
    static create(dom: HTMLElement): any;
    private _doms;
    constructor(eleStr: string);
    constructor(dom: HTMLElement);
    get(index: any): HTMLElement;
    prepend(eleStr: string): any;
    prepend(dom: HTMLElement): any;
    prependTo(eleStr: string): this;
    remove(): this;
    css(property: string, value: string): void;
    attr(name: string): any;
    attr(name: string, value: string): any;
    text(str?: string): string;
    private _isDomEleStr(eleStr);
    private _buildDom(eleStr);
    private _buildDom(dom);
    private _createElement(eleStr);
}
