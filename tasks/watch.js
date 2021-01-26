const chokidar = require( 'chokidar' );
const { debounce } = require( 'lodash' );
const compile = require( './compile' );
const config = require( './config.json' );

( async () => {
	await compile();

	console.log( 'Watching source files for changes...' );
	chokidar
		.watch( 'src/**/*', { ignoreInitial: true } )
		.on( 'all', debounce( compile, 100 ) );
} )();
