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
});