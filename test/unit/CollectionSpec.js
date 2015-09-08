describe("Collection", function () {
    var collection = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        collection = new dyCb.Collection();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("copy", function () {
        it("return the shallow copy one", function () {
            var arr = [1, {a: 1}];
            collection.addChildren(arr);

            var a = collection.copy().getChildren();
            a[0] = 2;
            a[1].a = 100;

            expect(a === arr).toBeFalsy();
            expect(a.length).toEqual(2);
            expect(arr[0]).toEqual(1);
            expect(arr[1].a).toEqual(100);
        });
        it("return the deep copy one", function () {
            var arr = [1, {a: 1}];
            collection.addChildren(arr);

            var a = collection.copy(true).getChildren();
            a[0] = 2;
            a[1].a = 100;

            expect(a === arr).toBeFalsy();
            expect(a.length).toEqual(2);
            expect(arr[0]).toEqual(1);
            expect(arr[1].a).toEqual(1);
        });
    });

    describe("reverse", function () {
        it("return reversed elements", function () {
            var arr = [
                {},
                2,
                3,
                4
            ];
            collection.addChildren(arr);

            expect(collection.reverse().getChildren()).toEqual([4, 3, 2, {}]);
            expect(collection.getChildren()).toEqual(arr);
        });
    });

    describe("filter", function () {
        it("return filtered element", function () {
            var child1 = {a: 1},
                child2 = {a: 2},
                child3 = {a: 2};
            collection.addChildren([child1, child2, child3]);

            var result = collection.filter(function (e) {
                return e.a === 2;
            });

            expect(collection.getChildren()).toEqual([child1, child2, child3]);
            expect(result.getChildren()).toEqual([child2, child3]);
        });
        it("this is point to container", function(){
            var child1 = {a: 1},
                child2 = {a: 2},
                child3 = {a: 2};
            collection.addChildren([child1, child2, child3]);

            var result = collection.filter(function (value, index) {
                return this[index].a === 2;
            });

            expect(collection.getChildren()).toEqual([child1, child2, child3]);
            expect(result.getChildren()).toEqual([child2, child3]);
        });
    });

    describe("findOne", function () {
        it("return the first filtered element", function () {
            var child1 = {a: 1},
                child2 = {a: 2},
                child3 = {a: 2};
            collection.addChildren([child1, child2, child3]);

            var result = collection.findOne(function (e) {
                return e.a === 2;
            });

            expect(collection.getChildren()).toEqual([child1, child2, child3]);
            expect(result).toEqual(child2);
        });
        it("this is point to container", function(){
            var child1 = {a: 1},
                child2 = {a: 2},
                child3 = {a: 2};
            collection.addChildren([child1, child2, child3]);

            var result = collection.findOne(function (value, index) {
                return this[index].a === 2;
            });

            expect(collection.getChildren()).toEqual([child1, child2, child3]);
            expect(result).toEqual(child2);
        });
    });

    describe("sort", function () {
        it("return the sorted elements", function () {
            collection.addChild(2);
            collection.addChild(1);

            expect(collection.sort(function (a, b) {
                return a - b;
            }).getChildren()).toEqual([1, 2]);
            expect(collection.getChildren()).toEqual([2, 1]);
        });
    });

    describe("map", function () {
        it("handle each value and return handled array", function(){
            collection.addChild(1);
            collection.addChild(2);

            var result = collection.map(function(val){
                return val * 2;
            });

            expect(result.getChildren()).toEqual([2, 4]);
            expect(collection.getChildren()).toEqual([1, 2]);
        });
        it("if handler return $REMOVE, then remove it from the result", function(){
            collection.addChild(1);
            collection.addChild(2);

            var result = collection.map(function(val){
                if(val === 2){
                    return dyCb.$REMOVE;
                }

                return val * 2;
            });

            expect(result.getChildren()).toEqual([2]);
            expect(collection.getChildren()).toEqual([1, 2]);
        });
    });


    describe("removeChild", function () {
        it("return all removed elements Collection", function () {
            var arr = [1, 2, 1];

            collection.addChildren(arr);

            var result = collection.removeChild(function (e) {
                return e === 1;
            });

            expect(result).toBeInstanceOf(dyCb.Collection);
            expect(result.getChildren()).toEqual([1, 1]);
            expect(collection.getChildren()).toEqual([2]);
        });
        it("event only remove 1 element, it will return array", function () {
            var arr = [1, 2, 1];

            collection.addChildren(arr);

            var result = collection.removeChild(function (e) {
                return e === 2;
            });

            expect(result).toBeInstanceOf(dyCb.Collection);
            expect(result.getChildren()).toEqual([2]);
            expect(collection.getChildren()).toEqual([1, 1]);
        });
    });
});