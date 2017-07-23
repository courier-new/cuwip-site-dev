/**
 * scroll-effect.js
 *
 * Handles events and effects related to scrolling on the page
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 11, 2018
 * @version   1.0.1
 */

// Identify parallax page
let $parallax = $('.page.parallax');
// Identify main navigation menu
let $nav = $('nav.main.menu');
// Remember y-location of non-sticky menu down the page
let $menuLocation = ($nav).offset().top;

// Main scrolling actions
let scrollListener = function() {
	// Remember each of the page sections
	let $pages = $('.page');
	let $scrollY = window.scrollY + 30

	// If parallax page and nav menu are present on page
	if ($parallax && $nav) {

		let scrolled = $(window).scrollTop();
  		$('.parallax.background').css('top', -(scrolled * 0.3) + 'px');

		// If current scroll position is past the parallax title page height or window is small enough
		if ($(window).scrollTop() > $menuLocation || screen.width <= 1000) {
			// Force sticky menu
			$nav.addClass('sticky');
			$nav.next().addClass('no sticky');
		} else {
			// Otherwise replace sticky menu at normal position
			$nav.removeClass('sticky');
			$nav.next().removeClass('no sticky');
		}
	}

	// For each page section
	$pages.each(function() {
		// Remember the top of that page
		let pageTop = $(this).offset().top
		// If the current scroll position rests within this page section
		if ($scrollY >= pageTop && $scrollY < (pageTop + $(this).height())) {
			// Make sure page is marked as seen and focused
			if (!$(this).hasClass('seen')) {
				$(this).addClass('seen')
			}
			if (!$(this).hasClass('focused')) {
				$(this).addClass('focused')
			}
		} else if ($(this).hasClass('focused')) { // Otherwise if page is marked as focused but current scroll position does not rest within it
			// Remove focused mark from page
			$(this).removeClass('focused')
		}
	});
};

// Call scrollListener function on user scroll or resize of window and once immediately on page load
$(document).on('scroll', scrollListener);
$(window).resize(function() {
	scrollListener();
});
scrollListener();

/* End of scroll-effect.js */
