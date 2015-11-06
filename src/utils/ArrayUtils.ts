/// <reference path="../definitions.d.ts"/>
module dyCb {
    export class ArrayUtils {
        public static removeRepeatItems(arr:Array<any>, isEqual:(a:any, b:any) => boolean = (a, b)=> {
            return a === b;
        }) {
            var resultArr = [],
                self = this;

            arr.forEach(function (ele) {
                if (self.contain(resultArr, function (val) {
                        return isEqual(val, ele);
                    })) {
                    return;
                }

                resultArr.push(ele);
            });

            return resultArr;
        }

        public static contain(arr:Array<any>, ele:any) {
            if (JudgeUtils.isFunction(ele)) {
                let func:Function = ele;

                for(let i = 0, len = arr.length; i < len; i++){
                    let value = arr[i];

                    if (!!func.call(null, value, i)) {
                        return true;
                    }
                }
            }
            else {
                for(let i = 0, len = arr.length; i < len; i++){
                    let value = arr[i];

                    if (ele === value || (value.contain && value.contain(ele))) {
                        return true;
                    }
                }
            }

            return false;
        };

    }
}
