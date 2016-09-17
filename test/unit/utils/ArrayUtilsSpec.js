describe("ArrayUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = wdCb.ArrayUtils;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("contain. judge whether array contain ele", function () {
        it("if ele is function", function () {
            var arr = [1, 2];

            expect(Utils.contain(arr, function (val) {
                return val === 2;
            })).toBeTruthy();
            expect(Utils.contain(arr, function (val) {
                return val === 3;
            })).toBeFalsy();
        });
        it("else", function () {
            var arr = [1, 2, "abc"];

            expect(Utils.contain(arr, 1)).toBeTruthy();
            expect(Utils.contain(arr, 3)).toBeFalsy();
            expect(Utils.contain(arr, "ab")).toBeFalsy();
        });
    });

    describe("removeRepeatItems", function(){
        it("remove repeated items", function(){
            var arr = [1, 1, 2, true, true];

            expect(Utils.removeRepeatItems(arr)).toEqual(
                [1, 2, true]
            );
        });
        it("can pass custom isEqual func", function(){
            var arr = [1, 1, 2, {a:1}, {a:1}];

            expect(Utils.removeRepeatItems(arr, function(a, b){
                return a===b || (a.a && b.a && a.a === b.a);
            })).toEqual(
                [1, 2, {a:1}]
            );
        });
        it("test all repeated items", function () {
            var arr = [1, 1, 1];

            expect(Utils.removeRepeatItems(arr)).toEqual(
                [1]
            );
        });
    });
});
