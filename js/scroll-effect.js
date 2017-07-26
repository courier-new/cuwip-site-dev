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
// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element (if such element exists)
let $menuLocation = 0;
if ($parallax.length) {
	$menuLocation = ($parallax).offset().top + ($parallax).outerHeight();
}

// Main window scrolling and resizing actions
let windowListener = function() {
	let $scrollY = window.scrollY + 30

	// If parallax element is present on page
	if ($parallax.length) {
		let scrolled = $(window).scrollTop();
		// Scroll parallax element at 40% normal scroll speed
		$('.parallax.background').css('top', -(scrolled * 0.4) + 'px');
		// If current scroll position is past the parallax title page and screen width is between mobile and large
	}

	// If nav menu is present on page
	if ($nav.length) {
		// If window is mobile size
		if ($(window).width() <= 700) {
			// Force mobile menu
			$nav.removeClass('sticky').removeClass('docked').addClass('mobile');
			$nav.next().next().removeClass('sticky');
			$footer.addClass('mobile');
		}
		// Otherwise, if parallax element is present on page
		else if ($parallax.length) {
			if ($(window).scrollTop() > $menuLocation || $(window).width() <= 1000 && $(window).width() > 700) {
				// Force sticky menu
				$nav.addClass('sticky').removeClass('docked').removeClass('mobile');
				$nav.next().next().addClass('sticky');
				$footer.removeClass('mobile');
				$('nav.menu.drawer').slideUp();
			} else {
				// Otherwise replace sticky menu at normal position
				$nav.removeClass('sticky').addClass('docked').removeClass('mobile');
				$nav.next().next().removeClass('sticky');
				$footer.removeClass('mobile');
				$('nav.menu.drawer').slideUp();
			}
		}
		// Otherwise, just use sticky menu
		else {
			// Force sticky menu
			$nav.addClass('sticky').removeClass('docked').removeClass('mobile');
			$nav.next().next().addClass('sticky');
			$footer.removeClass('mobile');
			$('nav.menu.drawer').slideUp();
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

	// If applicable, for each page subsection
	if ($subsections.length) {
		let tallest = 0;
		let shortest = 3000;
		$subsections.each(function() {
			// Determine the tallest and shortest elements
			tallest = $(this).outerHeight() > tallest ? $(this).outerHeight() : tallest;
			shortest = $(this).outerHeight() < shortest ? $(this).outerHeight() : shortest;
		});
		$('.inner.hiding.container').css('height', tallest);
		$('.inner.hiding.container > .text.block').css('margin-bottom', tallest - shortest + 30);
	}
};

// Interpret and scroll to a designated section of an .inner.hiding.container
let scrollToSubsection = function(section, goToTop) {
	section = section.toLowerCase().replace(/\s/g, '');
	let $container = $('.inner.hiding.container');
	// Scroll to container height + subsection height - subsection padding
	let $scrollAmount = $('.' + section + '.text.block').position().top + $container.scrollTop() - parseFloat($container.parent().css('padding-top'));
	// To also subtract h1 padding, replace this in calculation:
	// - parseFloat($('.page .inner > .text.block h1').css('margin-top'));
	$container.animate({scrollTop: $scrollAmount});
	if (goToTop) {
		$('html, body').animate({scrollTop: $('.inner.hiding.container').parent().offset().top});
	}
	// Mark new current subsection on navigation menu
	$('nav.sub.menu a').each(function() {
		if ($(this).hasClass('current')) {
			$(this).removeClass('current');
		}
		if ($(this).hasClass(section)) {
			$(this).addClass('current');
		}
	});
};

// Call windowListener function on user scroll or resize of window
$(document).on('scroll', windowListener);
$(window).on('resize', windowListener);

// Call scrollToSubsection function on click of sub navigation menu or next/prev button
$('nav.sub.menu').on('click', 'a', function() {
	// Call on name of subsection clicked
	scrollToSubsection($(this).find('li')[0].innerHTML, false);
});
$('.forward.back.buttons').on('click', 'a', function() {
	// Call on name of subsection clicked
	scrollToSubsection($(this).attr('class'), true);
});

/* End of scroll-effect.js */
