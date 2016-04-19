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
        it("return the shallow clone one", function () {
            var data1 = 1;
            var data2 = {a:1};
            stack.push(data1);
            stack.push(data2);

            var result = stack.clone();
            var a = result.children;
            a[0] = 2;
            a[1].a = 100;

            expect(result === stack).toBeFalsy();
            expect(a.length).toEqual(2);
            expect(data2.a).toEqual(100);
        });
        it("return the deep clone one", function () {
            var cloneElementResult = {};
            var data1 = 1;
            var data2 = {clone: sandbox.stub().returns(cloneElementResult)};
            stack.push(data1);
            stack.push(data2);

            var result = stack.clone(true);
            var a = result.children;

            expect(a[1]).toEqual(cloneElementResult);
        });
    });
});