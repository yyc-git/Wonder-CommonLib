var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { List } from "./List";
var Queue = (function (_super) {
    __extends(Queue, _super);
    function Queue(children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    Queue.create = function (children) {
        if (children === void 0) { children = []; }
        var obj = new this(children);
        return obj;
    };
    Object.defineProperty(Queue.prototype, "front", {
        get: function () {
            return this.children[this.children.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "rear", {
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.push = function (element) {
        this.children.unshift(element);
    };
    Queue.prototype.pop = function () {
        return this.children.pop();
    };
    Queue.prototype.clear = function () {
        this.removeAllChildren();
    };
    return Queue;
}(List));
export { Queue };
//# sourceMappingURL=Queue.js.map