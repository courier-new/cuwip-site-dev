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
let progData = {schedule: Array(0)};

// Array for storing all the different event types for creating bubble legend
let eventTypes = [];

// Read in agenda data from json
$.getJSON('agenda.min.json', (data) => {
   progData = data;
   addAgenda();
});

// Function for populating the whole agenda via data read in from json
const addAgenda = () => {
	let agendaContent = "";
    // Wait until agenda data has been loaded
	if (!progData.schedule.length) {
		setTimeout(() => {
			console.log('trying to fetch agenda again');
			addAgenda();
		}, 200);
	} else {
		// For each day of the schedule
		$(progData.schedule).each((i, day) => {
            // Check if day is last day
			let isLast = i === progData.schedule.length - 1;
            // Add day to the agenda
            agendaContent += addDay({
                'day': day,
                'isLast': isLast
            });
		});
		// Fill agenda
		$('.agenda.spread').html(agendaContent);
        // Add events legend
	    addLegend();
	}
};

// Adds a day to the agenda
const addDay = ({
    'day': day,
    'isLast': isLast
}) => {
    // Define day of week and institution of the day
    let daySection = `<h1>${day.day}</h1>
        <span class='campus reference'>${day.college}</span>
            <div class='day table'>\n`;
    // For each event in the day
    $(day.events).each((i, eventObj) => {
        // Add event to the agenda
        daySection += addEvent(eventObj);
    });
    daySection += "<!--end day table--></div>\n";
    // Add separator except on last day
    daySection += (!isLast) ? "<div class='separator'></div>" : "";
    return daySection;
};

// Adds an event card to a day
const addEvent = (event) => {
    // Add event card
    let eventCard = `<div class='event ${event.sname}'>`;
    // Add item name, time, place, and type designations
    eventCard += addBasicInfo(event);
    // Add expandable section with additional details for event
    eventCard += addExpandedInfo({
        'event': event,
        'isTalk': event.types.includes("talk"),
        'isBreakout': event.types.includes("breakout"),
        'shouldBeHidden': event.debugHide || false
    });
    // Add expandable arrow indicator
    eventCard += `<div class='expandable arrow'><i class="fa fa-chevron-right" aria-hidden="true"></i></div>\n`;
    eventCard += `<!--end event card--></div>\n`;
    return eventCard;
};

// Adds name, time, place, and type designations for an event
const addBasicInfo = (event) => {
    // Add container for event types
    let basicInfo = `<div class='type bubbles'>\n`;
    $(event.types).each((i, eType) => {
        // If event type is not yet part of legend array
        if (!eventTypes.includes(eType)) {
            // Add it
            eventTypes.push(eType);
        }
        // Mark what type of event this is with span bubble element
        basicInfo += `<span class='${eType}'></span>\n`;
    });
    basicInfo += `<!--end type bubbles--></div>\n<div class='info'>`;
    // Add event name
    basicInfo += `<span class='name ${event.sname}'>${event.name}`;
    // Mark if event is Optional
    basicInfo += (!event.required) ? ` <span class='optional'>(Optional)</span>` : ``;
    basicInfo += `<!--end name span--></span>\n`;
    // Add event time
    basicInfo += `<span class='time ${event.sname}'>${event.timeStart} - ${event.timeEnd}</span>`;
    // Add event location
    basicInfo += `<span class='place ${event.sname}'>${event.place}</span>`;
    basicInfo += `<!--end info--></div>\n`;
    return basicInfo;
};

// Adds expandable section with additional details for an event
const addExpandedInfo = ({
    'event': event,
    'isTalk': isTalk,
    'isBreakout': isBreakout,
    'shouldBeHidden': shouldBeHidden
}) => {
    // Add desc/options element, if event is talk or breakout session
    let expandedInfo = "";
    if (isTalk && !shouldBeHidden) {
        expandedInfo += addTalkDesc(event);
    } else if (isBreakout && !shouldBeHidden) {
        expandedInfo += addBreakoutOptions(event);
    } else if (!shouldBeHidden && event.shortDesc.length && event.shortDesc !== "") {
        expandedInfo += `<div class='about ${event.types[0]}'>\n<div class='inside flex'>\n<div class='desc'>\n`;
        expandedInfo += `<p>${event.shortDesc}</p>\n`;
        expandedInfo += `<!--end desc--></div>\n<!--end inside flex--></div>\n<!-- end about--></div>`;
    }
    return expandedInfo;
};

const addTalkDesc = (event) => {
	let component = "";
	if (!event.speaker || event.speaker === "TBD" || event.debugHide) {
		return component;
	} else {
		component += `<div class='about ${event.types[0]}'>\n<div class='inside flex'>\n<div class='desc'>\n`;
		component += "<h2>" + event.speaker + " <em>" + event.speakerHome + "</em></h2>\n";
		component += "<div class='lil-img'><img src='../img/" + event.speakerImg + "'></div>\n";
		component += "<p>" + event.shortDesc + " Visit her <a target='_blank' href='" + event.speakerPage.URL + "'>" + event.speakerPage.type + "</a> to learn more.</p>\n";
		component += "</div>\n<div class='big-img'><img src='../img/" + event.speakerImg + "'></div>\n</div>\n</div>\n";
		return component;
	}
};

const addBreakoutOptions = (event) => {
	let component = "";
	if (!event.options || event.options.length === 0 || event.debugHide) {
		return component;
   } else if (event.name.match(/breakout session \d of \d/i)) {
      // Remember current breakout session number by extracting from session name (i.e. "Breakout Session 1 of 3" => 1)
      let snum = parseInt(event.name.match(/\d of \d/)[0].substr(0, 1));
		// Label container with event types
      component += "<div class='about ";
      for (let t = 0; t < event.types.length; t++) {
         component += event.types[t];
         component += (t + 1 === event.types.length) ? "" : " ";
      }
      component += "'>\n<div class='inside flex'>\n<ul>\n";
      for (let id in progData.breakouts) {
         // Store current breakout session data
         let s = progData.breakouts[id];
         // If breakout session is included in current session number
         if (s.sessions.includes(snum)) {
            // Add breakout session occurrences
            component += "<li>\n<div class='occurrences'>";
            for (let i = 1; i < 4; i++) {
               component += (s.sessions.includes(i)) ? `<span class='indicator true'>${i}</span>` : `<span class='indicator false'>${i}</span>`;
            }
            // Add breakout session info
            component += "</div>\n<div class='details'><span class='session'>" + s.name + "</span>";
            // If breakout session has special property
      		if (s.hasOwnProperty("special")) {
      			component += "<span class='label";
      			// If breakout session is labeled as only occurring once
      			component += (s.special.toLowerCase().includes("once")) ? " once'>" : "'>";
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
      for (let t = 0; t < event.types.length; t++) {
         component += event.types[t];
         component += (t + 1 === event.types.length) ? "" : " ";
      }
      component += "'>\n<div class='inside flex'>\n<ul>\n";
      for (let id in progData.careerBreakouts) {
         // Store current breakout session data
         let s = progData.careerBreakouts[id];
         // Add breakout session info
         component += "<li>\n<div class='details'><span class='session'>&#8226;&emsp;" + s.name + "</span>";
   		component += "</li>\n";
      }
		component += "</ul>\n</div>\n</div>\n";
		return component;
   }
};

// Build and insert legend of event types using populated eventTypes array
const addLegend = () => {
    let legend = "";
    // Sort event types alphabetically
	eventTypes.sort();
	// For each type of event
	$(eventTypes).each((i, eType) => {
		// Produce proper (readable) name for event type
		let pn = eType;
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
		legend += `<div><span class='${eType}'></span>${pn}</div>\n`;
	});
    // Fill legend
	$('.event.types.legend').html(legend);
};

// Clicking on agenda event type bubble
$('.agenda.spread').on('click', '.type.bubbles span', (e) => {
	if ($(window).width() <= 700) {
		if ($(e.target).hasClass('focused')) {
			$(e.target).removeClass('focused');
		} else {
			$(e.target).addClass('focused');
		}
	}
});

// On click anywhere outside event type bubble on mobile, close bubble
$('html').click((e) => {
   if (!$(e.target).parents('.type.bubbles').length && $(window).width() <= 700) {
		$('.type.bubbles span').removeClass('focused');
   }
});

// Clicking agenda event will open event's details
$('.agenda.spread').on('click', '.event', (e) => {
    let $eventItem = $(e.target).closest('.event');
   if ($eventItem.hasClass('expanded')) {
       $eventItem.removeClass('expanded');
       $eventItem.find('.about').slideUp();
   } else {
       $eventItem.addClass('expanded');
       $eventItem.find('.about').slideDown();
   }
});

/* End of agenda.js */
