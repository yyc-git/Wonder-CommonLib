describe("FunctionUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = wdCb.FunctionUtils;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("bind", function () {
        it("apply the function to object", function () {
            var obj = {
                a: 1
            }
            var func = Utils.bind(obj, function(val){
                return this.a + val;
            });

            expect(func(1)).toEqual(2);
        });
    });
});
