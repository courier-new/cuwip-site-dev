/**
 * mini-agenda.js
 *
 * Parses program data from agenda.json into miniature version of full blown agenda page
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since December 18th, 2017
 * @version   1.0.0
 */

// Variable for storing all of the program data retrieved from json
let progData = {schedule: Array(0)};

// Read in agenda data from json
$.getJSON('../../agenda/agenda.min.json', (data) => {
   progData = data;
   addAgenda();
});

// Function for populating the whole agenda via data read in from json
const addAgenda = () => {
	let agendaContent = "";
    // Wait until agenda data has been loaded
	if (!progData.schedule.length) {
		setTimeout(() => {
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
		$('.spread').html(agendaContent);
	}
};

// Adds a day to the agenda
const addDay = ({
    'day': day,
    'isLast': isLast
}) => {
    // Define day of week and institution of the day
    let dayCapt = day.day.charAt(0).toUpperCase() + day.day.slice(1);
    let daySection = `<div class='${day.day} day block'>
        <a name='${day.day}'></a>
        <h1>${dayCapt}</h1>
        <span class='campus reference'>${day.college}</span>
            <div class='day table'>\n`;
    // For each event in the day
    $(day.events).each((i, eventObj) => {
        // Add event to the agenda
        daySection += addEvent(eventObj, day.scollege);
    });
    daySection += "<!--end day table--></div>\n";
    // Add separator except on last day
    daySection += (!isLast) ? "<div class='separator'></div>" : "";
    daySection += "<!--end day block--></div>\n";
    return daySection;
};

// Adds an event card to a day
const addEvent = (event, campus) => {
    // Determine if event has extra description for expandable info section
    const hasExpandable = !event.debugHide && (event.shortDesc.length || event.options);
    // Add event card
    let eventCard = `<div class='event ${event.sname}`;
    eventCard += hasExpandable ? ` expandable'>` : `'>`;
    // Add item name, time, place, and type designations
    eventCard += addBasicInfo(event);
    eventCard += `<!--end event card--></div>\n`;
    return eventCard;
};

// Adds name, time, place, and type designations for an event
const addBasicInfo = (event) => {
    // Add container for event types
    let basicInfo = `<div class='info'>`;
    // Add event name
    basicInfo += `<span class='name ${event.sname}'>${event.name}`;
    basicInfo += `<!--end name span--></span>\n`;
    // Add event time
    basicInfo += `<span class='time ${event.sname}'>${event.timeStart} - ${event.timeEnd}</span>`;
    // Add event location
    basicInfo += `<span class='place ${event.sname}'>${event.place}</span>`;
    basicInfo += `<!--end info--></div>\n`;
    return basicInfo;
};

const addBreakoutOptions = (event) => {
	let component = "";
	if (!event.options || event.options.length === 0 || event.debugHide) {
		return component;
   } else if (event.name.match(/breakout session \d of \d/i)) {
      // Remember current breakout session number by extracting from session name (i.e. "Breakout Session 1 of 3" => 1)
      let snum = parseInt(event.name.match(/\d of \d/)[0].substr(0, 1));
      // Add inner grid container
      component += "<div class='inside grid'>\n<ul>\n";
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
		component += "</ul>\n</div>\n";
		return component;
	} else if (event.name.match(/career/i)) {
      // Add inner grid container
      component += "<div class='inside grid'>\n<ul>\n";
      for (let id in progData.careerBreakouts) {
         // Store current breakout session data
         let s = progData.careerBreakouts[id];
         // Add breakout session info
         component += `<li>\n<div class='details'><span class='session'>${s.name}</span>`;
   		component += "</li>\n";
      }
		component += "</ul>\n</div>\n";
		return component;
   }
};

/* End of mini-agenda.js */
