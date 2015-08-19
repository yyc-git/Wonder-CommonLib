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
});