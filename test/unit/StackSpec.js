describe("Stack", function () {
    var stack = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stack = new wdCb.Stack();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("top", function(){
        it("return top element", function(){
            stack.push(2);
            stack.push(1);

            expect(stack.top).toEqual(1);
        });
    });

    describe("push", function () {
        it("in stack", function () {
            stack.push(2);
            stack.push(1);

            expect(stack.getChildren()).toEqual([2, 1]);
        });
    });

    describe("pop", function () {
        it("get the last element pushed in stack", function () {
            stack.push(2);
            stack.push(1);
            var result1 = stack.pop();
            var result2 = stack.pop();

            expect(stack.getCount()).toEqual(0);
            expect(result1).toEqual(1);
            expect(result2).toEqual(2);
        });
    });

    describe("clear", function(){
        it("remove all elements", function(){
            stack.push(2);
            stack.push(1);

            stack.clear();

            expect(stack.getChildren()).toEqual([]);
        });
    });

    describe("clone", function () {
        describe("test return the shallow clone one", function () {
            function judge(target) {
                var data1 = 1;
                var data2 = {a:1};
                stack.push(data1);
                stack.push(data2);

                var result;

                if(target){
                    result = stack.clone(target);
                }
                else{
                    result = stack.clone();
                }
                var a = result.children;
                a[0] = 2;
                a[1].a = 100;

                expect(result === stack).toBeFalsy();
                expect(a.length).toEqual(2);
                expect(data2.a).toEqual(100);




                result.addChild(222);

                expect(stack.hasChild(222)).toBeFalsy();
            }

            it("test", function () {
                judge();
            });

            describe("if pass target", function(){
                beforeEach(function(){
                });

                it("not create again", function () {
                    var target = wdCb.Stack.create();

                    sandbox.stub(wdCb.Stack, "create");

                    judge(target);

                    expect(wdCb.Stack.create).not.toCalled();
                });
                it("should refresh the target's children", function () {
                    var target = wdCb.Stack.create();

                    target.addChild("c");

                    var result = stack.clone(target);

                    expect(result.getCount()).toEqual(stack.getCount());
                });
            });
        });

        describe("test return the deep clone one", function () {
            function judge(target) {
                var cloneElementResult = {};
                var data1 = 1;
                var data2 = {clone: sandbox.stub().returns(cloneElementResult)};
                stack.push(data1);
                stack.push(data2);

                var result;

                if(target){
                    result = stack.clone(target, true);
                }
                else{
                    result = stack.clone(true);
                }

                var a = result.children;

                expect(a[1]).toEqual(cloneElementResult);
            }

            it("test", function () {
                judge();
            });
            it("if pass target, not create again", function () {
                var target = wdCb.Stack.create();

                sandbox.stub(wdCb.Stack, "create");

                judge(target);

                expect(wdCb.Stack.create).not.toCalled();
            });
        });
    });
});