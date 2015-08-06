/// <reference path="Collection"/>
module dyCb {
    export class Queue<T> extends Collection<T>{
        public push(element:T){
            this.children.unshift(element);
        }

        public pop(){
            return this.children.pop();
        }

        public clear(){
            this.removeAllChildren();
        }
    }
}
