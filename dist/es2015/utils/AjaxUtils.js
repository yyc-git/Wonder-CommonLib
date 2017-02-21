var AjaxUtils = (function () {
    function AjaxUtils() {
    }
    AjaxUtils.ajax = function (conf) {
        var type = conf.type;
        var url = conf.url;
        var data = conf.data;
        var dataType = conf.dataType;
        var success = conf.success;
        var error = conf.error;
        var xhr = null;
        var self = this;
        if (type === null) {
            type = "get";
        }
        if (dataType === null) {
            dataType = "text";
        }
        xhr = this._createAjax(error);
        if (!xhr) {
            return;
        }
        try {
            xhr.open(type, url, true);
            if (this._isSoundFile(dataType)) {
                xhr.responseType = "arraybuffer";
            }
            if (type === "GET" || type === "get") {
                xhr.send(null);
            }
            else if (type === "POST" || type === "post") {
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                xhr.send(data);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4
                    && (xhr.status === 200 || self._isLocalFile(xhr.status))) {
                    if (dataType === "text" || dataType === "TEXT") {
                        if (success !== null) {
                            success(xhr.responseText);
                        }
                    }
                    else if (dataType === "xml" || dataType === "XML") {
                        if (success !== null) {
                            success(xhr.responseXML);
                        }
                    }
                    else if (dataType === "json" || dataType === "JSON") {
                        if (success !== null) {
                            success(eval("(" + xhr.responseText + ")"));
                        }
                    }
                    else if (self._isSoundFile(dataType)) {
                        if (success !== null) {
                            success(xhr.response);
                        }
                    }
                }
            };
        }
        catch (e) {
            error(xhr, e);
        }
    };
    AjaxUtils._createAjax = function (error) {
        var xhr = null;
        try {
            xhr = new ActiveXObject("microsoft.xmlhttp");
        }
        catch (e1) {
            try {
                xhr = new XMLHttpRequest();
            }
            catch (e2) {
                error(xhr, { message: "您的浏览器不支持ajax，请更换！" });
                return null;
            }
        }
        return xhr;
    };
    AjaxUtils._isLocalFile = function (status) {
        return document.URL.contain("file://") && status === 0;
    };
    AjaxUtils._isSoundFile = function (dataType) {
        return dataType === "arraybuffer";
    };
    return AjaxUtils;
}());
export { AjaxUtils };
//# sourceMappingURL=AjaxUtils.js.map