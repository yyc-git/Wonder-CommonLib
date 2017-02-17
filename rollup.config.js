import typescript from "rollup-plugin-typescript";

export default {
	entry: "./src/index.ts",
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
