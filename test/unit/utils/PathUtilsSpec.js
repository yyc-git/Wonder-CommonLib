describe("PathUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = wdCb.PathUtils;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("extname", function(){
        it("get path's ext name", function(){
            expect(Utils.extname("index.html")).toEqual(".html");
            expect(Utils.extname("index.html.md")).toEqual(".md");
            expect(Utils.extname("index.")).toEqual(".");
            expect(Utils.extname("index")).toEqual("");
        })
    });

    describe("basename", function(){
        it("get filename+extname", function(){
            expect(Utils.basename("/foo/bar/baz/asdf/quux.html")).toEqual("quux.html");
            expect(Utils.basename("/foo/bar/baz/asdf/quux.html", ".html")).toEqual("quux");
        });
    });

    describe("dirname", function(){
        it("return the directory name of a path", function(){
            expect(Utils.dirname("/foo/bar/baz/asdf/quux")).toEqual("/foo/bar/baz/asdf");
        });
    });
});
