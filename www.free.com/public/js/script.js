;(function( $ ) {
	"use strict";

	$( document ).on( 'ready', function() {
		
		
		var $window = $( window ),
	    $body = $( 'body' ),
	    drew = {
	    	headerFloatingHeight : 60,
	    };

		/* =======================================
		 * Preloader
		 * =======================================
		 */
		if ( $.fn.jpreLoader && $body.hasClass( 'enable-preloader' ) ) {

			$body.jpreLoader({
				showSplash : false,
				// autoClose : false,
			}, function() {
				$body.trigger( 'pageStart' );
			});

			$body.on( 'pageStart', function() {
				$body.addClass( 'done-preloader' );
			});

		} else {
			$body.trigger( 'pageStart' );
		};

		$window.trigger( 'resize' );
		$window.trigger( 'scroll' );

	});

})( jQuery );