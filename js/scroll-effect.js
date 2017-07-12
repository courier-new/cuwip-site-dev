// Remember height of parallax title page
let $parallaxPageHeight = $('.page.parallax').outerHeight();
// Identify main navigation menu
let $nav = $('nav.main.menu');

// On click of single page quick-jump navigational arrow, delimited by attribute data-page=.page.(PAGE NAME)
$('*[data-page]').on('click', function() {
	// Identify target point to quick-jump to
	let target = $(this).attr('data-page');
	// Animate smooth scroll to that point in half a second
	$('html, body').animate({
		scrollTop: $(target).offset().top
	}, 500);
});

// Main scrolling actions
let scrollListener = function() {
	// Remember each of the page sections
	let $pages = $('.page');
	let $scrollY = window.scrollY + 30
	// let timeout = null
	$pages.each(function(){
		let page_top = $(this).offset().top
		if ($scrollY >= page_top &&
			$scrollY < (page_top + $(this).height())) {
				if (!$(this).hasClass('seen')) $(this).addClass('seen')
				if (!$(this).hasClass('focused')) $(this).addClass('focused')
			} else if ($(this).hasClass('focused')) {
				$(this).removeClass('focused')
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
	}

	$(document).on('scroll', scrollListener)

	scrollListener();
