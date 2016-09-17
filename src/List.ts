module wdCb {
    export class List<T> {
        protected children:Array<T> = null;

        public getCount():number {
            return this.children.length;
        }

        public hasChild(child:any):boolean {
            var c:any = null,
                children = this.children;

            for (let i = 0, len = children.length; i < len; i++) {
                c = children[i];

                if (child.uid && c.uid && child.uid == c.uid) {
                    return true;
                }
                else if(child === c){
                    return true;
                }
            }

            return false;
        }

        public hasChildWithFunc(func:Function):boolean {
            for(let i = 0, len = this.children.length; i < len; i++){
                if(func(this.children[i], i)){
                    return true;
                }
            }

            return false;
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

        //todo test
        public setChildren(children:Array<T>) {
            this.children = children;

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

        private _forEach(arr:T[], func:Function, context?:any) {
            var scope = context,
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

