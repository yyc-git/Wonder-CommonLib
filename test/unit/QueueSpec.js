describe("Queue", function () {
    var queue = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        queue = new dyCb.Queue();
    });
    afterEach(function () {
        sandbox.restore();
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
