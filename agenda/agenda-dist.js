(function() {
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

// Variable for storing all of the program data retrieved from json
var progData = { schedule: Array(0) };

// Array for storing all the different event types for creating legend
var eventTypes = [];

$.getJSON('agenda.min.json', function (data) {
	progData = data;
	addAgenda();
});

var addAgenda = function addAgenda() {
	var output = "";
	if (!progData.schedule.length) {
		setTimeout(function () {
			console.log('trying to fetch agenda again');
			addAgenda();
		}, 200);
	} else {
		// For each day of the schedule
		$(progData.schedule).each(function () {
			// Save current day data
			var $c = $(this)[0];
			// Begin parsing data with date title
			var currOutput = "<h1>" + $c.day + "</h1>\n";
			currOutput += "<span class='campus reference'>" + $c.college + "</span>\n<div class='day table'>\n";
			$($c.events).each(function () {
				// Save current event
				var $e = $(this)[0];
				// Add individual event item
				currOutput += "<div class='event " + $e.sname + "'>\n";
				// Add event type designations
				currOutput += "<div class='type bubbles'>\n";
				$($e.types).each(function () {
					// If event type is not yet part of array
					if (!eventTypes.includes(this)) {
						// Add it
						eventTypes.push(this);
					}
					currOutput += "<span class='" + this + "'></span>\n";
				});
				currOutput += "</div>\n<div class='info'>";
				// Add event name
				currOutput += "<span class='name " + $e.sname + "'>" + $e.name;
				// Mark if event is Optional
				currOutput += !$e.required ? " <span class='optional'>(Optional)</span>" : "";
				currOutput += "</span>\n";
				// Add event time
				currOutput += "<span class='time " + $e.sname + "'>" + $e.timeStart + " - " + $e.timeEnd + "</span>";
				// Add event location
				currOutput += "<span class='place " + $e.sname + "'>" + $e.place + "</span>";
				currOutput += "</div>\n";
				// Add desc/options element, if event is talk or parallel session
				currOutput += $e.types.includes("talk") ? addTalkDesc($e) : "";
				currOutput += $e.types.includes("breakout") ? addBreakoutOptions($e) : "";
				currOutput += "</div>\n";
			});
			currOutput += "</div>\n";
			// Add separator unless last day
			currOutput += progData.schedule.indexOf($c) !== progData.schedule.length - 1 ? "<div class='separator'></div>" : "";
			output += currOutput;
		});
		// Fill agenda
		$('.agenda.spread').html(output);

		var legend = "";
		eventTypes.sort();
		// For each type of event
		$(eventTypes).each(function () {
			// Get event proper name
			var pn = this;
			if (this == "breakout") {
				pn = "Breakout Session";
			} else if (this == "free") {
				pn = "Free Time";
			} else if (this == "misc") {
				pn = "Misc/Special";
			} else if (this == "shuttle") {
				pn = "Shuttle Run";
			} else {
				pn = pn.charAt(0).toUpperCase() + pn.slice(1);
			}
			legend += "<div><span class='" + this + "'></span>" + pn + "</div>\n";
		});
		$('.event.types.legend').html(legend);
	}
};

var addTalkDesc = function addTalkDesc(e) {
	var output = "";
	if (!e.speaker || e.speaker === "TBD" || e.debugHide) {
		return output;
	} else {
		output += "<div class='about " + e.types[0] + "'>\n<div class='desc'>\n";
		output += "<h2>" + e.speaker + " <em>" + e.speakerHome + "</em></h2>\n";
		output += "<div class='lil-img'><img src='../img/" + e.speakerImg + "'></div>\n";
		output += "<p>" + e.shortDesc + " Visit her <a target='_blank' href='" + e.speakerPage.URL + "'>" + e.speakerPage.type + "</a> to learn more.</p>\n";
		output += "</div>\n<div class='big-img'><img src='../img/" + e.speakerImg + "'></div>\n</div>\n";
		return output;
	}
};

var addBreakoutOptions = function addBreakoutOptions(e) {
	var output = "";
	if (!e.options || e.options.length === 0 || e.debugHide) {
		return output;
	} else {
		output += "<div class='about " + e.types[0] + "'>\n<ul>\n";
		for (var i = 0; i < e.options.length; i++) {
			var optID = e.options[i];
			// Locate breakout option by its ID
			var option = progData.breakouts[optID];
			output += "<li>" + option.name;
			// If breakout session as special property
			if (option.hasOwnProperty("special")) {
				output += "<span";
				// If breakout session is labeled as only occurring once
				output += option.special.toLowerCase().includes("once") ? " class='once'>" : ">";
				output += option.special + "</span>";
			}
			output += "</li>\n";
		}
		output += "</ul>\n</div>\n";
		return output;
	}
};

// Clicking on agenda event type bubble
$('.agenda.spread').on('click', '.type.bubbles span', function () {
	if ($(window).width() <= 700) {
		if ($(this).hasClass('focused')) {
			$(this).removeClass('focused');
		} else {
			$(this).addClass('focused');
		}
	}
});

// On click anywhere outside event type bubble on mobile, close bubble
$('html').click(function (e) {
	if (!$(e.target).parents('.type.bubbles').length && $(window).width() <= 700) {
		$('.type.bubbles span').removeClass('focused');
	}
});

/* End of agenda.js */
})();
//# sourceMappingURL=agenda-dist.js.map
