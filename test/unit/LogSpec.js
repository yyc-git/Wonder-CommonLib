describe("Log", function () {
    var Log = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Log = dyCb.Log;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("info", function(){
        it("FUNC_MUST_NOT_BE", function(){
            expect(Log.info.FUNC_MUST_NOT_BE("a", "b")).toEqual("a must not be b");
        });
        it("FUNC_MUST_NOT_DEFINE", function(){
            expect(Log.info.FUNC_MUST_NOT_DEFINE("a", "b")).toEqual("a must not define b");
        });
    });

    describe("log", function(){
        it("if trace exist, trace info", function(){
            sandbox.stub(console, "trace");
            sandbox.stub(console, "log");

            Log.log("aaa %d", 2);

            expect(console.trace).toCalledWith("aaa %d", 2);
            expect(console.log).not.toCalled();
        });
        it("else if console.log exist, use it", function(){
            sandbox.stub(console, "trace", null);
            sandbox.stub(console, "log");
            sandbox.stub(window, "alert");

            Log.log("aaa %d", 2);

            expect(console.log).toCalledWith("aaa %d", 2);
            expect(window.alert).not.toCalled();
        });
        it("else, use window.alert", function(){
            sandbox.stub(console, "trace", null);
            sandbox.stub(console, "log", null);
            sandbox.stub(window, "alert");

            Log.log("aaa %d", 2);

            expect(window.alert).toCalledWith("aaa %d,2");
        });
    });

    describe("assert", function(){
        describe("if true", function(){
            it("if console.assert exist, use it", function(){
                sandbox.stub(console, "assert");
                sandbox.stub(Log, "log");

                Log.assert(true, "aaa %d", 2);

                expect(console.assert).toCalledWith("aaa %d", 2);
                expect(Log.log).not.toCalled();
            });
            it("else, use Log.log", function(){
                sandbox.stub(console, "assert", null);
                sandbox.stub(Log, "log");

                Log.assert(true, "aaa %d", 2);

                expect(Log.log).toCalledWith("aaa %d", 2);
            });
        });
    });

    describe("error", function(){
        describe("if true", function(){
            //it("if console.error exist, use it", function(){
            //    sandbox.stub(console, "error");
            //
            //    expect(function(){
            //        Log.error(true, "aaa %d", 2);
            //    }).not.toThrow();
            //
            //    expect(console.error).toCalledWith("aaa %d", 2);
            //});
            it("else, throw error", function(){
                sandbox.stub(console, "error", null);

                expect(function(){
                    Log.error(true, "aaa %d", 2);
                }).toThrow();
            });
        });
    });

    describe("warn", function(){
        it("if console.warn exist, use it and trace info", function(){
            sandbox.stub(console, "warn");
            sandbox.stub(console, "trace");

            Log.warn("aaa %d", 2);

            expect(console.warn).toCalledWith("aaa %d", 2);
            expect(console.trace).toCalledWith("warn trace");
        });
        it("else, use Log.log", function(){
            sandbox.stub(console, "warn", null);
            sandbox.stub(Log, "log");

            Log.warn("aaa %d", 2);

            expect(Log.log).toCalledWith("aaa %d", 2);
        });
    });
});

