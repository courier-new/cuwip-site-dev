/**
 * timeline.js
 *
 * Fills and formats a timeline of conference-related events from application to travel reimbursement form, according to global.js array events
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since August 16, 2017
 * @version   1.0.0
 */

Date.prototype.getMonthName = function() {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.getMonth()];
};

Date.prototype.getMonthSName = function() {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[this.getMonth()];
};

let highlightCurrentPeriod = function() {
	if ($('.page.timeline').length) {
		if (!appData.infoblocks.length) {
			setTimeout(function() {
				console.log('trying again');
				highlightCurrentPeriod();
			}, 50);
		} else {
			// Find list item
			let listItem = stage + 2;
			$('.page.timeline li').each(function() {
				$(this).removeClass('current');
			});
			$('.page.timeline li:nth-child(' + listItem + ')').addClass('current');
		}
	}
};

if ($('.page.timeline').length) {
	// Variable to hold content
	let output = "";
	for (let e in events) {
		let date = new Date(events[e]);
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
