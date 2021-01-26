const path = require( 'path' );
const webpack = require( 'webpack' );
const config = require( './config.json' );
const TerserPlugin = require( 'terser-webpack-plugin' );

const configureBabelLoader = ( browserlist ) => {
	return {
		test: /\.js$/,
		use: {
			loader: 'babel-loader',
			options: {
				babelrc: false,
				exclude: [
					/core-js/,
					/regenerator-runtime/,
				],
				presets: [
					[ '@babel/preset-env', {
						loose: true,
						modules: false,
						// debug: true,
						corejs: 3,
						useBuiltIns: 'usage',
						targets: {
							browsers: browserlist,
						},
					} ],
				],
				plugins: [ '@babel/plugin-syntax-dynamic-import' ],
			},
		},
	};
};

const baseConfig = {
	mode: process.env.NODE_ENV || 'development',
	cache: {
		type: 'memory',
	},
	devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [ new TerserPlugin( {
			test: /\.m?js(\?.*)?$/i,
			extractComments: false,
		} ) ],
	},
};

const modernConfig = Object.assign( {}, baseConfig, {
	entry: config.modernJsEntries,
	output: {
		path: path.resolve( __dirname, '..', config.publicDir + '/js' ),
		publicPath: config.publicStaticPath + 'js/',
		filename: '[name].js',
	},
	module: {
		rules: [
			configureBabelLoader( [
				// The last two versions of each browser, excluding versions
				// that don't support <script type="module">.
				'last 2 Chrome versions', 'not Chrome < 60',
				'last 2 Safari versions', 'not Safari < 10.1',
				'last 2 iOS versions', 'not iOS < 10.3',
				'last 2 Firefox versions', 'not Firefox < 54',
				'last 2 Edge versions', 'not Edge < 15',
			] ),
		],
	},
} );

const legacyConfig = Object.assign( {}, baseConfig, {
	entry: config.legacyJsEntries,
	output: {
		path: path.resolve( __dirname, '..', config.publicDir + '/js' ),
		publicPath: config.publicStaticPath + 'js/',
		filename: '[name].js',
	},
	module: {
		rules: [
			configureBabelLoader( [
				'> 1%',
				'last 2 versions',
				'Firefox ESR',
			] ),
		],
	},
} );

const createCompiler = ( config ) => {
	const compiler = webpack( config );
	return () => {
		return new Promise( ( resolve, reject ) => {
			compiler.run( ( err, stats ) => {
				if ( err ) {
					return reject( err );
				}
				console.log( stats.toString( { colors: true } ) + '\n' );
				resolve();
			} );
		} );
	};
};

const compileModernBundle = createCompiler( modernConfig );
const compileLegacyBundle = createCompiler( legacyConfig );

module.exports = async () => {
	await compileModernBundle();
	await compileLegacyBundle();
};
