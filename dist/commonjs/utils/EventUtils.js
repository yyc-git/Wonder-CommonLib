"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JudgeUtils_1 = require("./JudgeUtils");
var EventUtils = (function () {
    function EventUtils() {
    }
    EventUtils.bindEvent = function (context, func) {
        return function (event) {
            return func.call(context, event);
        };
    };
    EventUtils.addEvent = function (dom, eventName, handler) {
        if (JudgeUtils_1.JudgeUtils.isHostMethod(dom, "addEventListener")) {
            dom.addEventListener(eventName, handler, false);
        }
        else if (JudgeUtils_1.JudgeUtils.isHostMethod(dom, "attachEvent")) {
            dom.attachEvent("on" + eventName, handler);
        }
        else {
            dom["on" + eventName] = handler;
        }
    };
    EventUtils.removeEvent = function (dom, eventName, handler) {
        if (JudgeUtils_1.JudgeUtils.isHostMethod(dom, "removeEventListener")) {
            dom.removeEventListener(eventName, handler, false);
        }
        else if (JudgeUtils_1.JudgeUtils.isHostMethod(dom, "detachEvent")) {
            dom.detachEvent("on" + eventName, handler);
        }
        else {
            dom["on" + eventName] = null;
        }
    };
    return EventUtils;
}());
exports.EventUtils = EventUtils;
//# sourceMappingURL=EventUtils.js.map