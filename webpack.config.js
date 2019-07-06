const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

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
	entry: './src/Server/main.ts',
	output: {
		path: path.resolve(__dirname, './dist/node'),
		filename: 'server.js'
	},
	node: {
		__dirname: false
	},
	externals: [nodeExternals()]
};

const clientConfig = {
	target: 'web',
	entry: './src/web.tsx',
	output: {
		path: path.resolve(__dirname, './dist/www'),
		filename: 'main.js'
	},

    plugins: [
        new CopyPlugin([
            { from: 'static', to: '' }
        ])
    ],
};

module.exports = [{ ...commonConfig, ...serverConfig }, { ...commonConfig, ...clientConfig }];
