const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: "./src/main.tsx",
	resolve: {
		modules: [
			'node_modules',
			'./src'
		],
    extensions: ['.js', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
        exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},
	plugins: [
		new CopyPlugin([
			{ from: 'static', to: '' }
		])
	]
};
