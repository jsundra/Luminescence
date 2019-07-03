const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const commonConfig = {
	mode: 'development',
	resolve: {
		modules: [
			'node_modules',
			'./src'
		],
        extensions: ['.js', '.ts', '.tsx'],
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
};

const serverConfig = {
	target: 'node',
	entry: './src/server.ts',
	output: {
		path: path.resolve(__dirname, './dist/node'),
		filename: 'server.js'
	},
	node: {
		__dirname: true
	}
};

const clientConfig = {
	target: 'web',
	entry: './src/web.tsx',
	output: {
		path: path.resolve(__dirname, './dist/www'),
		filename: 'web.js'
	},

    plugins: [
        new CopyPlugin([
            { from: 'static', to: '' }
        ])
    ],
};

module.exports = [{ ...commonConfig, ...serverConfig }, { ...commonConfig, ...clientConfig }];
