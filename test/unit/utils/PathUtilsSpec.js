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

    describe("changeExtname", function(){
        it("change extname of a file path", function(){
            expect(Utils.changeExtname("a/b/c.json", ".png")).toEqual("a/b/c.png");
            expect(Utils.changeExtname("a/b/c.json?a=1&b=2", ".png")).toEqual("a/b/c.png?a=1&b=2");
        });
    });

    describe("basename", function(){
        it("get filename+extname", function(){
            expect(Utils.basename("/foo/bar/baz/asdf/quux.html")).toEqual("quux.html");
            expect(Utils.basename("/foo/bar/baz/asdf/quux.html", ".html")).toEqual("quux");
        });
    });

    describe("changeBasename", function(){
        it("change file name of a file path", function(){
            expect(Utils.changeBasename("a/b/c.json", "b.json")).toEqual("a/b/b.json");
            expect(Utils.changeBasename("a/b/c.json", "b.png")).toEqual("a/b/b.png");
            expect(Utils.changeBasename("a/b/c.json", "b")).toEqual("a/b/b");
            expect(Utils.changeBasename("a/b/c.json", "b", true)).toEqual("a/b/b.json");
        });
    });

    describe("dirname", function(){
        it("return the directory name of a path", function(){
            expect(Utils.dirname("/foo/bar/baz/asdf/quux")).toEqual("/foo/bar/baz/asdf");
        });
    });
});
