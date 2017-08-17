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
// @prepros-append timeline.js
// @prepros-append device.js
// @prepros-append test-date.js
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
	var startOfCUWiP = '12 January 2018 18:00:00 PDT';
	var travelClose = '21 January 2018 23:59:00 PST';

	// Store events Array
	var events = {
		"Application Opens": applyOpen,
		"Application Closes": applyClose,
		"Applicant Status Announced": registerOpen,
		"Registration Closes": registerClose,
		"Conference Weekend": startOfCUWiP,
		"Travel Reimbursement Form Due": travelClose
	};

	// Variable for holding test date
	var testDate = void 0;

	// Variable to record current stage of application process
	// Key:
	// Bad value                              | -100
	// Before application opens               |   -1
	// During application period              |    0
	// After application, before registration |    1
	// During registration period             |    2
	// After registration                     |    3
	// After travel reimbursement form due    |    4
	var stage = -100;

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
  * @version   1.1.0
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
		// Compute seconds from since midnight January 1st 1970 to current time, unless test date is specified
		var currentTime = testDate ? testDate : Math.floor(new Date().getTime() / 1e3);
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
			// Array to hold elements with dynamic content
			var elements = [];
			// Set stage to correspond to time period:
			// Bad value                              | -100
			// Before application opens               |   -1
			// During application period              |    0
			// After application, before registration |    1
			// During registration period             |    2
			// After registration                     |    3
			// After travel reimbursement form due    |    4
			// (-1) If current time is before application opens
			stage = getTimeUntil(applyOpen) > 0 ? -1 : stage;
			// (0) If current time is after application opens and before application closes = during application period
			stage = getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0 ? 0 : stage;
			// (1) If current time is after application closes and before registration opens
			stage = getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0 ? 1 : stage;
			// (2) If current time is after registration opens and before registration closes = during registration period
			stage = getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0 ? 2 : stage;
			// (3) If current time is after registration closes and before conference weekend
			stage = getTimeUntil(registerClose) < 0 && getTimeUntil(startOfCUWiP) > 0 ? 3 : stage;
			// (4) If current time is after conference weekend and before travel reimbursement form is due
			stage = getTimeUntil(startOfCUWiP) < 0 && getTimeUntil(travelClose) > 0 ? 4 : stage;

			$(appData.infoblocks).each(function () {
				var curr = $(this)[0];
				// Variable to remember appropriate section of time data
				var mes = void 0;
				// Use current stage value to identify appropriate section
				switch (stage) {
					case -1:
						// Before application opens
						mes = curr.before;
						break;
					case 0:
						// During application period
						mes = curr.applyPeriod;
						break;
					case 1:
						// After application, before registration
						mes = curr.reviewPeriod;
						break;
					case 2:
						// During registration period
						mes = curr.registerPeriod;
						break;
					case 3:
						// After registration closes
						mes = curr.after;
						break;
					case 4:
						// After travel reimbursement form due
						mes = curr.after;
						break;
					default:
						// Bad date calculation
						console.log("bad date");
						// Default to before block
						mes = curr.before;
				}
				// For general application and postre alert messages
				if (curr.dataPlace === 'alert' || curr.dataPlace === 'posters') {
					// Identify alert box
					var $alertBox = $('.alert.message');
					elements.push($alertBox);
					// If alert box configured for application info exists
					if ($alertBox.length && $alertBox.hasClass(curr.dataPlace) && $alertBox.data("place") === 'app-info') {
						// Variable to hold alert message content
						var output = "<strong>";
						output += mes.header + "</strong>\n";
						output += "<p>\n" + mes.text + "\n</p>\n";
						$alertBox.html(output);
						// If current time is after application opens and before application closes
						if (stage == 0) {
							// Set up application deadline countdown
							$('.time.until.close').html(getTimeUntil(applyClose, true));
						}
					}
				}
				// For closing message (index.html, after countdown) and about application message (/apply, "What do I do now?")
				if (curr.dataPlace === 'closing' || curr.dataPlace === 'about app') {
					// Form class name from dataPlace by splitting at spaces and adding dots before each
					var className = "";
					$(curr.dataPlace.split(" ")).each(function () {
						className += "." + this;
					});
					// Identify closing message location based on className
					var $mesLoc = $(className);
					elements.push($mesLoc);
					// If message box configured for application info exists
					if ($mesLoc.length && $mesLoc.data("place") === 'app-info') {
						// Fill in appropriate text
						$mesLoc.html(mes.text);
					}
				}
			});
			// If test date was used
			if (testDate) {
				// Print it
				console.log("test date used: " + testDate);
				// Highlight elements that have been changed
				$(elements).each(function () {
					$(this).addClass('highlight');
				});
			} else {
				// Remove highlighting on elements
				$(elements).each(function () {
					$(this).removeClass('highlight');
				});
			}
		}
	}

	/* End of apply.js */

	/**
  * timeline.js
  *
  * Fills and formats a timeline of conference-related events from application to travel reimbursement form, according to global.js array events
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since August 16, 2017
  * @version   1.0.0
  */

	Date.prototype.getMonthName = function () {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[this.getMonth()];
	};

	Date.prototype.getMonthSName = function () {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return months[this.getMonth()];
	};

	var highlightCurrentPeriod = function highlightCurrentPeriod() {
		if ($('.page.timeline').length) {
			if (!appData.infoblocks.length) {
				setTimeout(function () {
					console.log('trying again');
					highlightCurrentPeriod();
				}, 50);
			} else {
				// Find list item
				var listItem = stage + 2;
				$('.page.timeline li').each(function () {
					$(this).removeClass('current');
				});
				$('.page.timeline li:nth-child(' + listItem + ')').addClass('current');
			}
		}
	};

	if ($('.page.timeline').length) {
		// Variable to hold content
		var output = "";
		for (var e in events) {
			var date = new Date(events[e]);
			output += "<li>\n<div class='desc'>\n";
			if (e == "Application Opens") {
				output += "<span class='date'>Sep 1</span>\n";
				output += "<span class='event'>" + e + "</span>\n";
			} else {
				output += "<span class='date'>" + date.getMonthSName() + " " + date.getDate() + "</span>\n";
				output += "<span class='event'>" + e + "</span>\n";
			}
			output += "</div>\n<div class='circle'></div>\n</li>";
		}
		$('.page.timeline ul').html(output);
		highlightCurrentPeriod();
	}

	/* End of timeline.js */

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

	/**
  * test-date.js
  *
  * Allows input of a custom date for testing period-sensitive content
  *
  * @author    Kelli Rockwell <kellirockwell@mail.com>
  * @since     File available since August 16, 2017
  * @version   1.0.0
  */

	// Add a button to open test date module on double click of footer
	$('.page.footer').on('dblclick', function () {
		// If window is not mobile size
		if ($(window).width() > 700) {
			if (!$('.test.date.trigger').length) {
				var trigger = "<div class='test date trigger' style='background: rgba(255, 255, 255, 0.1); position: absolute; bottom: 0; right: 0; width: 100px; height: 50px; z-index: 200;'></div>";
				$(this).prepend(trigger);
			} else {
				$('.test.date.trigger').remove();
			}
		}
	});

	// Add test date changing module on click of button
	$('.page.footer').on('click', '.test.date.trigger', function () {
		if (!$('.test.date.module').length) {
			console.log('opening test date module');
			var module = "<div class='module container'>\n<div class='test date module'>\n<div class='text'>\n";
			module += "<div class='input bar'><input type='text'></input><div class='go button'>Try</div><div class='reset button'>Reset</div></div>\n";
			module += "<div class='instruction'>Recommended input format is<strong>17 November 2017 23:59:00 PST</strong></div>\n</div>\n</div>\n</div>";
			$('body').prepend(module);
			$('.test.date.module input').focus();
		} else {
			console.log('closing test date module');
			$('.module.container').remove();
		}
	});

	// Apply new test date on click of go button
	$('body').on('click', '.test.date.module .go.button', function () {
		// Try to parse date
		var input = Date.parse($('.test.date.module input').val()) / 1e3;
		if (!input) {
			console.log('could not parse date from input');
		}
		// Set date and reload content
		testDate = input;
		addAppInfo();
		highlightCurrentPeriod();
	});

	// Reset to current date on click of reset button
	$('body').on('click', '.test.date.module .reset.button', function () {
		// Reset date and reload content
		testDate = null;
		addAppInfo();
		highlightCurrentPeriod();
	});

	// Close test date changing module on click of anywhere outside of it
	$('body').on('click', '.module.container', function (e) {
		e = e || window.event;
		// If module is present and click is not on it
		if ($('.test.date.module').length && !$(e.target).closest('.test.date.module').length) {
			console.log('closing test date module');
			$('.module.container').remove();
		}
	});

	// Close test date changing module on press of escape button
	document.onkeydown = function (e) {
		e = e || window.event;
		// Boolean for remembering if key pressed is escape
		var isEscape = false;
		// Boolean for remembering if key pressed is enter
		var isEnter = false;
		if ("key" in e) {
			// Newer browsers
			isEscape = e.key == "Escape" || e.key == "Esc";
			isEnter = e.key == "Enter";
		} else {
			// Older browsers
			isEscape = e.keyCode == 27;
			isEnter = e.keyCode == 13;
		}
		// If module is present and keypress of escape
		if ($('.test.date.module').length && isEscape) {
			console.log('closing test date module');
			$('.module.container').remove();
		}
		// If module is present and keypress of enter
		if ($('.test.date.module').length && isEnter) {
			// Try to parse date
			var input = Date.parse($('.test.date.module input').val()) / 1e3;
			if (!input) {
				console.log('could not parse date from input');
			}
			// Set date and reload content
			testDate = input;
			addAppInfo();
			highlightCurrentPeriod();
		}
	};

	/* End of test-date.js */
})();