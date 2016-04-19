module wdCb {
    export class Stack<T> extends List<T>{
        public static create<T>(children = []){
            var obj = new this(<Array<T>>children);

            return obj;
        }

        constructor(children:Array<T> = []){
            super();

            this.children = children;
        }

        get top(){
            return this.children[this.children.length - 1];
        }

        public push(element:T){
            this.children.push(element);
        }

        public pop(){
            return this.children.pop();
        }

        public clear(){
            this.removeAllChildren();
        }

        public clone (isDeep:boolean = false) {
            if(isDeep){
                return Stack.create<T>(ExtendUtils.extendDeep(this.children));
            }

            return Stack.create<T>([].concat(this.children));
        }
    }
}
