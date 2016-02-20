describe("JudgeUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = wdCb.JudgeUtils;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("isArray", function(){
        it("judge is array like", function(){
            expect(Utils.isArray([])).toBeTruthy();
        });
    });

    describe("isArrayExactly", function(){
        it("judge is array exactly", function(){
            var arr = {
                length:1
            };
            expect(Utils.isArray(arr)).toBeTruthy();
            expect(Utils.isArrayExactly(arr)).toBeFalsy();

            expect(Utils.isArrayExactly([])).toBeTruthy();
        });
    });

    describe("isFunction", function(){
        it("judge is function", function(){
            expect(Utils.isFunction({})).toBeFalsy();
            expect(Utils.isFunction([])).toBeFalsy();

            expect(Utils.isFunction(function(){})).toBeTruthy();
        });
    });

    describe("isNumber", function(){
        it("judge is number", function(){
            expect(Utils.isNumber(1)).toBeTruthy();
        });
    });

    describe("isNumberExactly", function(){
        it("judge is number exactly", function(){
            expect(Utils.isNumber(new Number(1))).toBeFalsy();
            expect(Utils.isNumberExactly(new Number(1))).toBeTruthy();
            expect(Utils.isNumberExactly(1)).toBeTruthy();
        });
    });

    describe("isString", function(){
        it("judge is string", function(){
            expect(Utils.isString("")).toBeTruthy();
            expect(Utils.isString("a")).toBeTruthy();
        });
    });

    describe("isStringExactly", function(){
        it("judge is string exactly", function(){
            expect(Utils.isString(new String("a"))).toBeFalsy();
            expect(Utils.isStringExactly(new String("a"))).toBeTruthy();
            expect(Utils.isStringExactly("a")).toBeTruthy();
        });
    });

    describe("isBoolean", function(){
        it("judge is boolean", function(){
            expect(Utils.isBoolean("true")).toBeFalsy();

            expect(Utils.isBoolean(false)).toBeTruthy();
            expect(Utils.isBoolean(true)).toBeTruthy();
        });
    });

    describe("isDom", function(){
        it("judge is dom", function(){
            expect(Utils.isDom($("<div></div>"))).toBeFalsy();
            expect(Utils.isDom({})).toBeFalsy();

            expect(Utils.isDom($("<div></div>").get(0))).toBeTruthy();
        });
    });

    describe("isObject", function(){
        it("judge is Object", function(){
            expect(Utils.isObject(1)).toBeFalsy();

            expect(Utils.isObject($("<div></div>").get(0))).toBeTruthy();
            expect(Utils.isObject(function(){})).toBeTruthy();
            expect(Utils.isObject([])).toBeTruthy();
            expect(Utils.isObject({})).toBeTruthy();
        });
    });

    describe("isDirectObject", function(){
        it("judge is Object", function(){
            expect(Utils.isDirectObject($("<div></div>").get(0))).toBeFalsy();
            expect(Utils.isDirectObject(function(){})).toBeFalsy();
            expect(Utils.isDirectObject([])).toBeFalsy();

            expect(Utils.isDirectObject({})).toBeTruthy();
        });
    });

    //todo more tests
});

