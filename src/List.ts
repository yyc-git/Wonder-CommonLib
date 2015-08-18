/// <reference path="definitions.d.ts"/>
module dyCb {
    //todo convert "Collection" type to "List" type
    //todo remain common "forEach,filter,map..." methods

    export class List<T> {
        protected children:Array<T> = null;

        public getCount():number {
            return this.children.length;
        }

        public hasChild(arg:Function|T):boolean {
            if (JudgeUtils.isFunction(arguments[0])) {
                let func = <Function>arguments[0];

                return this._contain(this.children, (c, i)  => {
                    return func(c, i);
                });
            }

            let child = <any>arguments[0];

            return this._contain(this.children, (c, i) => {
                if (c === child
                    || (c.uid && child.uid && c.uid === child.uid)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }

        public getChildren () {
            return this.children;
        }

        public getChild(index:number) {
            return this.children[index];
        }

        public addChild(child:T) {
            this.children.push(child);

            return this;
        }

        public addChildren(arg:Array<T>|Collection<T>|any) {
            if (JudgeUtils.isArray(arg)) {
                let children:Array<T> = arg;

                this.children = this.children.concat(children);
            }
            else if(arg instanceof Collection){
                let children:Collection<T> = arg;

                this.children = this.children.concat(children.getChildren());
            }
            else {
                let child:any = arg;

                this.addChild(child);
            }

            return this;
        }

        public removeAllChildren() {
            this.children = [];

            return this;
        }

        public forEach(func:Function, context?:any) {
            this._forEach(this.children, func, context);

            return this;
        }

        public filter(func):Collection<T> {
            var scope = this.children,
                result:Array<T> = [];

            this._forEach(this.children, (value:T, index) => {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });

            return Collection.create<T>(result);
        }

        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this.children.splice(index, 1);
        //}
        //

        //public copy () {
        //    return Collection.create<T>(ExtendUtils.extendDeep(this.children));
        //}

        public reverse () {
            this.children.reverse();

            return this;
        }

        public removeChild(arg:any) {
            if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg;

                this._removeChild(this.children, func);
            }
            else if (arg.uid) {
                this._removeChild(this.children, (e) => {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                this._removeChild(this.children,  (e) => {
                    return e === arg;
                });
            }

            return this;
        }

        public sort(func){
            this.children.sort(func);

            return this;
        }

        public map(func:Function){
            return this._map(this.children, func);
        }

        public toArray(){
            return ExtendUtils.extendDeep(this.children);
        }

        private _indexOf(arr:any[], arg:any) {
            var result = -1;

            if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg;

                this._forEach(arr, (value, index) => {
                    if (!!func.call(null, value, index)) {
                        result = index;
                        return $BREAK;   //如果包含，则置返回值为true,跳出循环
                    }
                });
            }
            else {
                let val = <any>arg;

                this._forEach(arr, (value, index) => {
                    if (val === value
                        || (value.contain && value.contain(val))
                        || (value.indexOf && value.indexOf(val) > -1)) {
                        result = index;
                        return $BREAK;   //如果包含，则置返回值为true,跳出循环
                    }
                });
            }

            return result;
        }

        private _contain(arr:T[], arg:any) {
            return this._indexOf(arr, arg) > -1;
        }

        private _forEach(arr:T[], func:Function, context?:any) {
            var scope = context || window,
                i = 0,
                len = arr.length;


            for(i = 0; i < len; i++){
                if (func.call(scope, arr[i], i) === $BREAK) {
                    break;
                }
            }
        }

        private _map(arr:Array<T>, func:Function) {
            var resultArr = [];

            this._forEach(arr, (e, index) => {
                var result = func(e, index);

                if(result !== $REMOVE){
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
            });

            return Collection.create<any>(resultArr);
        }

        private _removeChild(arr:T[], func:Function) {
            var self = this,
                index = null;

            index = this._indexOf(arr, (e, index) => {
                return !!func.call(self, e);
            });

            //if (index !== null && index !== -1) {
            if (index !== -1) {
                arr.splice(index, 1);
                //return true;
            }
            //return false;
            return arr;
        }
    }
}

