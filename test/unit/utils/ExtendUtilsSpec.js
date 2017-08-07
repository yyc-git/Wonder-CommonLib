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

    describe("extendDeep", function () {
        describe("test object", function(){
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

            it("can add attribute to child", function () {
                var result = Utils.extendDeep(parent, {
                    id: 123
                });

                expect(result).toEqual({
                    children: {
                        name: "arvin", age: 24
                    },
                    addr: "chengdu",
                    id: 123
                });
            });
            it("parent should not change",function () {
                Utils.extendDeep(parent, {
                    id: 123
                });

                expect(parent).toEqual({
                    children: {
                        name: "arvin",
                        age: 24
                    },
                    addr: "chengdu"
                });
            });

            describe("test when child attribute exist in parent,", function(){
                it("child attribute will be covered", function(){
                    var result = Utils.extendDeep(parent, {
                        addr: "yunnan",
                        children:{
                            name:[1,2,3]
                        }
                    });


                    expect(result).toEqual({
                        children: {
                            name: "arvin",
                            age: 24
                        },
                        addr: "chengdu"
                    });
                });
            });
        });

        describe("test array", function(){
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

            it("can clone to new Array", function(){
                var result = Utils.extendDeep(parent);

                expect(result).toEqual([
                    "arvin",
                    [1,2,3,4],
                    {
                        name:"jack",
                        age:24
                    }
                ]);
                expect(result !== parent).toBeTruthy();
            });
        });
    });

    describe("assign", function(){
        var source = null;

        beforeEach(function(){
            source = {
                name:"arvin",
                state:true,
                age:24
            }
        });

        describe("clone source assign to target", function(){
            it("test add attribute to target",function () {
                var result = Utils.assign(source,{
                    child:"gameObject"
                })

                expect(result).toEqual({
                    name:"arvin",
                    state:true,
                    age:24,
                    child:"gameObject"
                })
            })
            it("test when target has the attribute,remain it",function () {
                var result = Utils.assign(source,{
                    name:"gameObject"
                });

                expect(result).toEqual({
                    name:"gameObject",
                    state:true,
                    age:24
                })
            })
        });
    });
});
