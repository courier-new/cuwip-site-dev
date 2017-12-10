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
let $countdown = $('.countdown');

// If countdown object exists
if ($countdown.length) {
	// Turn off to remove zero-leading for single digit values
	let formatSwitch = 'on';

	let countdown = function(t) {
		// Parse event time
		let eventTime = Date.parse(t.date);
		// Get current time, unless test date is specified
		let currentTime = testDate ? testDate : new Date();

		let days, hours, minutes, seconds;

		// If event has arrived
		if (eventTime <= currentTime) {
			// End behavior
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			// Compute seconds between now and event time
			seconds = Math.floor((eventTime - currentTime) / 1e3);
			days = Math.floor(seconds / 86400);
			seconds -= days * 60 * 60 * 24;
			hours = Math.floor(seconds / 3600);
			seconds -= hours * 60 * 60;
			minutes = Math.floor(seconds / 60);
			seconds -= minutes * 60;

			// If formatting is on, utilize at least two digits for every countdown value, adding a leading zero if the computed value is only one digit
			if(t.format === 'on'){
				days = String(days).length >= 2 ? days : '0' + days;
				hours = String(hours).length >= 2 ? hours : '0' + hours;
				minutes = String(minutes).length >= 2 ? minutes : '0' + minutes;
				seconds = String(seconds).length >= 2 ? seconds : '0' + seconds;
			}
		}

		// Fill countdown blocks with computed and formatted values
		$countdown.find('.number.of.days').text(days);
		$countdown.find('.number.of.hours').text(hours);
		$countdown.find('.number.of.minutes').text(minutes);
		$countdown.find('.number.of.seconds').text(seconds);
	};

	// Call initial setting of countdown
	countdown({
		date: startOfCUWiP,
		format: formatSwitch
	});

	// Call countdown setter every 1/10 of a second
	window.setInterval(function() {
		countdown({
			date: startOfCUWiP,
			format: formatSwitch
		});
	}, 100);
}

/* End of countdown.js */
