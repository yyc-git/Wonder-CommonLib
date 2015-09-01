/// <reference path="definitions.d.ts"/>
module dyCb {
    export class Collection<T> extends List<T>{
        public static create<T>(children = []){
            var obj = new this(<Array<T>>children);

            return obj;
        }

        constructor(children:Array<T> = []){
            super();

            this.children = children;
        }

        public copy (isDeep:boolean = false) {
            return isDeep ? Collection.create<T>(ExtendUtils.extendDeep(this.children))
                : Collection.create<T>(ExtendUtils.extend([], this.children));
        }

        public filter(func:(value:T, index:number) => boolean):Collection<T> {
            var scope = this.children,
                result:Array<T> = [];

            this.forEach((value:T, index) => {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });

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
            return Collection.create<any>(this.copyChildren().reverse());
        }

        public removeChild(arg:any){
            return Collection.create(this.removeChildHelper(arg));
        }

        public sort(func:(a:T, b:T) => any){
            return Collection.create<any>(this.copyChildren().sort(func));
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
    }
}
