/// <reference path="definitions.d.ts"/>
module dyCb {
    export class Hash<T> {
        public static create(childs = {}){
            var obj = new this(childs);

            return obj;
        }

        constructor(childs:any = {}){
            this._childs = childs;
        }

        private _childs:any = null;

        public getChilds() {
            return this._childs;
        }

        public getCount(){
            var result = 0,
                childs = this._childs,
                key = null;

            for(key in childs){
                if(childs.hasOwnProperty(key)){
                    result++;
                }
            }

            return result;
        }

        public getKeys(){
            var result = Collection.create(),
                childs = this._childs,
                key = null;

            for(key in childs){
                if(childs.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }

            return result;
        }

        public getChild(key:string) {
            return this._childs[key];
        }

        public addChild(key:string, value:any) {
            this._childs[key] = value;

            return this;
        }

        public appendChild(key:string, value:any) {
            //if (JudgeUtils.isArray(this._childs[key])) {
            //    this._childs[key].push(value);
            //}
            //else {
            //    this._childs[key] = [value];
            //}
            if (this._childs[key] instanceof Collection) {
                this._childs[key].addChild(value);
            }
            else {
                this._childs[key] = Collection.create().addChild(value);
            }

            return this;
        }

        public removeChild(arg:any){
            if(JudgeUtils.isString(arg)){
                let key = <string>arg;

                this._childs[key] = undefined;
            }
            else if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg,
                    self = this;

                //return this._removeChild(this._childs, arg);
                this.forEach((val, key) => {
                    if(func(val, key)){
                        self._childs[key] = undefined;
                        delete self._childs[key];
                    }
                });
            }

            return this;
        }

        public hasChild(arg:any):boolean {
            if (JudgeUtils.isFunction(arguments[0])) {
                let func = <Function>arguments[0],
                    result = false;

                this.forEach((val, key) => {
                    if(func(val, key)){
                        result = true;
                        return $BREAK;
                    }
                });

                return result;
            }

            let key = <string>arguments[0];

            return !!this._childs[key];
        }


        public forEach(func:Function, context?:any){
            var i = null,
                childs = this._childs;

            for (i in childs) {
                if (childs.hasOwnProperty(i)) {
                    if (func.call(context, <T>childs[i], i) === $BREAK) {
                        break;
                    }
                }
            }

            return this;
        }

        public filter(func:Function){
            var result = {},
                scope = this._childs;

            this.forEach((val, key) => {
                if(!func.call(scope, val, key)){
                    return;
                }

                result[key] = val;
            });

            return Hash.create(result);
        }

        public map(func:Function) {
            var resultMap = {};

            this.forEach((val, key) => {
                var result = func(val, key);

                if(result !== $REMOVE){
                    Log.error(!JudgeUtils.isArray(result) || result.length !== 2, Log.info.FUNC_MUST_BE("iterator", "[key, value]"));

                    resultMap[result[0]] = result[1];
                }
            });

            return Hash.create(resultMap);
        }
    }
}


