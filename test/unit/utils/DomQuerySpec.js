describe("DomQuery", function () {
    var Query = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Query = wdCb.DomQuery;
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
            it("can set dom id", function(){
                var query = Query.create("<style id='aaa'></style>");

                expect(query.get(0).tagName.toLowerCase()).toEqual("style");
                expect(query.get(0).id).toEqual("aaa");
            });
        });

        describe("change css", function(){
            describe("css", function(){
                it("change style", function(){
                    var query = Query.create("#DomQueryTest").css("margin", "1px 2px 3px 4px");

                    expect(document.getElementById("DomQueryTest").style.margin).toEqual("1px 2px 3px 4px");
                });
            });
        });

        describe("attr", function(){
            beforeEach(function () {
                $("body").append($("<div id='DomQueryTest2'></div>"));
            });
            afterEach(function () {
                $("#DomQueryTest2").remove();
            });

            it("get attribute of the first dom", function(){
                var query = Query.create("div").attr("id");

                expect(Query.create("#DomQueryTest").attr("id")).toEqual("DomQueryTest");
            });

            describe("set attribute", function(){
                it("test set single dom attribute", function(){
                    var query = Query.create("#DomQueryTest2");

                    query.attr("name", "div1");
                    query.attr("id", "id1");

                    var dom = query.get(0);
                    expect(dom.id).toEqual("id1");
                    expect(dom.getAttribute("name")).toEqual("div1");
                });
            });
        })

        describe("text", function(){
            var query;

            beforeEach(function(){
                query = Query.create("#DomQueryTest");
            });

            describe("test text(str)", function(){
                it("if textContent attr of dom exist, set it", function () {
                    var dom = {
                        textContent:""
                    };
                    sandbox.stub(query, "get").returns(dom);

                    var str = "aaa"
                    query.text(str);

                    expect(dom.textContent).toEqual(str);
                });
                it("else, set innerText of dom", function () {
                    var dom = {
                        innerText:""
                    };
                    sandbox.stub(query, "get").returns(dom);

                    var str = "aaa"
                    query.text(str);

                    expect(dom.innerText).toEqual(str);
                });
            });

            describe("test text()", function(){
                beforeEach(function(){

                });

                it("if textContent attr of dom exist, return it", function () {
                    var dom = {
                        textContent:""
                    };
                    sandbox.stub(query, "get").returns(dom);

                    var str = "aaa"
                    query.text(str);

                    expect(query.text()).toEqual(str);
                });
                it("else, return innerText of dom", function () {
                    var dom = {
                        innerText:""
                    };
                    sandbox.stub(query, "get").returns(dom);

                    var str = "aaa"
                    query.text(str);

                    expect(query.text()).toEqual(str);
                });
            });
        });
    });
});

