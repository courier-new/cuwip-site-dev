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

	// Remember the height of main navigation menu
	var navHeight = 0;

	/* End of global variables*/

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
	var $parallax = $('.page.parallax');
	// Remember y-location of non-sticky menu down the page, i.e. bottom of parallax page element (if such element exists)
	var $menuLocation = 0;
	if ($parallax.length) {
		$menuLocation = $parallax.offset().top + $parallax.outerHeight();
	}
	// Remember initial y-location of non-sticky sub nav menu, in case of page with subsections
	var $submenuLocation = 0;

	// Main window scrolling and resizing actions
	var windowListener = function windowListener() {
		if (!appData.infoblocks.length) {
			setTimeout(function () {
				addAppInfo();
			}, 50);
		} else {
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

			// If page has subsections
			if ($subsections.length) {
				// For each subsection
				$subsections.each(function () {
					// Remember the top of that subsection, minus the height of the main nav menu
					var secTop = $(this).offset().top - navHeight;
					// If the current scroll position rests within this subsection
					if ($scrollY >= secTop && $scrollY < secTop + $(this).outerHeight() + 10) {
						// Mark subsection as focused
						if (!$(this).hasClass('focused')) {
							$(this).addClass('focused');
						}
						// Mark corresponding sub menu item as current
						var $menuItem = $('.sub.menu').find('a.' + $(this).attr('class').split(' ')[0]);
						if (!$menuItem.hasClass('current')) {
							$menuItem.addClass('current');
						}
					} else if ($(this).hasClass('focused')) {
						// Otherwise if section is marked as focused but current scroll position does not rest within it
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
	$('body, window').on('click', 'a[href*="#"]', function (event) {
		// Only apply to same-page hash links
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			// Figure out element to scroll to
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			// Does a scroll target exist?
			if (target.length) {
				event.preventDefault();
				// Set scroll amount to target location minus buffer
				var $scrollAmount = target.offset().top - 20;
				// If nav menu is in sticky form (at top of screen), subtract nav menu height
				$scrollAmount -= $('.main.menu').is('.sticky') ? $('.main.menu').outerHeight() : 0; //
				$('html, body').animate({
					scrollTop: $scrollAmount
				}, 1000, function () {
					// Change focus
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) {
						// Checking if the target was focused
						return false;
					} else {
						$target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
						$target.focus(); // Set focus again
					};
				});
			}
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
  * @version   1.1.0
  */

	// Variable for storing all of the navigation items retrieved from json
	var navData = { pages: Array(0) };

	$.getJSON('/js/nav.json', function (data) {
		navData = data;
		addNavs();
	});

	function addNavs() {
		if (!navData.pages.length) {
			setTimeout(function () {
				addNavs();
			}, 50);
		} else {
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
			navHeight = $('nav.main.menu').outerHeight();
			setLastSubsectionHeight();
		}
	}

	// Add extra padding to last subsection to allow full scroll through it
	var setLastSubsectionHeight = function setLastSubsectionHeight() {
		// If page contains subsections and page is not mobile
		if ($subsections.length && $(window).width() > 1000) {
			// Get last subsection
			var last = $subsections[$subsections.length - 1];
			var $last = $(last);
			// Get readable section of window
			var $windowSpace = $(window).outerHeight() - navHeight - $('.footer').outerHeight();
			// If last subsection is shorter than readable window
			if ($last.outerHeight() < $windowSpace) {
				// Make up the difference in padding
				$last.css('padding-bottom', $windowSpace - $last.outerHeight());
			}
		}
	};

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

	// If page contains subsections
	if ($subsections.length) {
		// Fill subsection nav menu
		var $menuOutput = "<div class='inner'>\n<strong>Quick Navigation</strong>\n<ul>\n";
		$subsections.each(function () {
			// Get name of subsection
			var $name = $(this).find('h1')[0].innerHTML;
			// Condense to short name of subsection
			var $sname = $name.replace(/ /g, "").toLowerCase();
			$menuOutput += "<a href='#" + $sname + "' class='" + $sname + "'><li><span class='border'></span>" + $name + "</li></a>\n";
		});
		$menuOutput += "</ul>\n</div>\n";
		$('nav.sub.menu').html($menuOutput);
	}

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
  * @version   1.0.2
  */

	// Variable for storing all of the application information pieces retrieved from json
	var appData = { infoblocks: Array(0) };

	$.getJSON('/js/apply.json', function (data) {
		appData = data;
		addAppInfo();
		// If there is a submenu, set initial submenuLocation
		if ($('.sub.menu').length) {
			$submenuLocation = $('.sub.menu').offset().top - parseFloat($('.sub.menu').css('padding-top'));
		}
		windowListener();
	});

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
		if (!appData.infoblocks.length) {
			setTimeout(function () {
				console.log('trying again');
				addAppInfo();
			}, 50);
		} else {
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
				// For poster message
				if (curr.dataPlace === 'posters') {
					// Identify posters alert box
					var _$alertBox = $('.alert.message');
					// If alert box configured for poster info exists
					if (_$alertBox.length && _$alertBox.data("place") === 'poster-info') {
						// Variable to hold alert message content
						var _output3 = "<strong>";
						// Variable to remember appropriate section of time data
						var _mes = "";
						// If current time is before application opens
						_mes = getTimeUntil(applyOpen) > 0 ? curr.before : _mes;
						// If current time is after application opens and before application closes
						_mes = getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0 ? curr.applyPeriod : _mes;
						// If current time is after application closes and before registration opens
						_mes = getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0 ? curr.reviewPeriod : _mes;
						// If current time is after registration opens and before registration closes
						_mes = getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0 ? curr.registerPeriod : _mes;
						// If current time is after registration closes
						_mes = getTimeUntil(registerClose) < 0 ? curr.after : _mes;
						_output3 += _mes.header + "</strong>\n";
						_output3 += "<p>\n" + _mes.text + "\n</p>\n";
						_$alertBox.html(_output3);
					}
				}
			});
		}
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