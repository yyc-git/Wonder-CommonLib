import { JudgeUtils } from "./JudgeUtils";
var EventUtils = (function () {
    function EventUtils() {
    }
    EventUtils.bindEvent = function (context, func) {
        return function (event) {
            return func.call(context, event);
        };
    };
    EventUtils.addEvent = function (dom, eventName, handler) {
        if (JudgeUtils.isHostMethod(dom, "addEventListener")) {
            dom.addEventListener(eventName, handler, false);
        }
        else if (JudgeUtils.isHostMethod(dom, "attachEvent")) {
            dom.attachEvent("on" + eventName, handler);
        }
        else {
            dom["on" + eventName] = handler;
        }
    };
    EventUtils.removeEvent = function (dom, eventName, handler) {
        if (JudgeUtils.isHostMethod(dom, "removeEventListener")) {
            dom.removeEventListener(eventName, handler, false);
        }
        else if (JudgeUtils.isHostMethod(dom, "detachEvent")) {
            dom.detachEvent("on" + eventName, handler);
        }
        else {
            dom["on" + eventName] = null;
        }
    };
    return EventUtils;
}());
export { EventUtils };
//# sourceMappingURL=EventUtils.js.map