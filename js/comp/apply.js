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
let appData = {infoblocks: Array(0)};

$.getJSON('/js/comp/apply.min.json', function(data) {
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
	let endTime = Date.parse(t) / 1e3;
	// Compute seconds from since midnight January 1st 1970 to current time, unless test date is specified
	let currentTime = (testDate) ? testDate : Math.floor(new Date().getTime() / 1e3);
	// Compute seconds between now and event time
	let seconds, result;
	seconds = result = endTime - currentTime;
	if (readable) {
		let days = Math.floor(seconds / 86400);
		if (days >= 2) {
			result = days + " days";
		} else {
			let hours = Math.floor(seconds / 3600);
			seconds -= hours * 60 * 60;
			let minutes = Math.floor(seconds / 60);
			result  = hours == 1 ? hours + " hour" : hours + " hours";
			result += " and ";
			result += minutes == 1 ? minutes + " minute" : minutes + " minutes";
		}
	}
	return result;
}

function addAppInfo() {
	if (!appData.infoblocks.length) {
		setTimeout(function() {
			console.log('trying again');
			addAppInfo();
		}, 50);
	} else {
		// Array to hold elements with dynamic content
		let elements = [];
		// Set stage to correspond to time period:
		// Bad value                              | -100
		// Before application opens               |   -1
		// During application period              |    0
		// After application, before registration |    1
		// During registration period             |    2
		// After registration                     |    3
		// After travel reimbursement form due    |    4
		// (-1) If current time is before application opens
		stage = (getTimeUntil(applyOpen) > 0) ? -1 : stage;
		// (0) If current time is after application opens and before application closes = during application period
		stage = (getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0) ? 0 : stage;
		// (1) If current time is after application closes and before registration opens
		stage = (getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0) ? 1 : stage;
		// (2) If current time is after registration opens and before registration closes = during registration period
		stage = (getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0) ? 2 : stage;
		// (3) If current time is after registration closes and before conference weekend
		stage = (getTimeUntil(registerClose) < 0 && getTimeUntil(startOfCUWiP) > 0) ? 3 : stage;
		// (4) If current time is after conference weekend and before travel reimbursement form is due
		stage = (getTimeUntil(startOfCUWiP) < 0 && getTimeUntil(travelClose) > 0) ? 4 : stage;

	   $(appData.infoblocks).each(function() {
	      let curr = $(this)[0];
			// Variable to remember appropriate section of time data
			let mes;
			// Use current stage value to identify appropriate section
			switch(stage) {
				case -1: // Before application opens
					mes = curr.before;
					break;
				case 0: // During application period
					mes = curr.applyPeriod;
					break;
				case 1: // After application, before registration
					mes = curr.reviewPeriod;
					break;
				case 2: // During registration period
					mes = curr.registerPeriod;
					break;
				case 3: // After registration closes
					mes = curr.after;
					break;
				case 4: // After travel reimbursement form due
					mes = curr.after;
					break;
				default: // Bad date calculation
					console.log("bad date");
					// Default to before block
					mes = curr.before;
			}
			// For general application and postre alert messages
			if (curr.dataPlace.includes('alert')) {
				// Form class name from dataPlace by splitting at spaces and adding dots before each
				let className = "";
				$(curr.dataPlace.split(" ")).each(function() {
					className += "." + this;
				});
				// Identify alert box
				let $alertBox = $(className + '.message');
				elements.push($alertBox);
				// If alert box configured for application info exists
				if ($alertBox.length && $alertBox.hasClass(curr.dataPlace) && $alertBox.data("place") === 'app-info') {
					// Variable to hold alert message content
					let output = "<strong>";
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
				let className = "";
				$(curr.dataPlace.split(" ")).each(function() {
					className += "." + this;
				});
				// Identify closing message location based on className
				let $mesLoc = $(className);
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
			$(elements).each(function() {
				$(this).addClass('highlight');
			});
		} else {
			// Remove highlighting on elements
			$(elements).each(function() {
				$(this).removeClass('highlight');
			});
		}
	}
}

/* End of apply.js */
