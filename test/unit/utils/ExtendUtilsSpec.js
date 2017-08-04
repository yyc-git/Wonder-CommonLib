describe("ExtendUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = wdCb.ExtendUtils;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("extendUtils extendDeep", function () {
        describe("test object add or update", function(){
            var parent = null;

            beforeEach(function() {
                parent = {
                    children: {
                        name: "arvin",
                        age: 24
                    },
                    addr: "chengdu"
                }
            });

            it("you can add attribute to child,the parent should not change", function () {
                var result = Utils.extendDeep(parent, {id: 123});

                expect(result).toEqual({
                    children: {
                        name: "arvin", age: 24
                    },
                    addr: "chengdu",
                    id: 123
                });

            });

            it("you can update attribute to child,the parent should not change",function(){
                var result = Utils.extendDeep(parent, {
                    addr: "yunnan"
                });

                expect(result).toEqual({
                    children: {
                        name: "arvin", age: 24
                    },
                    addr: "yunnan"
                });
            });
        });

        describe("test array add or update", function(){

            var parent = null;

            beforeEach(function(){
               parent = [
                   "arvin",
                   [1,2,3,4],
                   {
                       name:"jack",
                       age:24
                   }
               ]
            });

            it("you can clone to new Array", function(){

                var result = Utils.extendDeep(parent);

                expect(result).toEqual([
                    "arvin",
                    [1,2,3,4],
                    {
                        name:"jack",
                        age:24
                    }
                ])
            });
        });
    });

});
