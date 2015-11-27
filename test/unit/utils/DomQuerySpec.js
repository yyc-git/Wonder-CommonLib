describe("DomQuery", function () {
    var Query = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Query = dyCb.DomQuery;
        $("body").append($("<div id='DomQueryTest'></div>"));
    });
    afterEach(function () {
        $("#DomQueryTest").remove();
        sandbox.restore();
    });

    describe("dom query", function () {
        describe("get", function () {
            it("get dom", function(){
                var query = Query.create("#DomQueryTest");

                expect(query.get(0).id).toEqual("DomQueryTest");
            });
        });
    });

    describe("dom operator", function(){
        describe("prepend", function () {
            it("insert dom to be its' first child", function () {
                var query = Query.create("#DomQueryTest").prepend("<span id='a'></span>");

                expect(query.get(0).firstChild.id).toEqual("a");
            });
        });

        describe("prependTo", function(){
            it("prepend to the target dom", function(){
                var query = Query.create("<canvas></canvas>").prependTo("#DomQueryTest");

                expect(Query.create("#DomQueryTest").get(0).firstChild).toEqual(query.get(0));
            });
        });

        describe("remove", function () {
            it("remove dom", function () {
                var query = Query.create("#DomQueryTest");

                query.remove();

                expect($("#DomQueryTest").length).toEqual(0);
            });
        });

        describe("create dom", function(){
            it("create dom by passing element str", function(){
                var query = Query.create("<canvas></canvas>");

                expect(query.get(0).tagName.toLowerCase()).toEqual("canvas");
            });
        });
    });
});

