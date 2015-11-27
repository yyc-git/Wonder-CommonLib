/// <reference path="filePath.d.ts"/>
module dyCb {
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

        public addChildren(arg:Array<T>|List<T>|any) {
            if (JudgeUtils.isArray(arg)) {
                let children:Array<T> = arg;

                this.children = this.children.concat(children);
            }
            else if(arg instanceof List){
                let children:List<T> = arg;

                this.children = this.children.concat(children.getChildren());
            }
            else {
                let child:any = arg;

                this.addChild(child);
            }

            return this;
        }

        public unShiftChild(child:T){
            this.children.unshift(child);
        }

        public removeAllChildren() {
            this.children = [];

            return this;
        }

        public forEach(func:Function, context?:any) {
            this._forEach(this.children, func, context);

            return this;
        }

        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this.children.splice(index, 1);
        //}
        //

        public toArray(){
            return this.children;
        }

        protected copyChildren(){
            return this.children.slice(0);
        }

        protected removeChildHelper(arg:any):Array<T> {
            var result = null;

            if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg;

                result = this._removeChild(this.children, func);
            }
            else if (arg.uid) {
                result = this._removeChild(this.children, (e) => {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                result = this._removeChild(this.children,  (e) => {
                    return e === arg;
                });
            }

            return result;
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
            var scope = context || root,
                i = 0,
                len = arr.length;


            for(i = 0; i < len; i++){
                if (func.call(scope, arr[i], i) === $BREAK) {
                    break;
                }
            }
        }

        private _removeChild(arr:T[], func:Function) {
            var self = this,
                index = null,
                removedElementArr = [],
                remainElementArr = [];

            this._forEach(arr, (e, index) => {
                if(!!func.call(self, e)){
                    removedElementArr.push(e);
                }
                else{
                    remainElementArr.push(e);
                }
            });

            this.children = remainElementArr;

            return removedElementArr;
        }
    }
}

