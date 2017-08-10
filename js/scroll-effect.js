/**
 * scroll-effect.js
 *
 * Handles events and effects related to scrolling on the page
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 11, 2017
 * @version   1.3.0
 */

// Identify parallax page
let $parallax = $('.page.parallax');
// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element (if such element exists)
let $menuLocation = 0;
if ($parallax.length) {
	$menuLocation = ($parallax).offset().top + ($parallax).outerHeight();
}
// Remember initial y-location of non-sticky sub nav menu, in case of page with subsections
let $submenuLocation = 0;

// Main window scrolling and resizing actions
let windowListener = function() {
	if (!appData.infoblocks.length) {
		setTimeout(function() {
			addAppInfo();
		}, 50);
	} else {
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

		// If sub nav menu is present on page and window is not mobile size
		if ($('.sub.menu').length) {
			// If scroll position passes sub nav menu and window is not mobile size
			if ($(window).scrollTop() > $submenuLocation && $(window).width() > 1000) {
				// Force sticky menu
				$('.sub.menu').addClass('sticky');
			} else {
				// Otherwise replace sticky menu at normal position
				$('.sub.menu').removeClass('sticky');
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

		// If page has subsections
		if ($subsections.length) {
			// For each subsection
			$subsections.each(function() {
				// Remember the top of that subsection, minus the height of the main nav menu
				let secTop = $(this).offset().top - navHeight;
				// If the current scroll position rests within this subsection
				if ($scrollY >= secTop && $scrollY < (secTop + $(this).outerHeight() + 10)) {
					// Mark subsection as focused
					if (!$(this).hasClass('focused')) {
						$(this).addClass('focused');
					}
					// Mark corresponding sub menu item as current
					let $menuItem = $('.sub.menu').find('a.' + $(this).attr('class').split(' ')[0]);
					if (!$menuItem.hasClass('current')) {
						$menuItem.addClass('current');
					}
				} else if ($(this).hasClass('focused')) { // Otherwise if section is marked as focused but current scroll position does not rest within it
					// Remove focused mark from section and current mark from nav item
					$(this).removeClass('focused');
					$('.sub.menu').find('a.' + $(this).attr('class').split(' ')[0]).removeClass('current');
				}
			});
		}
	}
};

// Call windowListener function on user scroll or resize of window
$(document).on('scroll', windowListener);
$(window).on('resize', windowListener);

// Select all links with hashes
$('body, window').on('click', 'a[href*="#"]', function(event) {
	// Only apply to same-page hash links
	if (
		location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
		&&
		location.hostname == this.hostname
	) {
		// Figure out element to scroll to
		let target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		// Does a scroll target exist?
		if (target.length) {
			event.preventDefault();
			// Set scroll amount to target location minus buffer
			let $scrollAmount = target.offset().top - 20;
			// If nav menu is in sticky form (at top of screen), subtract nav menu height
			$scrollAmount -= ($('.main.menu').is('.sticky')) ? $('.main.menu').outerHeight() : 0; //
			$('html, body').animate({
				scrollTop: $scrollAmount
			}, 1000, function() {
				// Change focus
				let $target = $(target);
				$target.focus();
				if ($target.is(":focus")) { // Checking if the target was focused
					return false;
				} else {
					$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
					$target.focus(); // Set focus again
				};
			});
		}
	}
});


/* End of scroll-effect.js */
