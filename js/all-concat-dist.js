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
// @prepros-append global.js
// @prepros-append scroll-effect.js
// @prepros-append nav.js
// @prepros-append countdown.js
// @prepros-append apply.js
// @prepros-append device.js
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

	/* Global variables */

	// Set date/time of application-related dates in this format
	var applyOpen = '1 September 2017 00:00:00 EDT';
	var applyClose = '13 October 2017 23:59:00 EDT';
	var registerOpen = '6 November 2017 00:00:00 PST';
	var registerClose = '17 November 2017 23:59:00 PST';
	// Set date/time of event in this format
	var startOfCUWiP = '12 January 2018 18:00:00 PDT';

	// Identify main navigation menu
	var $nav = $('nav.main.menu');
	// Identify footer
	var $footer = $('.page.footer');

	// Identify the name of the current page, given by the first class assigned to the nav menu (nav.main.menu)
	var $currPage = $nav.attr('class').split(' ')[0];

	// Remember each of the page sections and subsections
	var $pages = $('.page');
	var $subsections = $('.page > .inner.hiding.container > .text.block');

	/* End of global variables*/

	/**
  * scroll-effect.js
  *
  * Handles events and effects related to scrolling on the page
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since July 11, 2017
  * @version   1.2.0
  */

	// Identify parallax page
	var $parallax = $('.page.parallax');
	// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element (if such element exists)
	var $menuLocation = 0;
	if ($parallax.length) {
		$menuLocation = $parallax.offset().top + $parallax.outerHeight();
	}

	// Main window scrolling and resizing actions
	var windowListener = function windowListener() {
		var $scrollY = window.scrollY + 30;

		// If parallax element is present on page
		if ($parallax.length) {
			var scrolled = $(window).scrollTop();
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

	// Set initial height of .inner.hiding.container
	if ($subsections.length) {
		// Get current/active subsection
		var $curr = $('nav.sub.menu').find('a.current').attr('class').split(' ')[0];
		// Animate growing/shrinking of container to current subsection height or sub nav height (whichever is larger)
		var $newHeight = 0;
		if ($(window).width() > 700) {
			$newHeight = $('.' + $curr + '.text.block').height();
			var $subnavHeight = $('nav.sub.menu').height();
			$newHeight = $subnavHeight > $newHeight ? $subnavHeight : $newHeight;
		} else {
			$newHeight = $('.' + $curr + '.text.block').outerHeight();
		}
		$newHeight += 20;
		// Only if new height =/= old height
		if ($('.inner.hiding.container').height() !== $newHeight) {
			// Animate height change
			$('.inner.hiding.container').animate({ height: $newHeight }, { queue: false });
		}
	}

	// Interpret and scroll to a designated section of an .inner.hiding.container
	var scrollToSubsection = function scrollToSubsection(section, goToTop) {
		section = section.toLowerCase().replace(/\s/g, '');
		var $container = $('.inner.hiding.container');
		// Animate growing/shrinking of container to new subsection height or sub nav height (whichever is larger)
		var $newHeight = $('.' + section + '.text.block').height();
		var $subnavHeight = $('nav.sub.menu').height();
		$newHeight = $subnavHeight > $newHeight ? $subnavHeight : $newHeight;
		$newHeight += 20;
		$container.animate({ height: $newHeight }, { queue: false });
		// Scroll to container height + subsection height - subsection padding
		var $scrollAmount = $('.' + section + '.text.block').position().top + $container.scrollTop() - parseFloat($container.parent().css('padding-top'));
		// To also subtract h1 padding, replace this in calculation:
		// - parseFloat($('.page .inner > .text.block h1').css('margin-top'));
		$container.animate({ scrollTop: $scrollAmount }, { queue: false });
		if (goToTop) {
			$('html, body').animate({ scrollTop: $container.parent().offset().top }, { queue: false });
		}
		// Mark new current subsection on navigation menu
		$('nav.sub.menu a').each(function () {
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
	$('nav.sub.menu').on('click', 'a', function () {
		// Call on name of subsection clicked
		scrollToSubsection($(this).find('li')[0].innerHTML, false);
	});
	$('.forward.back.buttons, .inner.link').on('click', 'a', function () {
		// Call on name of subsection clicked
		if ($(window).width() <= 700) {
			scrollToSubsection($(this).attr('class'), true);
		} else {
			scrollToSubsection($(this).attr('class'), false);
		}
	});

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
		// Variable to hold mobile drawer of certain nav items
		var navDrawer = "<div class='drawer'><ul>\n";
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
			// Add relevant items to nav drawer string
			navDrawer += stillOnMobile ? "" : output;
		});
		// Complete nav menu
		navContent += "</ul>\n";
		// Add completed navigation menu
		$('nav.main.menu').html(navContent);
		// Complete nav drawer
		navDrawer += "</ul></div>\n";
		$('nav.menu.drawer').html(navDrawer);
	}

	// On click of hamburger, toggle display of menu drawer
	$('nav.main.menu').on('click', 'a.hamburger', function () {
		$('nav.menu.drawer').slideToggle();
	});
	// On click anywhere outside nav menus, close menu drawer if it is open
	$('html').click(function (e) {
		if (!$(e.target).parents('.menu').length) {
			$('nav.menu.drawer').slideUp();
		}
	});

	$subsections.each(function () {
		var $output = "";
		// Get previous text block
		var $prev = $(this).prev();
		// If previous text block exists
		if ($prev.length) {
			// Derive subsection short name from text block
			$prev = $prev.attr('class').split(' ')[0];
			$output += "<a class='" + $prev + "'><div class='back button " + $prev + "'>";
			// Get readable name from corresponding subsection navigation menu label
			$prev = $('nav.sub.menu').find('a.' + $prev + ' li')[0].innerHTML;
			$output += "<span class='back label'>Back</span><span class='section label'>" + $prev + "</span>";
		} else {
			$output += "<a><div class='back button none'>";
		}
		$output += "</div></a>\n";
		// Get next text block
		var $next = $(this).next();
		// If next text block exists
		if ($next.length) {
			// Derive subsection short name from text block
			$next = $next.attr('class').split(' ')[0];
			$output += "<a class='" + $next + "'><div class='next button " + $next + "'>";
			// Get readable name from corresponding subsection navigation menu label
			$next = $('nav.sub.menu').find('a.' + $next + ' li')[0].innerHTML;
			$output += "<span class='next label'>Next</span><span class='section label'>" + $next + "</span>";
		} else {
			$output += "<a><div class='next button none'>";
		}
		$output += "</div></a>\n";
		var $buttons = $(this).find('.forward.back.buttons');
		$buttons.html($output);
	});

	/* End of nav.js */

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
	if ($countdown.length) {
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

	/**
  * apply.js
  *
  * Automatically updates relevant sections with information specified in apply.json about the application process according to current time and date.
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since July 23, 2017
  * @version   1.0.0
  */

	// Variable for storing all of the application information pieces retrieved from json
	var appData = void 0;

	$.when(getAppInfo()).then(function () {
		setTimeout(function () {
			addAppInfo();
			windowListener();
		}, 400);
	});

	function getAppInfo() {
		$.getJSON('/js/apply.json', function (data) {
			appData = data;
		});
	}

	function getTimeUntil(t, readable) {
		readable = readable || false;
		// Compute seconds from since midnight January 1st 1970 to input time
		var endTime = Date.parse(t) / 1e3;
		// Compute seconds from since midnight January 1st 1970 to current time
		var currentTime = Math.floor(new Date().getTime() / 1e3);
		// Test other dates here
		// currentTime = Date.parse("10-12-2017 23:00:00") / 1e3;
		// Compute seconds between now and event time
		var seconds = void 0,
		    result = void 0;
		seconds = result = endTime - currentTime;
		if (readable) {
			var days = Math.floor(seconds / 86400);
			if (days >= 2) {
				result = days + " days";
			} else {
				var hours = Math.floor(seconds / 3600);
				seconds -= hours * 60 * 60;
				var minutes = Math.floor(seconds / 60);
				result = hours == 1 ? hours + " hour" : hours + " hours";
				result += " and ";
				result += minutes == 1 ? minutes + " minute" : minutes + " minutes";
			}
		}
		return result;
	}

	function addAppInfo() {

		$(appData.infoblocks).each(function () {
			var curr = $(this)[0];
			// For alert message
			if (curr.dataPlace === 'alert') {
				// Identify alert box
				var $alertBox = $('.alert.message');
				// If alert box configured for application info exists
				if ($alertBox.length && $alertBox.data("place") === 'app-info') {
					// Variable to hold alert message content
					var output = "<strong>";
					// Variable to remember appropriate section of time data
					var mes = "";
					// If current time is before application opens
					mes = getTimeUntil(applyOpen) > 0 ? curr.before : mes;
					// If current time is after application opens and before application closes
					mes = getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0 ? curr.applyPeriod : mes;
					// If current time is after application closes and before registration opens
					mes = getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0 ? curr.reviewPeriod : mes;
					// If current time is after registration opens and before registration closes
					mes = getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0 ? curr.registerPeriod : mes;
					// If current time is after registration closes
					mes = getTimeUntil(registerClose) < 0 ? curr.after : mes;
					output += mes.header + "</strong>\n";
					output += "<p>\n" + mes.text + "\n</p>\n";
					$alertBox.html(output);
					// If current time is after application opens and before application closes
					if (getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0) {
						// Set up application deadline countdown
						$('.time.until.close').html(getTimeUntil(applyClose, true));
					}
				}
			}
			// For closing message
			if (curr.dataPlace === 'closing') {
				// Identify closing message location
				var $mesLoc = $('.closing');
				// If message box configured for application info exists
				if ($mesLoc.length && $mesLoc.data("place") === 'app-info') {
					// Variable to hold alert message content
					var _output = "";
					// If current time is before application opens
					_output = getTimeUntil(applyOpen) > 0 ? curr.before.text : _output;
					// If current time is after application opens and before application closes
					_output = getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0 ? curr.applyPeriod.text : _output;
					// If current time is after application closes and before registration opens
					_output = getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0 ? curr.reviewPeriod.text : _output;
					// If current time is after registration opens and before registration closes
					_output = getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0 ? curr.registerPeriod.text : _output;
					// If current time is after registration closes
					_output = getTimeUntil(registerClose) < 0 ? curr.after.text : _output;
					$mesLoc.html(_output);
				}
			}
			// For about application message
			if (curr.dataPlace === 'about') {
				// Identify about application message location
				var _$mesLoc = $('.about.app');
				// If message box configured for application info exists
				if (_$mesLoc.length && _$mesLoc.data("place") === 'app-info') {
					// Variable to hold alert message content
					var _output2 = "";
					// If current time is before application opens
					_output2 = getTimeUntil(applyOpen) > 0 ? curr.before.text : _output2;
					// If current time is after application opens and before application closes
					_output2 = getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0 ? curr.applyPeriod.text : _output2;
					// If current time is after application closes and before registration opens
					_output2 = getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0 ? curr.reviewPeriod.text : _output2;
					// If current time is after registration opens and before registration closes
					_output2 = getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0 ? curr.registerPeriod.text : _output2;
					// If current time is after registration closes
					_output2 = getTimeUntil(registerClose) < 0 ? curr.after.text : _output2;
					_$mesLoc.html(_output2);
				}
			}
		});
	}

	/* End of apply.js */

	$('.device.word').each(function () {
		var word = "";
		// If mobile
		if ($(window).width() <= 700) {
			word = "tap";
		} else {
			word = "click";
		}
		if ($(this).hasClass('capitalized')) {
			word = word.charAt(0).toUpperCase() + word.slice(1);
		}
		$(this).html(word);
	});
})();