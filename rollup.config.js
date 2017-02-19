export default {
	entry: "./dist/es2015/index.js",
	indent: "\t",
	plugins: [
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
