/* Vendors */
import {IdleQueue} from 'idlize/IdleQueue.mjs'; /* Includes cIC, rIC polyfills */

/* Statically loaded Components */
import { dep1 } from './examples/dependency-1.js';

/* Load import-1 */
const loadImport1 = async () => {
	const { import1 } = await import(
		/* webpackChunkName: "import1" */
		'./examples/import-1.js' );
	console.log( 'Dynamic Import 1 value:', import1 );
};

/* Load import-2 */
const loadImport2 = async () => {
	import( /* webpackChunkName: "import2" */
		'./examples/import-2.js' ).then( ( module ) => {
		console.log( 'Dynamic Import 2 value:', module.import2 );
	} );
};

/* Loads import-3 when element is present (existing or added later). */
const loadCarouselWhenNeeded = async () => {
	const carouselSelector = '.carousel';

	const loadCarousel = async () => {
		const carouselElmsToObserve = document.querySelector( carouselSelector );
		if ( carouselElmsToObserve ) {
			const { default: carouselModule } = await import( /* webpackChunkName: "import3" */
				'./examples/import-3.js' );
			carouselModule.init( carouselSelector );
		}
	};

	// Also load when more carousels are added dynamically to the DOM.
	const carouselObserver = new MutationObserver( loadCarousel );
	carouselObserver.observe( document, { subtree: true, childList: true } );
};

const main = async () => {
	/* 1: Critical UX tasks. */
	console.log( 'Dependency 1 value:', dep1 );
	
	/* 2: Queue tasks to be run during idle periods.	*/
	const queue = new IdleQueue();

	queue.pushTask( loadImport1 );
	
	/* 3: Load when a particular element is present. */
	loadCarouselWhenNeeded();
	
	/* 4: Load on user interaction / click */
	const button = document.querySelector( '.lazy-import2' );
	if ( button ) {
		button.addEventListener( 'click', ( e ) => {
			loadImport2();
		} );
	}

	/* Example: Appends a <div.carousel> which triggers #3. */
	const carouselApender = document.querySelector( '.append-carousel' );
	if ( carouselApender ) {
		carouselApender.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			const carouselElm = document.createElement( 'div' );
			carouselElm.classList.add( 'carousel' );
			carouselElm.innerText = 'dynamic carousel';
			document.body.appendChild( carouselElm );
		} );
	}
};

if ( 'loading' === document.readyState ) {
	// The DOM has not yet been loaded.
	document.addEventListener( 'DOMContentLoaded', main );
} else {
	// The DOM has already been loaded.
	main();
}
