/// <reference path="../filePath.d.ts"/>
module dyCb {
    declare var document:any;

    export class DomQuery {
        public static create(eleStr:string) {
            var obj = new this(eleStr);

            return obj;
        }

        private _doms:Array<HTMLElement> = null;

        constructor(eleStr) {
            if (JudgeUtils.isDom(arguments[0])) {
                this._doms = [arguments[0]];
            }
            else {
                this._doms = document.querySelectorAll(eleStr);
            }

            return this;
        }

        public get(index) {
            return this._doms[index];
        }


        public createElement(eleStr) {
            return document.createElement(eleStr);
        }

        public prepend(eleStr:string) {
            var targetDom:HTMLElement = null;

            targetDom = this._buildDom(eleStr);

            for (let dom of this._doms) {
                if (dom.nodeType === 1) {
                    dom.insertBefore(targetDom, dom.firstChild);
                }
            }

            return this;
        }

        public remove() {
            for (let dom of this._doms) {
                if (dom && dom.parentNode && dom.tagName != 'BODY') {
                    dom.parentNode.removeChild(dom);
                }
            }

            return this;
        }

        private _buildDom(eleStr:string) {
            let div = document.createElement("div");

            div.innerHTML = eleStr;

            return div.firstChild;
        }
    }
}

