module wdCb {
    export class Hash<T> {
        public static create<T>(children = {}){
            var obj = new this(<{ [s:string]:T }>children);

            return obj;
        }

        constructor(children:{ [s:string]:T } = {}){
            this._children = children;
        }

        private _children:{
            [s:string]:T
        } = null;

        public getChildren() {
            return this._children;
        }

        public getCount(){
            var result = 0,
                children = this._children,
                key = null;

            for(key in children){
                if(children.hasOwnProperty(key)){
                    result++;
                }
            }

            return result;
        }

        public getKeys(){
            var result = Collection.create(),
                children = this._children,
                key = null;

            for(key in children){
                if(children.hasOwnProperty(key)) {
                    result.addChild(key);
                }
            }

            return result;
        }

        public getValues(){
            var result = Collection.create(),
                children = this._children,
                key = null;

            for(key in children){
                if(children.hasOwnProperty(key)) {
                    result.addChild(children[key]);
                }
            }

            return result;
        }

        public getChild(key:string) {
            return this._children[key];
        }

        public setValue(key:string, value:any){
            this._children[key] = value;

            return this;
        }

        public addChild(key:string, value:any) {
            this._children[key] = value;

            return this;
        }

        public addChildren(arg:{}|Hash<T>){
            var i = null,
                children = null;

            if(arg instanceof Hash){
                children = arg.getChildren();
            }
            else{
                children = arg;
            }

            for(i in children){
                if(children.hasOwnProperty(i)){
                    this.addChild(i, children[i]);
                }
            }
        }

        public appendChild(key:string, value:any) {
            if (this._children[key] instanceof Collection) {
                let c = <any>(this._children[key]);

                c.addChild(<T>value);
            }
            else {
                this._children[key] = <any>(Collection.create<any>().addChild(value));
            }

            return this;
        }

        public removeChild(arg:any){
            var result = [];

            if(JudgeUtils.isString(arg)){
                let key = <string>arg;

                result.push(this._children[key]);

                this._children[key] = undefined;
                delete this._children[key];
            }
            else if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg,
                    self = this;

                this.forEach((val:any, key:string) => {
                    if(func(val, key)){
                        result.push(self._children[key]);

                        self._children[key] = undefined;
                        delete self._children[key];
                    }
                });
            }

            return Collection.create(result);
        }

        public removeAllChildren(){
            this._children = {};
        }

        public hasChild(arg:any):boolean {
            if (JudgeUtils.isFunction(arguments[0])) {
                let func = <Function>arguments[0],
                    result = false;

                this.forEach((val:any, key:string) => {
                    if(func(val, key)){
                        result = true;
                        return $BREAK;
                    }
                });

                return result;
            }
            else{
                let key = <string>arguments[0];

                return this._children[key] !== void 0;
            }
        }


        public forEach(func:Function, context?:any){
            var i = null,
                children = this._children;

            for (i in children) {
                if (children.hasOwnProperty(i)) {
                    if (func.call(context, children[i], i) === $BREAK) {
                        break;
                    }
                }
            }

            return this;
        }

        public filter(func:Function){
            var result = {},
                scope = this._children;

            this.forEach((val:any, key:string) => {
                if(!func.call(scope, val, key)){
                    return;
                }

                result[key] = val;
            });

            return Hash.create(result);
        }

        public findOne(func:Function){
            var result = [],
                self = this,
                scope = this._children;

            this.forEach((val:any, key:string) => {
                if(!func.call(scope, val, key)){
                    return;
                }

                result = [key, self.getChild(key)];
                return $BREAK;
            });

            return result;
        }

        public map(func:Function) {
            var resultMap = {};

            this.forEach((val:any, key:string) => {
                var result = func(val, key);

                if(result !== $REMOVE){
                    Log.error(!JudgeUtils.isArray(result) || result.length !== 2, Log.info.FUNC_MUST_BE("iterator", "[key, value]"));

                    resultMap[result[0]] = result[1];
                }
            });

            return Hash.create(resultMap);
        }

        public toCollection(): Collection<any>{
            var result = Collection.create<any>();

            this.forEach((val:any, key:string) => {
                if(val instanceof Collection){
                    result.addChildren(val);
                }
                else if(val instanceof Hash){
                    Log.error(true, Log.info.FUNC_NOT_SUPPORT("toCollection", "value is Hash"));
                }
                else{
                    result.addChild(val);
                }
            });

            return result;
        }
    }
}


