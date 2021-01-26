const Carousel = {

	/**
	 * Carousel selector.
	 *
	 * @type {string}
	 */
	carouselSelector: '.carousel',

	/**
	 * Initialize.
	 *
	 * @param {string} carouselSelector The carousels selector.
	 * @return {void}
	 */
	init( carouselSelector ) {
		if ( carouselSelector ) {
			this.carouselSelector = carouselSelector;
		}
		this.carousels = document.querySelectorAll( this.carouselSelector + ':not(.active)' );

		for ( let i = 0; i < this.carousels.length; i++ ) {
			this.carousels[ i ].classList.add( 'active' );
		}
	},

};

export default Carousel;
