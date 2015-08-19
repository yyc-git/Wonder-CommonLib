describe("PathUtils", function () {
    var Utils = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Utils = dyCb.PathUtils;
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
});
