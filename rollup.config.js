import typescript from "wonder-rollup-plugin-typescript";

export default {
    entry: "./dist/es2015/index.js",
    indent: "\t",
    plugins: [
        typescript({
            tsconfig:false,
            typescript:require('typescript')
        })
    ],
    sourceMap: true,
    targets: [
        {
            format: "umd",
            moduleName: "wdCb",
            dest: "./dist/wdCb.js"
        },
        {
            format: "es",
            dest: "./dist/wdCb.module.js"
        }
    ]
};

