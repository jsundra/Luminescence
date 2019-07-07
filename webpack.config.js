const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const commonConfig = {
	mode: 'development',
	resolve: {
		modules: [
			'node_modules'
		],
        alias: {
            Common: path.join(__dirname, './src/Common')
        },
        extensions: ['.js', '.ts', '.tsx'],
	},
};

function buildTsLoader(configFile) {
    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
            configFile
        }
    };
}

const serverConfig = {
	target: 'node',
    resolve: {
	    modules: [
	        path.join(__dirname, './src/Server')
        ]
    },
    module: {
        rules: [
            buildTsLoader('server.tsconfig.json')
        ]
    },

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
    resolve: {
        modules: [
            path.join(__dirname, './src/Client')
        ]
    },
    module: {
        rules: [
            buildTsLoader('client.tsconfig.json')
        ]
    },

	entry: './src/Client/web.tsx',
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

function deepCopy(orig, replace) {
    if (Array.isArray(orig)) {
        return orig.concat(replace);
    }

    const rtn = {...orig};
    for (let prop in replace) {
        const origValue = orig[prop];
        if (origValue !== undefined && typeof origValue === 'object') {
            rtn[prop] = deepCopy(origValue, replace[prop]);
        } else {
            rtn[prop] = replace[prop];
        }
    }
    return rtn;
}

const serverBlob = deepCopy(commonConfig, serverConfig);
const clientBlob = deepCopy(commonConfig, clientConfig);

module.exports = [serverBlob, clientBlob];
