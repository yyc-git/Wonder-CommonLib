describe("List", function () {
    var list = null;
    var sandbox = null;

    function create(children){
        var list = new dyCb.List();

        list.children = children;

        return list;
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        list = create([]);
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("hasChild", function () {
        it("如果参数为func,则使用func进行遍历判断", function () {
            list.addChild(1);
            list.addChild("a");

            expect(list.hasChild(function (c) {
                return c === 1;
            })).toBeTruthy();
            expect(list.hasChild(function (c) {
                return c === "b";
            })).toBeFalsy();
        });

        it("判断容器中是否存在该数据", function () {
            var fake = {};
            fake2 = {
                a: 1
            };
            list.addChild(fake);

            expect(list.hasChild(fake)).toBeTruthy();
            expect(list.hasChild(fake2)).toBeFalsy();
        });
        it("如果容器元素有uid，则根据uid判断", function () {
            var fake = {uid:1},
                fake2 = {uid:2},
                fake3 = {uid:1};
            list.addChild(fake);

            expect(list.hasChild(fake)).toBeTruthy();
            expect(list.hasChild(fake3)).toBeTruthy();
            expect(list.hasChild(fake2)).toBeFalsy();

        });
    });

    describe("getChildren", function () {
        it("directly return the children", function () {
            var children = list.getChildren();

            expect(children).toBeSameArray(list.children);
        });
    });

    describe("getChild", function () {
        it("获得容器指定位置的数据", function () {
            list.children = [1, 2];
            var child = list.getChild(1);

            expect(child).toEqual(2);
        });
    });

    describe("addChild", function () {
        it("插入到容器的末尾", function () {
            var children = null;

            list.addChild(1).addChild(2);

            children = list.getChildren();

            expect(children).toEqual([1, 2]);
        });
    });

    describe("addChildren", function () {
        it("add array", function () {
            var fakeElement = [1, 2];

            list.addChildren(fakeElement);

            expect(list.getChildren()).toEqual(fakeElement);
        });
        it("add another List", function(){
            var col = create([1, 2]);

            list.addChildren(col.getChildren());

            expect(list.getChildren()).toEqual(col.getChildren());
        });
        it("add one element", function () {
            list.addChildren(1);

            expect(list.getChildren()).toEqual([1]);
        });
    });

    describe("getCount", function () {
        it("返回元素个数", function () {
            list.addChildren([1, 2]);

            expect(list.getCount()).toEqual(2);
        });
    });

    describe("removeChildHelper", function () {
        it("return all removed elements", function(){
            var arr = [1, 2, 1];

            list.addChildren(arr);

            expect(list.removeChildHelper(function (e) {
                return e === 1;
            })).toEqual([1, 1]);
            expect(list.getChildren()).toEqual([2]);
        });
        it("event only remove 1 element, it will return array", function(){
            var arr = [1, 2, 1];

            list.addChildren(arr);

            expect(list.removeChildHelper(function (e) {
                return e === 2;
            })).toEqual([2]);
            expect(list.getChildren()).toEqual([1, 1]);
        });

        describe("如果第一个参数为function", function () {
            it("删除容器中调用func返回true的元素。", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                list.addChild(child);

                list.removeChildHelper(function (e) {
                    if (e.x === 1 && e.y === 1) {
                        return true;
                    }
                    return false;
                });

                expect(list.getChildren().length).toEqual(0);
            });
            it("第二种调用方式", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                var target = {
                    x: 1,
                    y: 1
                };
                list.addChild(child);

                list.removeChildHelper(function (e) {
                    if (e.x === target.x && e.y === target.y) {
                        return true;
                    }
                    return false;
                });

                expect(list.getChildren().length).toEqual(0);
            });
            //it("删除成功返回true，失败返回false", function () {
            //    var arr = [1, 2];
            //
            //    list.addChildren(arr);
            //
            //    expect(list.removeChildHelper(function (e) {
            //        return e === 1;
            //    })).toBeTruthy();
            //    expect(list.removeChildHelper(function (e) {
            //        return e === 1;
            //    })).toBeFalsy();
            //});
        });

        describe("如果第一个参数为引擎实体类", function () {
            beforeEach(function () {
                sandbox.stub()
            });

            function buildObj(uid) {
                return {
                    //isInstanceOf: sandbox.stub().returns(true),
                    uid: uid
                }
            }

            it("删除匹配项（Uid匹配）", function () {
                var child = buildObj(1);
                list.addChild(child);

                list.removeChildHelper(child);

                expect(list.getChildren().length).toEqual(0);
            });
            //it("删除成功返回true，失败返回false", function () {
            //    var child = buildObj(1);
            //
            //    list.addChild(child);
            //
            //    expect(list.removeChildHelper(child)).toBeTruthy();
            //    expect(list.removeChildHelper(child)).toBeFalsy();
            //});
        });

        describe("否则", function () {
            it("删除匹配项（===匹配）", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                list.addChild(child);
                list.addChild(1);

                list.removeChildHelper(child);

                expect(list.getChildren().length).toEqual(1);

                list.removeChildHelper(1);

                expect(list.getChildren().length).toEqual(0);
            });
            //it("删除成功返回true，失败返回false", function () {
            //    var arr = [1, 2];
            //
            //    list.addChildren(arr);
            //
            //    expect(list.removeChildHelper(1)).toBeTruthy();
            //    expect(list.removeChildHelper(1)).toBeFalsy();
            //});
        });

    });

    //describe("removeChildAt", function () {
    //    it("如果序号小于0，则报错", function () {
    //        expect(function () {
    //            list.removeChildAt(-1);
    //        }).toThrow();
    //    });
    //    it("删除容器中指定位置的元素。", function () {
    //        list.addChildren([1, 2, 3]);
    //
    //        list.removeChildAt(1);
    //
    //        expect(list.getChildren().length).toEqual(2);
    //        expect(list.getChildAt(1)).toEqual(3);
    //    });
    //});

    describe("removeAllChildren", function () {
        it("清空容器", function () {
            list.addChild(1).addChild(2);

            list.removeAllChildren();

            expect(list.getChildren().length).toEqual(0);
        });
//        it("重置cursor", function () {
//            list.removeAllChildren();
//
//            expect(list._cursor).toEqual(0);
//        });
    });

    describe("toArray", function(){
        it("return children", function(){
            var arr = [1, {a: 1}];
            list.addChildren(arr);

            var a = list.toArray();
            a[1].a = 100;

            expect(a === arr).toBeFalsy();
            expect(a.length).toEqual(2);
            expect(arr[1].a).toEqual(100);

        });
    });

    describe("forEach", function () {
        it("遍历容器", function () {
            var a = 0;
            var b = 0;
            list.addChild(1);
            list.addChild(2);

            list.forEach(function (ele, index) {
                a += ele;
                b += index;
            });

            expect(a).toEqual(3);
            expect(b).toEqual(1);
        });
        it("如果返回$BREAK，则跳出遍历", function () {
            var a = 0;
            list.addChild(1);
            list.addChild(2);

            list.forEach(function (ele, index) {
                a += ele;
                return dyCb.$BREAK;
            });

            expect(a).toEqual(1);
        });
        it("can set the context for this", function () {
            var t = [1, 2];
            var a = 0;
            list.addChild(100);
            list.addChild(200);

            list.forEach(function (ele, index) {
                a += this[index];
            }, t);

            expect(a).toEqual(3);
        });
    });
});