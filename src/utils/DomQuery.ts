/// <reference path="../filePath.d.ts"/>
module wdCb {
    declare var document:any;

    export class DomQuery {
        public static create(eleStr:string);
        public static create(dom:HTMLElement);

        public static create(...args) {
            var obj = new this(args[0]);

            return obj;
        }

        private _doms:Array<HTMLElement> = null;

        constructor(eleStr:string);
        constructor(dom:HTMLElement);

        constructor(...args) {
            if (JudgeUtils.isDom(args[0])) {
                this._doms = [args[0]];
            }
            else if(this._isDomEleStr(args[0])){
                this._doms = [this._buildDom(args[0])];
            }
            else {
                this._doms = document.querySelectorAll(args[0]);
            }

            return this;
        }

        public get(index) {
            return this._doms[index];
        }


        public prepend(eleStr:string);
        public prepend(dom:HTMLElement);

        public prepend(...args) {
            var targetDom:HTMLElement = null;

            targetDom = this._buildDom(args[0]);

            for (let dom of this._doms) {
                if (dom.nodeType === 1) {
                    dom.insertBefore(targetDom, dom.firstChild);
                }
            }

            return this;
        }

        public prependTo(eleStr:string) {
            var targetDom:DomQuery = null;

            targetDom = DomQuery.create(eleStr);

            for (let dom of this._doms) {
                if (dom.nodeType === 1) {
                    targetDom.prepend(dom);
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

        public css(property:string, value:string){
            for (let dom of this._doms) {
                dom.style[property] = value;
            }
        }

        public attr(name:string);
        public attr(name:string, value:string);

        public attr(...args){
            if(args.length === 1){
                let name = args[0];

                return this.get(0).getAttribute(name);
            }
            else{
                let name = args[0],
                    value = args[1];

                for (let dom of this._doms) {
                    dom.setAttribute(name, value);
                }
            }
        }

        private _isDomEleStr(eleStr:string){
            return eleStr.match(/<(\w+)[^>]*><\/\1>/) !== null;
        }

        private _buildDom(eleStr:string):HTMLElement;
        private _buildDom(dom:HTMLHtmlElement):HTMLElement;

        private _buildDom(...args):HTMLElement {
            if(JudgeUtils.isString(args[0])){
                let div = this._createElement("div"),
                    eleStr:string = args[0];

                div.innerHTML = eleStr;

                return div.firstChild;
            }

            return args[0];
        }

        private _createElement(eleStr){
            return document.createElement(eleStr);
        }
    }
}

