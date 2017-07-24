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
// @prepros-append nav.js
// @prepros-append countdown.js
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
	var $parallax = $('.page.parallax');
	// Identify main navigation menu
	var $nav = $('nav.main.menu');
	// Identify footer
	var $footer = $('.page.footer');
	// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element
	var $menuLocation = $parallax.offset().top + $parallax.outerHeight();

	// Main window scrolling and resizing actions
	var windowListener = function windowListener() {
		// Remember each of the page sections
		var $pages = $('.page');
		var $scrollY = window.scrollY + 30;

		// If parallax page and nav menu are present on page
		if ($parallax && $nav) {

			var scrolled = $(window).scrollTop();
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
		$pages.each(function () {
			// Remember the top of that page
			var pageTop = $(this).offset().top;
			// If the current scroll position rests within this page section
			if ($scrollY >= pageTop && $scrollY < pageTop + $(this).height()) {
				// Make sure page is marked as seen and focused
				if (!$(this).hasClass('seen')) {
					$(this).addClass('seen');
				}
				if (!$(this).hasClass('focused')) {
					$(this).addClass('focused');
				}
			} else if ($(this).hasClass('focused')) {
				// Otherwise if page is marked as focused but current scroll position does not rest within it
				// Remove focused mark from page
				$(this).removeClass('focused');
			}
		});
	};

	// Call windowListener function on user scroll or resize of window and once immediately on page load
	$(document).on('scroll', windowListener);
	$(window).resize(function () {
		windowListener();
	});
	windowListener();

	/* End of scroll-effect.js */

	/**
  * nav.js
  *
  * Auto-configures and adds main navigation menu content per page according to data read from nav.json, which is pre-ordered and split into mobile items first, desktop-only items last. Relies on retrieval of nav.main.menu item from scroll-effect.js.
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since July 23, 2017
  * @version   1.0.0
  */

	// Variable for storing all of the navigation items retrieved from json
	var navData = void 0;
	// Identify the name of the current page, given by the first class assigned to the nav menu (nav.main.menu)
	var $currPage = $nav.attr('class').split(' ')[0];

	$.when(getNavs()).then(function () {
		setTimeout(function () {
			addNavs();
		}, 400);
	});

	function getNavs() {
		$.getJSON('/js/nav.json', function (data) {
			navData = data;
		});
	}

	function addNavs() {
		// Variable to hold string of content to fill nav menu
		var navContent = "<ul>\n";
		// Boolean to track where the break between mobile and desktop-only items is
		var stillOnMobile = true;
		$(navData.pages).each(function () {
			var curr = $(this)[0];
			// Add components of nav menu item
			// If stillOnMobile but curr is desktop-only
			if (stillOnMobile && !curr.mobile) {
				// Remember that all succeeding items are not mobile
				stillOnMobile = false;
				// Add "more" button
				navContent += "<a class='hamburger'><img class='nav icon' src='../img/more-256.png' /><li>More</li></a>\n";
			}
			// Variable to hold current item's content string
			var output = "<a class='";
			// Check if current nav item corresponds to current page
			var isCurrentPage = curr.name.toLowerCase() === $currPage;
			output += isCurrentPage ? "current " : "";
			// If current nav item is desktop-only
			output += curr.mobile ? "" : "desktop only";
			// Add link unless nav item is current page
			output += isCurrentPage ? "'>" : "' href='.." + curr.link + "'>";
			// Make sure only mobile items have nav icons
			if (curr.mobile && curr.icon === "") {
				console.log("Warning: " + curr.name + " navigation item is marked to display on mobile navigation menu but has no icon specified.");
			} else if (!curr.mobile && curr.icon !== "") {
				console.log("Warning: " + curr.name + " navigation item is marked to display on desktop navigation menu only but has an icon specified.");
			}
			// If nav item has an icon
			if (curr.icon !== "") {
				output += "<img class='nav icon' src='../img/" + curr.icon;
				// If nav item is current page, use turquoise icon variant
				output += isCurrentPage ? "-turquoise" : "";
				output += ".png' />";
			}
			output += "<li>" + curr.name;
			// Add border element if nav item is current page
			output += isCurrentPage ? "<span class='border'></span>" : "";
			output += "</li></a>\n";
			// Add nav item content string to full nav menu string
			navContent += output;
		});
		// Complete nav menu
		navContent += "</ul>\n";
		// Add completed navigation menu
		$('nav.main.menu').html(navContent);
	}

	/**
  * countdown.js
  *
  * Performs computation for and visually updates the CUWiP countdown timer
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since July 13, 2017
  * @version   1.0.1
  */

	// Find countdown object if it exists
	var $countdown = $('.countdown');

	// If countdown object exists
	if ($countdown) {
		// Set date/time of event in this format
		var startOfCUWiP = '12 January 2018 18:00:00';
		// Turn off to remove zero-leading for single digit values
		var formatSwitch = 'on';

		var countdown = function countdown(t) {
			//let getFutureFormattedDate();
			// Compute seconds from since midnight January 1st 1970 to event time
			var eventTime = Date.parse(t.date) / 1e3;
			// Compute seconds from since midnight January 1st 1970 to current time
			var currentTime = Math.floor(new Date().getTime() / 1e3);

			// If event has arrived
			if (eventTime <= currentTime) {
				// (End behavior)
				console.log('event has arrived!');
			} else {
				// Compute seconds between now and event time
				var seconds = eventTime - currentTime;
				var days = Math.floor(seconds / 86400);
				seconds -= days * 60 * 60 * 24;
				var hours = Math.floor(seconds / 3600);
				seconds -= hours * 60 * 60;
				var minutes = Math.floor(seconds / 60);
				seconds -= minutes * 60;

				// If formatting is on, utilize at least two digits for every countdown value, adding a leading zero if the computed value is only one digit
				if (t.format === 'on') {
					days = String(days).length >= 2 ? days : '0' + days;
					hours = String(hours).length >= 2 ? hours : '0' + hours;
					minutes = String(minutes).length >= 2 ? minutes : '0' + minutes;
					seconds = String(seconds).length >= 2 ? seconds : '0' + seconds;
				}

				// Fill countdown blocks with computed and formatted values
				$countdown.find('.number.of.days').text(days);
				$countdown.find('.number.of.hours').text(hours);
				$countdown.find('.number.of.minutes').text(minutes);
				$countdown.find('.number.of.seconds').text(seconds);
			}
		};

		// Call initial setting of countdown
		countdown({
			date: startOfCUWiP,
			format: formatSwitch
		});

		// Call countdown setter every 1/10 of a second
		window.setInterval(function () {
			countdown({
				date: startOfCUWiP,
				format: formatSwitch
			});
		}, 100);
	}

	/* End of countdown.js */
})();