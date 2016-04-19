module wdCb {
    export class Collection<T> extends List<T>{
        public static create<T>(children = []){
            var obj = new this(<Array<T>>children);

            return obj;
        }

        constructor(children:Array<T> = []){
            super();

            this.children = children;
        }

        public clone (isDeep:boolean = false) {
            if(isDeep){
                return Collection.create<T>(ExtendUtils.extendDeep(this.children));
            }

            return Collection.create<T>().addChildren(this.children);
        }

        public filter(func:(value:T, index:number) => boolean):Collection<T> {
            var children = this.children,
                result = [],
                value = null;

            for(let i = 0, len = children.length; i < len; i++){
                value = children[i];

                if (func.call(children, value, i)) {
                    result.push(value);
                }
            }

            return Collection.create<T>(result);
        }

        public findOne(func:(value:T, index:number) => boolean){
            var scope = this.children,
                result:T = null;

            this.forEach((value:T, index) => {
                if (!func.call(scope, value, index)) {
                    return;
                }

                result = value;
                return $BREAK;
            });

            return result;
        }

        public reverse () {
            return Collection.create<T>(this.copyChildren().reverse());
        }

        public removeChild(arg:any){
            return Collection.create<T>(this.removeChildHelper(arg));
        }

        public sort(func:(a:T, b:T) => any, isSortSelf = false):Collection<T>{
            if(isSortSelf){
                this.children.sort(func);

                return this;
            }

            return Collection.create<T>(this.copyChildren().sort(func));
        }

        public insertSort(compareFunc:(a:T, b:T) => boolean, isSortSelf = false):Collection<T>{
            var children = null;

            if(isSortSelf){
                children = this.children;
            }
            else{
                children = ExtendUtils.extend([], this.children);
            }

            for(let i = 1, len = this.getCount(); i < len; i++){
                for(let j = i; j > 0 && compareFunc(children[j], children[j - 1]); j--){
                    this._swap(children, j - 1, j);
                }
            }

            if(isSortSelf){
                return this;
            }
            else{
                return Collection.create<T>(children);
            }
        }

        public map(func:(value:T, index:number) => any){
            var resultArr = [];

            this.forEach((e, index) => {
                var result = func(e, index);

                if(result !== $REMOVE){
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
            });

            return Collection.create<any>(resultArr);
        }

        public removeRepeatItems(){
            var noRepeatList =  Collection.create<T>();

            this.forEach((item:T) => {
                if (noRepeatList.hasChild(item)) {
                    return;
                }

                noRepeatList.addChild(item);
            });

            return noRepeatList;
        }

        public hasRepeatItems(){
            var noRepeatList =  Collection.create<T>(),
                hasRepeat:boolean = false;

            this.forEach((item:T) => {
                if (noRepeatList.hasChild(item)) {
                    hasRepeat = true;

                    return $BREAK;
                }

                noRepeatList.addChild(item);
            });

            return hasRepeat;
        }

        private _swap(children:Array<T>, i:number, j:number){
            var t:T = null;

            t = children[i];
            children[i] = children[j];
            children[j] = t;
        }
    }
}
