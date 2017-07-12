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

	$("*[data-page]").on('click', function () {
		var target = $(this).attr('data-page');
		$('html, body').animate({
			scrollTop: $(target).offset().top
		}, 500);
	});

	var scrollListener = function scrollListener() {
		var pages = $('.page');
		var scrollY = window.scrollY + 30;

		var timeout = null;
		pages.each(function () {
			var page_top = $(this).offset().top;
			if (scrollY >= page_top && scrollY < page_top + $(this).height()) {
				if (!$(this).hasClass('seen')) $(this).addClass('seen');
				if (!$(this).hasClass('focused')) $(this).addClass('focused');
			} else if ($(this).hasClass('focused')) {
				$(this).removeClass('focused');
			}
		});
	};

	$(document).on('scroll', scrollListener);

	scrollListener();
})();