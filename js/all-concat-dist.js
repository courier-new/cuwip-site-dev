(function() {
'use strict';

/* Global variables */

// Set date/time of application-related dates in this format
var applyOpen = '1 September 2017 00:00:00 EDT',
    applyClose = '13 October 2017 23:59:00 EDT',
    registerOpen = '6 November 2017 00:00:00 PST',
    registerClose = '17 November 2017 23:59:00 PST',
    startOfCUWiP = '12 January 2018 18:00:00 PDT',
    travelClose = '21 January 2018 23:59:00 PST';

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
'use strict';

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
				}
			});
		}
	}
});

/* End of scroll-effect.js */
'use strict';

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

$.getJSON('/js/comp/nav.min.json', function (data) {
	navData = data;
	addNavs();
});

function addNavs() {
	if (!navData.pages.length) {
		setTimeout(function () {
			console.log('trying to fetch nav again');
			addNavs();
		}, 200);
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
var addSubMenu = function addSubMenu() {
	var headerText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Quick Navigation";

	if ($subsections.length) {
		// Fill subsection nav menu
		var $menuOutput = '<div class=\'inner\'>\n    \t   <strong>' + headerText + '</strong>\n           <ul>\n';
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
};
addSubMenu();

/* End of nav.js */
'use strict';

/**
 * agenda.js
 *
 * Parses program data from agenda.json and automatically populated agenda page in readable format.
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since August 10th, 2017
 * @version   1.0.0
 */

// Only on agenda page
if ($('nav.agenda').length) {

    // Variable for storing all of the program data retrieved from json
    var progData = { schedule: Array(0) };

    // Array for storing all the different event types for creating bubble legend
    var eventTypes = [];

    // Read in agenda data from json
    $.getJSON('agenda.min.json', function (data) {
        progData = data;
        addAgenda();
    });

    var addSubnav = function addSubnav() {
        $subsections = $('.page .agenda.spread > .day.block');
        if (!$subsections.length) {
            setTimeout(function () {
                addSubnav();
            }, 200);
        } else {
            addSubMenu('Jump to Day');
        }
    };

    // Function for populating the whole agenda via data read in from json
    var addAgenda = function addAgenda() {
        var agendaContent = "";
        // Wait until agenda data has been loaded
        if (!progData.schedule.length) {
            setTimeout(function () {
                addAgenda();
            }, 200);
        } else {
            // For each day of the schedule
            $(progData.schedule).each(function (i, day) {
                // Check if day is last day
                var isLast = i === progData.schedule.length - 1;
                // Add day to the agenda
                agendaContent += addDay({
                    'day': day,
                    'isLast': isLast
                });
            });
            // Fill agenda
            $('.agenda.spread').html(agendaContent);
            // Add subnavigation
            addSubnav();
            // Add events legend
            addLegend();
        }
    };

    // Adds a day to the agenda
    var addDay = function addDay(_ref) {
        var day = _ref['day'],
            isLast = _ref['isLast'];

        // Define day of week and institution of the day
        var dayCapt = day.day.charAt(0).toUpperCase() + day.day.slice(1);
        var daySection = '<div class=\'' + day.day + ' day block\'>\n            <a name=\'' + day.day + '\'></a>\n            <h1>' + dayCapt + '</h1>\n            <span class=\'campus reference\'>' + day.college + '</span>\n                <div class=\'day table\'>\n';
        // For each event in the day
        $(day.events).each(function (i, eventObj) {
            // Add event to the agenda
            daySection += addEvent(eventObj);
        });
        daySection += "<!--end day table--></div>\n";
        // Add separator except on last day
        daySection += !isLast ? "<div class='separator'></div>" : "";
        daySection += "<!--end day block--></div>\n";
        return daySection;
    };

    // Adds an event card to a day
    var addEvent = function addEvent(event) {
        // Determine if event has extra description for expandable info section
        var hasExpandable = !event.debugHide && (event.shortDesc.length || event.options);
        // Add event card
        var eventCard = '<div class=\'event ' + event.sname;
        eventCard += hasExpandable ? ' expandable\'>' : '\'>';
        // Add item name, time, place, and type designations
        eventCard += addBasicInfo(event);
        // Add expandable section with additional details for event
        eventCard += addExpandedInfo({
            'event': event,
            'isTalk': event.types.includes("talk"),
            'isBreakout': event.types.includes("breakout"),
            'shouldBeHidden': event.debugHide || false,
            'hasExpandable': hasExpandable
        });
        // Condtionally add expandable arrow indicator
        eventCard += hasExpandable ? '<div class=\'expandable arrow\'><i class="fa fa-chevron-right" aria-hidden="true"></i></div>\n' : '';
        eventCard += '<!--end event card--></div>\n';
        return eventCard;
    };

    // Adds name, time, place, and type designations for an event
    var addBasicInfo = function addBasicInfo(event) {
        // Add container for event types
        var basicInfo = '<div class=\'type bubbles\'>\n';
        $(event.types).each(function (i, eType) {
            // If event type is not yet part of legend array
            if (!eventTypes.includes(eType)) {
                // Add it
                eventTypes.push(eType);
            }
            // Mark what type of event this is with span bubble element
            basicInfo += '<span class=\'' + eType + '\'></span>\n';
        });
        basicInfo += '<!--end type bubbles--></div>\n<div class=\'info\'>';
        // Add event name
        basicInfo += '<span class=\'name ' + event.sname + '\'>' + event.name;
        // Mark if event is Optional
        basicInfo += !event.required ? ' <span class=\'optional\'>(Optional)</span>' : '';
        basicInfo += '<!--end name span--></span>\n';
        // Add event time
        basicInfo += '<span class=\'time ' + event.sname + '\'>' + event.timeStart + ' - ' + event.timeEnd + '</span>';
        // Add event location
        basicInfo += '<span class=\'place ' + event.sname + '\'>' + event.place + '</span>';
        basicInfo += '<!--end info--></div>\n';
        return basicInfo;
    };

    // Adds expandable section with additional details for an event
    var addExpandedInfo = function addExpandedInfo(_ref2) {
        var event = _ref2['event'],
            isTalk = _ref2['isTalk'],
            isBreakout = _ref2['isBreakout'],
            shouldBeHidden = _ref2['shouldBeHidden'],
            hasExpandable = _ref2['hasExpandable'];

        // If card has no expandable
        if (!hasExpandable) {
            return "";
        } else {
            // Add desc/options element, if event is talk or breakout session
            var expandedInfo = "";
            if (isTalk && !shouldBeHidden) {
                expandedInfo += addTalkDesc(event);
            } else if (isBreakout && !shouldBeHidden) {
                expandedInfo += addBreakoutOptions(event);
            } else if (!shouldBeHidden) {
                expandedInfo += '<div class=\'about ' + event.types[0] + '\'>\n<div class=\'inside grid\'>\n<div class=\'desc\'>\n';
                expandedInfo += event.shortDesc.length ? '<p>' + event.shortDesc + '</p>\n' : '<p>No details currently available for this event.</p>';
                expandedInfo += '<!--end desc--></div>\n<!--end inside grid--></div>\n<!-- end about--></div>';
            }
            return expandedInfo;
        }
    };

    var addTalkDesc = function addTalkDesc(event) {
        var component = "";
        if (!event.speaker || event.speaker === "TBD" || event.debugHide) {
            return component;
        } else {
            // Add extra info container
            component += '<div class=\'about ' + event.types[0] + '\'>\n<div class=\'inside grid\'>\n';
            // Add speaker image
            component += '<div class=\'img\'><img src=\'../img/' + event.speakerImg + '\'></div>\n';
            // Add speaker name
            component += '<div class=\'img-header\'><h2>' + event.speaker + '</h2></div>\n';
            // Add speaker home
            component += '<div class=\'img-caption\'>' + event.speakerHome + '</div>\n';
            // Add event description and link to speaker page
            component += '<div class=\'desc\'>\n<p>' + event.shortDesc + '</p>\n<p>Visit her <a target=\'_blank\' href=\'' + event.speakerPage.URL + '\'>' + event.speakerPage.type + '</a> to learn more.</p>\n</div>\n';
            component += '<!--end inside grid--></div>\n<!--end about--></div>\n';
            return component;
        }
    };

    var addBreakoutOptions = function addBreakoutOptions(event) {
        var component = "";
        if (!event.options || event.options.length === 0 || event.debugHide) {
            return component;
        } else if (event.name.match(/breakout session \d of \d/i)) {
            // Remember current breakout session number by extracting from session name (i.e. "Breakout Session 1 of 3" => 1)
            var snum = parseInt(event.name.match(/\d of \d/)[0].substr(0, 1));
            // Label container with event types
            component += "<div class='about ";
            for (var t = 0; t < event.types.length; t++) {
                component += event.types[t];
                component += t + 1 === event.types.length ? "" : " ";
            }
            component += "'>\n<div class='inside grid'>\n<ul>\n";
            for (var id in progData.breakouts) {
                // Store current breakout session data
                var s = progData.breakouts[id];
                // If breakout session is included in current session number
                if (s.sessions.includes(snum)) {
                    // Add breakout session occurrences
                    component += "<li>\n<div class='occurrences'>";
                    for (var i = 1; i < 4; i++) {
                        component += s.sessions.includes(i) ? '<span class=\'indicator true\'>' + i + '</span>' : '<span class=\'indicator false\'>' + i + '</span>';
                    }
                    // Add breakout session info
                    component += "</div>\n<div class='details'><span class='session'>" + s.name + "</span>";
                    // If breakout session has special property
                    if (s.hasOwnProperty("special")) {
                        component += "<span class='label";
                        // If breakout session is labeled as only occurring once
                        component += s.special.toLowerCase().includes("once") ? " once'>" : "'>";
                        component += s.special + "</span>";
                    }
                }
                component += "</li>\n";
            }
            component += "</ul>\n</div>\n</div>\n";
            return component;
        } else if (event.name.match(/career/i)) {
            // Label container with event types
            component += "<div class='about ";
            for (var _t = 0; _t < event.types.length; _t++) {
                component += event.types[_t];
                component += _t + 1 === event.types.length ? "" : " ";
            }
            component += "'>\n<div class='inside grid'>\n<ul>\n";
            for (var _id in progData.careerBreakouts) {
                // Store current breakout session data
                var _s = progData.careerBreakouts[_id];
                // Add breakout session info
                component += '<li>\n<div class=\'details\'><span class=\'session\'>' + _s.name + '</span>';
                component += "</li>\n";
            }
            component += "</ul>\n</div>\n</div>\n";
            return component;
        }
    };

    // Build and insert legend of event types using populated eventTypes array
    var addLegend = function addLegend() {
        var legend = "";
        // Sort event types alphabetically
        eventTypes.sort();
        // For each type of event
        $(eventTypes).each(function (i, eType) {
            // Produce proper (readable) name for event type
            var pn = eType;
            // For certain events, proper name is specially formatted
            if (eType == "breakout") {
                pn = "Breakout Session";
            } else if (eType == "free") {
                pn = "Free Time";
            } else if (eType == "misc") {
                pn = "Misc/Special";
            } else if (eType == "shuttle") {
                pn = "Shuttle Run";
            } else {
                // For all other events, just capitalize the first letter of non-proper name
                pn = pn.charAt(0).toUpperCase() + pn.slice(1);
            }
            legend += '<div><span class=\'' + eType + '\'></span>' + pn + '</div>\n';
        });
        // Fill legend
        $('.event.types.legend').html(legend);
    };

    // Clicking on agenda event type bubble
    $('.agenda.spread').on('click', '.type.bubbles span', function (e) {
        if ($(window).width() <= 700) {
            if ($(e.target).hasClass('focused')) {
                $(e.target).removeClass('focused');
            } else {
                $(e.target).addClass('focused');
            }
        }
    });

    // On click anywhere outside event type bubble on mobile, close bubble
    $('html').click(function (e) {
        if (!$(e.target).parents('.type.bubbles').length && $(window).width() <= 700) {
            $('.type.bubbles span').removeClass('focused');
        }
    });

    // Clicking agenda event will open event's details
    $('.agenda.spread').on('click', '.event', function (e) {
        var $eventItem = $(e.target).closest('.event');
        if ($eventItem.hasClass('expanded')) {
            $eventItem.removeClass('expanded');
            $eventItem.find('.about').slideUp();
        } else if ($eventItem.hasClass('expandable')) {
            $eventItem.addClass('expanded');
            $eventItem.find('.about').slideDown();
        }
    });
}

/* End of agenda.js */
'use strict';

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
'use strict';

/**
 * apply.js
 *
 * Automatically updates relevant sections with information specified in apply.json about the application process according to current time and date.
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 23, 2017
 * @version   1.1.1
 */

// Variable for storing all of the application information pieces retrieved from json
var appData = { infoblocks: Array(0) };

$.getJSON('/js/comp/apply.min.json', function (data) {
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
			if (curr.dataPlace.includes('alert')) {
				// Form class name from dataPlace by splitting at spaces and adding dots before each
				var className = "";
				$(curr.dataPlace.split(" ")).each(function () {
					className += "." + this;
				});
				// Identify alert box
				var $alertBox = $(className + '.message');
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
				var _className = "";
				$(curr.dataPlace.split(" ")).each(function () {
					_className += "." + this;
				});
				// Identify closing message location based on className
				var $mesLoc = $(_className);
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
'use strict';

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
"use strict";

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
'use strict';

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
//# sourceMappingURL=all-concat-dist.js.map
