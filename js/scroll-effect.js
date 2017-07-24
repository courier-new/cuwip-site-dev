/**
 * scroll-effect.js
 *
 * Handles events and effects related to scrolling on the page
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 11, 2017
 * @version   1.1.0
 */

// Identify parallax page
let $parallax = $('.page.parallax');
// Identify main navigation menu
let $nav = $('nav.main.menu');
// Identify footer
let $footer = $('.page.footer');
// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element
let $menuLocation = ($parallax).offset().top + ($parallax).outerHeight();

// Main window scrolling and resizing actions
let windowListener = function() {
	// Remember each of the page sections
	let $pages = $('.page');
	let $scrollY = window.scrollY + 30

	// If parallax page and nav menu are present on page
	if ($parallax && $nav) {

		let scrolled = $(window).scrollTop();
  		$('.parallax.background').css('top', -(scrolled * 0.4) + 'px');

		// If current scroll position is past the parallax title page height or window is small enough
		if (screen.width <= 700) {
			// Force mobile menu
			$nav.removeClass('sticky').removeClass('docked').addClass('mobile');
			$nav.next().removeClass('sticky');
			$footer.addClass('mobile');
		} else if ($(window).scrollTop() > $menuLocation || screen.width <= 1000) {
			// Force sticky menu
			$nav.addClass('sticky').removeClass('docked').removeClass('mobile');
			$nav.next().addClass('sticky');
			$footer.removeClass('mobile');
		} else {
			// Otherwise replace sticky menu at normal position
			$nav.removeClass('sticky').addClass('docked').removeClass('mobile');
			$nav.next().removeClass('sticky');
			$footer.removeClass('mobile');
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

// Call windowListener function on user scroll or resize of window and once immediately on page load
$(document).on('scroll', windowListener);
$(window).resize(function() {
	windowListener();
});
windowListener();

/* End of scroll-effect.js */
