describe("Queue", function () {
    var queue = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        queue = new wdCb.Queue();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("front", function(){
        it("return front element", function(){
            queue.push(2);
            queue.push(1);

            expect(queue.front).toEqual(2);
        });
    });

    describe("rear", function(){
        it("return rear element", function(){
            queue.push(2);
            queue.push(1);

            expect(queue.rear).toEqual(1);
        });
    });

    describe("push", function () {
        it("insert element to head", function () {
            queue.push(2);
            queue.push(1);

            expect(queue.getChildren()).toEqual([1, 2]);
        });
    });

    describe("pop", function () {
        it("pop element from rear", function () {
            queue.push(2);
            queue.push(1);

            var result = queue.pop();

            expect(queue.getChildren()).toEqual([1]);
            expect(result).toEqual(2);
        });
    });

    describe("clear", function(){
        it("remove all elements", function(){
            queue.push(2);
            queue.push(1);

            queue.clear();

            expect(queue.getChildren()).toEqual([]);
        });
    });
});
