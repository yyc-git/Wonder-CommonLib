describe("Collection", function () {
    var collection = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        collection = new wdCb.Collection();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("clone", function () {
        describe("test return the shallow clone one", function () {
            function judge(target) {
                var arr = [1, {a: 1}];
                collection.addChildren(arr);

                var result;
                var a;

                if(target){
                    result = collection.clone(target);
                }
                else{
                    result = collection.clone();
                }

                a = result.getChildren();

                a[0] = 2;
                a[1].a = 100;

                expect(a === arr).toBeFalsy();
                expect(a.length).toEqual(2);
                expect(arr[0]).toEqual(1);
                expect(arr[1].a).toEqual(100);



                result.addChild(222);

                expect(collection.hasChild(222)).toBeFalsy();
            }

            it("test", function () {
                judge();
            });

            describe("if pass target", function(){
                beforeEach(function(){

                });

                it("not create again", function () {
                    var target = wdCb.Collection.create();

                    sandbox.stub(wdCb.Collection, "create");

                    judge(target);

                    expect(wdCb.Collection.create).not.toCalled();
                });
                it("should refresh the target's children", function () {
                    var arr = [1, {a: 1}];
                    collection.addChildren(arr);

                    var target = wdCb.Collection.create([100]);

                    var result;
                    var a;

                        result = collection.clone(target);

                    expect(result.getCount()).toEqual(collection.getCount());
                });
            });
        });

        describe("test return the deep clone one", function () {
            function judge(target) {
                var cloneElementResult = {};
                var arr = [1, {a: 1}, {
                    clone:sandbox.stub().returns(cloneElementResult)
                }];
                collection.addChildren(arr);

                var a;

                if(target){
                    a = collection.clone(target, true).getChildren();
                }
                else{
                    a = collection.clone(true).getChildren();
                }

                a[0] = 2;
                a[1].a = 100;

                expect(a === arr).toBeFalsy();
                expect(a.length).toEqual(3);
                expect(a[2]).toEqual(cloneElementResult);

                expect(arr[0]).toEqual(1);
                expect(arr[1].a).toEqual(1);
            }

            it("test", function () {
                judge();
            });
            it("if pass target, not create again", function () {
                var target = wdCb.Collection.create();

                sandbox.stub(wdCb.Collection, "create");

                judge(target);

                expect(wdCb.Collection.create).not.toCalled();
            });
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
        it("if the second param is true, sort itself", function () {
            collection.addChild(2);
            collection.addChild(1);

            collection.sort(function (a, b) {
                return a - b;
            }, true);

            expect(collection.getChildren()).toEqual([1, 2]);
        });
        it("else, return the sorted elements", function () {
            collection.addChild(2);
            collection.addChild(1);

            var result = collection.sort(function (a, b) {
                return a - b;
            }, false);

            expect(result.getChildren()).toEqual([1, 2]);
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
                    return wdCb.$REMOVE;
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

            expect(result).toBeInstanceOf(wdCb.Collection);
            expect(result.getChildren()).toEqual([1, 1]);
            expect(collection.getChildren()).toEqual([2]);
        });
        it("event only remove 1 element, it will return array", function () {
            var arr = [1, 2, 1];

            collection.addChildren(arr);

            var result = collection.removeChild(function (e) {
                return e === 2;
            });

            expect(result).toBeInstanceOf(wdCb.Collection);
            expect(result.getChildren()).toEqual([2]);
            expect(collection.getChildren()).toEqual([1, 1]);
        });
    });

    describe("removeRepeatItems", function(){
        it("remove repeat items, not affect origin collection", function(){
            collection.addChild(1).addChild(2).addChild(1).addChild(1);

            expect(collection.removeRepeatItems().getChildren()).toEqual([1, 2]);
            expect(collection.getChildren()).toEqual([1, 2, 1, 1]);
        });
    });

    describe("hasRepeatItems", function(){
        it("if has repeat ones, return true", function () {
            collection.addChild(1).addChild(2).addChild(1);

            expect(collection.hasRepeatItems()).toBeTruthy();
        });
        it("else, return false", function () {
            collection.addChild(1).addChild(2);

            expect(collection.hasRepeatItems()).toBeFalsy();
        });
    });
});
