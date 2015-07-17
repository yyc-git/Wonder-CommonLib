/// <reference path="definitions.d.ts"/>
module dyCb {
    export class Collection {
        public static create(childs = []){
            var obj = new this(childs);

            return obj;
        }

        constructor(childs:any = []){
            this._childs = childs;
        }

        private _childs:any[] = null;

        public getCount():number {
            return this._childs.length;
        }

        public hasChild(arg):boolean {
            if (JudgeUtils.isFunction(arguments[0])) {
                let func = <Function>arguments[0];

                return this._contain(this._childs, (c, i)  => {
                    return func(c, i);
                });
            }

            let child = <any>arguments[0];

            return this._contain(this._childs, (c, i) => {
                if (c === child
                    || (c.uid && child.uid && c.uid === child.uid)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }

        public getChilds () {
            return this._childs;
        }

        public getChild(index:number) {
            return this._childs[index];
        }

        public addChild(child) {
            this._childs.push(child);

            return this;
        }

        public addChilds(arg:any[]|any) {
            var i = 0,
                len = 0;

            if (!JudgeUtils.isArray(arg)) {
                let child = <any>arg;

                this.addChild(child);
            }
            else {
                let childs = <any[]>arg;

                this._childs = this._childs.concat(childs);
            }

            return this;
        }

        public removeAllChilds() {
            this._childs = [];

            return this;
        }

        public forEach(func:Function, context?:any) {
            this._forEach(this._childs, func, context);

            return this;
        }

        public filter(func) {
            return this._filter(this._childs, func, this._childs);
        }

        //public removeChildAt (index) {
        //    Log.error(index < 0, "序号必须大于等于0");
        //
        //    this._childs.splice(index, 1);
        //}
        //
        //public copy () {
        //    return ExtendUtils.extendDeep(this._childs);
        //}
        //
        //public reverse () {
        //    this._childs.reverse();
        //}

        public removeChild(arg:any) {
            if (JudgeUtils.isFunction(arg)) {
                let func = <Function>arg;

                this._removeChild(this._childs, func);
            }
            else if (arg.uid) {
                this._removeChild(this._childs, (e) => {
                    if (!e.uid) {
                        return false;
                    }
                    return e.uid === arg.uid;
                });
            }
            else {
                this._removeChild(this._childs,  (e) => {
                    return e === arg;
                });
            }

            return this;
        }

        public sort(func){
            this._childs.sort(func);

            return this;
        }

        public map(func:Function){
            this._map(this._childs, func);

            return this;
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

        private _contain(arr:any[], arg:any) {
            return this._indexOf(arr, arg) > -1;
        }

        private _forEach(arr:any[], func:Function, context?:any) {
            var scope = context || window,
                i = 0,
                len = arr.length;


            for(i = 0; i < len; i++){
                if (func.call(scope, arr[i], i) === $BREAK) {
                    break;
                }
            }
        }

        private _map(arr:any[], func:Function) {
            var resultArr = [];

            this._forEach(arr, function (e, index) {
                var result = func(e, index);

                if(result !== void 0){
                    resultArr.push(result);
                }
                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
            });

            if(resultArr.length > 0){
                this._childs = resultArr;
            }
        }

        private _removeChild(arr:any[], func:Function) {
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

        private _filter = function (arr, func, context) {
            var scope = context || window,
                result = [];

            this._forEach(arr, (value, index) => {
                if (!func.call(scope, value, index)) {
                    return;
                }
                result.push(value);
            });

            return Collection.create(result);
        };
    }
}
///// <reference path="definitions.d.ts"/>
//module dyCb {
//    export class Collection<T> {
//        public static create(childs = []){
//            var obj = new this(childs);
//
//            return obj;
//        }
//
//        constructor(childs:Array<T> = <any>[]){
//            this._childs = childs;
//        }
//
//        private _childs:Array<T> = null;
//
//        public getCount():number {
//            return this._childs.length;
//        }
//
//        public hasChild(arg):boolean {
//            if (JudgeUtils.isFunction(arguments[0])) {
//                let func = <Function>arguments[0];
//
//                return this._contain(this._childs, (c, i)  => {
//                    return func(c, i);
//                });
//            }
//
//            let child = <any>arguments[0];
//
//            return this._contain(this._childs, (c, i) => {
//                if (c === child
//                    || (c.uid && child.uid && c.uid === child.uid)) {
//                    return true;
//                }
//                else {
//                    return false;
//                }
//            });
//        }
//
//        public getChilds () {
//            return this._childs;
//        }
//
//        public getChild(index:number) {
//            return this._childs[index];
//        }
//
//        public addChild(child) {
//            this._childs.push(child);
//
//            return this;
//        }
//
//        public addChilds(arg:any[]|any) {
//            var i = 0,
//                len = 0;
//
//            if (!JudgeUtils.isArray(arg)) {
//                let child = <any>arg;
//
//                this.addChild(child);
//            }
//            else {
//                let childs = <any[]>arg;
//
//                this._childs = this._childs.concat(childs);
//            }
//
//            return this;
//        }
//
//        public removeAllChilds() {
//            this._childs = [];
//
//            return this;
//        }
//
//        public forEach(func:Function, context?:any) {
//            this._forEach(this._childs, func, context);
//
//            return this;
//        }
//
//        public filter(func) {
//            return this._filter(this._childs, func, this._childs);
//        }
//
//        //public removeChildAt (index) {
//        //    Log.error(index < 0, "序号必须大于等于0");
//        //
//        //    this._childs.splice(index, 1);
//        //}
//        //
//        //public copy () {
//        //    return ExtendUtils.extendDeep(this._childs);
//        //}
//        //
//        //public reverse () {
//        //    this._childs.reverse();
//        //}
//
//        public removeChild(arg:any) {
//            if (JudgeUtils.isFunction(arg)) {
//                let func = <Function>arg;
//
//                this._removeChild(this._childs, func);
//            }
//            else if (arg.uid) {
//                this._removeChild(this._childs, (e) => {
//                    if (!e.uid) {
//                        return false;
//                    }
//                    return e.uid === arg.uid;
//                });
//            }
//            else {
//                this._removeChild(this._childs,  (e) => {
//                    return e === arg;
//                });
//            }
//
//            return this;
//        }
//
//        public sort(func:(a:T, b:T)=>number){
//            this._childs.sort(func);
//
//            return this;
//        }
//
//        public map(func:Function){
//            this._map(this._childs, func);
//
//            return this;
//        }
//
//        private _indexOf(arr:any[], arg:any) {
//            var result = -1;
//
//            if (JudgeUtils.isFunction(arg)) {
//                let func = <Function>arg;
//
//                this._forEach(arr, (value, index) => {
//                    if (!!func.call(null, value, index)) {
//                        result = index;
//                        return $BREAK;   //如果包含，则置返回值为true,跳出循环
//                    }
//                });
//            }
//            else {
//                let val = <any>arg;
//
//                this._forEach(arr, (value, index) => {
//                    if (val === value
//                        || (value.contain && value.contain(val))
//                        || (value.indexOf && value.indexOf(val) > -1)) {
//                        result = index;
//                        return $BREAK;   //如果包含，则置返回值为true,跳出循环
//                    }
//                });
//            }
//
//            return result;
//        }
//
//        private _contain(arr:any[], arg:any) {
//            return this._indexOf(arr, arg) > -1;
//        }
//
//        private _forEach(arr:any[], func:Function, context?:any) {
//            var scope = context || window,
//                i = 0,
//                len = arr.length;
//
//
//            for(i = 0; i < len; i++){
//                if (func.call(scope, arr[i], i) === $BREAK) {
//                    break;
//                }
//            }
//        }
//
//        private _map(arr:any[], func:Function) {
//            var resultArr = [];
//
//            this._forEach(arr, function (e, index) {
//                var result = func(e, index);
//
//                if(result !== void 0){
//                    resultArr.push(result);
//                }
//                //e && e[handlerName] && e[handlerName].apply(context || e, valueArr);
//            });
//
//            if(resultArr.length > 0){
//                this._childs = resultArr;
//            }
//        }
//
//        private _removeChild(arr:any[], func:Function) {
//            var self = this,
//                index = null;
//
//            index = this._indexOf(arr, (e, index) => {
//                return !!func.call(self, e);
//            });
//
//            //if (index !== null && index !== -1) {
//            if (index !== -1) {
//                arr.splice(index, 1);
//                //return true;
//            }
//            //return false;
//            return arr;
//        }
//
//        private _filter = function (arr, func, context) {
//            var scope = context || window,
//                result = [];
//
//            this._forEach(arr, (value, index) => {
//                if (!func.call(scope, value, index)) {
//                    return;
//                }
//                result.push(value);
//            });
//
//            return Collection.create(result);
//        };
//    }
//}
