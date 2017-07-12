'use strict';

/**
 * all-concat.js
 *
 * Concatenates all compiled js files together
 *
 * jQuery 3.2.1+
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     July 2017
 */

// @prepros-append begin.js
// @prepros-append scroll-effect.js
// @prepros-append end.js

// Outer wrapper
(function () {

	$(document).on('ready', function () {
		// Gather array of all pages
		var pages = $('.page');

		// Mark each section as ready
		pages.each(function () {
			$(this).addClass('ready');
		});
	});

	// Remember height of parallax title page
	var $parallaxPageHeight = $('.page.parallax').outerHeight();
	// Identify main navigation menu
	var $nav = $('nav.main.menu');

	// On click of single page quick-jump navigational arrow, delimited by attribute data-page=.page.(PAGE NAME)
	$('*[data-page]').on('click', function () {
		// Identify target point to quick-jump to
		var target = $(this).attr('data-page');
		// Animate smooth scroll to that point in half a second
		$('html, body').animate({
			scrollTop: $(target).offset().top
		}, 500);
	});

	// Main scrolling actions
	var scrollListener = function scrollListener() {
		// Remember each of the page sections
		var $pages = $('.page');
		var $scrollY = window.scrollY + 30;
		// let timeout = null
		$pages.each(function () {
			var page_top = $(this).offset().top;
			if ($scrollY >= page_top && $scrollY < page_top + $(this).height()) {
				if (!$(this).hasClass('seen')) $(this).addClass('seen');
				if (!$(this).hasClass('focused')) $(this).addClass('focused');
			} else if ($(this).hasClass('focused')) {
				$(this).removeClass('focused');
			}
		});

		// If current scroll position is past the parallax title page height
		if ($(window).scrollTop() > $parallaxPageHeight) {
			// Force sticky menu
			$nav.addClass('sticky');
			$nav.next().addClass('no sticky');
		} else {
			// Otherwise replace sticky menu at normal position
			$nav.removeClass('sticky');
			$nav.next().removeClass('no sticky');
		}
	};

	$(document).on('scroll', scrollListener);

	scrollListener();
})();