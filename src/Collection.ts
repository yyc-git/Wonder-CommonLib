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

        public copy () {
            return Collection.create<T>(ExtendUtils.extendDeep(this.children));
        }
    }
}
