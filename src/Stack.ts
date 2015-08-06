/// <reference path="Collection"/>
module dyCb {
    export class Stack<T> extends Collection<T>{
        public push(element:T){
            this.children.push(element);
        }

        public pop(){
            return this.children.pop();
        }

        public clear(){
            this.removeAllChildren();
        }
    }
}
