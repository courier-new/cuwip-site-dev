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
let appData;

$.getJSON('/js/apply.json', function(data) {
   appData = data;
	addAppInfo();
	windowListener();
});

function getTimeUntil(t, readable) {
	readable = readable || false;
	// Compute seconds from since midnight January 1st 1970 to input time
	let endTime = Date.parse(t) / 1e3;
	// Compute seconds from since midnight January 1st 1970 to current time
	let currentTime = Math.floor(new Date().getTime() / 1e3);
	// Test other dates here
	// currentTime = Date.parse("10-12-2017 23:00:00") / 1e3;
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
	   $(appData.infoblocks).each(function() {
	      let curr = $(this)[0];
			// For alert message
			if (curr.dataPlace === 'alert') {
				// Identify alert box
				let $alertBox = $('.alert.message');
				// If alert box configured for application info exists
				if ($alertBox.length && $alertBox.data("place") === 'app-info') {
					// Variable to hold alert message content
					let output = "<strong>";
					// Variable to remember appropriate section of time data
					let mes = "";
					// If current time is before application opens
					mes = getTimeUntil(applyOpen) > 0 ? curr.before : mes;
					// If current time is after application opens and before application closes
					mes = (getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0) ? curr.applyPeriod : mes;
					// If current time is after application closes and before registration opens
					mes = (getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0) ? curr.reviewPeriod : mes;
					// If current time is after registration opens and before registration closes
				 	mes = (getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0) ? curr.registerPeriod : mes;
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
				let $mesLoc = $('.closing');
				// If message box configured for application info exists
				if ($mesLoc.length && $mesLoc.data("place") === 'app-info') {
					// Variable to hold alert message content
					let output = "";
					// If current time is before application opens
					output = getTimeUntil(applyOpen) > 0 ? curr.before.text : output;
					// If current time is after application opens and before application closes
					output = (getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0) ? curr.applyPeriod.text : output;
					// If current time is after application closes and before registration opens
					output = (getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0) ? curr.reviewPeriod.text : output;
					// If current time is after registration opens and before registration closes
				 	output = (getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0) ? curr.registerPeriod.text : output;
					// If current time is after registration closes
					output = getTimeUntil(registerClose) < 0 ? curr.after.text : output;
					$mesLoc.html(output);
				}
			}
			// For about application message
			if (curr.dataPlace === 'about') {
				// Identify about application message location
				let $mesLoc = $('.about.app');
				// If message box configured for application info exists
				if ($mesLoc.length && $mesLoc.data("place") === 'app-info') {
					// Variable to hold alert message content
					let output = "";
					// If current time is before application opens
					output = getTimeUntil(applyOpen) > 0 ? curr.before.text : output;
					// If current time is after application opens and before application closes
					output = (getTimeUntil(applyOpen) < 0 && getTimeUntil(applyClose) > 0) ? curr.applyPeriod.text : output;
					// If current time is after application closes and before registration opens
					output = (getTimeUntil(applyClose) < 0 && getTimeUntil(registerOpen) > 0) ? curr.reviewPeriod.text : output;
					// If current time is after registration opens and before registration closes
				 	output = (getTimeUntil(registerOpen) < 0 && getTimeUntil(registerClose) > 0) ? curr.registerPeriod.text : output;
					// If current time is after registration closes
					output = getTimeUntil(registerClose) < 0 ? curr.after.text : output;
					$mesLoc.html(output);
				}
			}
	   });
	}
}

/* End of apply.js */
