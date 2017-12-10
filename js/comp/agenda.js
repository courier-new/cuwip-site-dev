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
    let progData = {schedule: Array(0)};

    // Array for storing all the different event types for creating bubble legend
    let eventTypes = [];

    // Read in agenda data from json
    $.getJSON('agenda.min.json', (data) => {
       progData = data;
       addAgenda();
    });

    const addSubnav = () => {
        $subsections = $('.page .agenda.spread > .day.block');
        if (!$subsections.length) {
            setTimeout(() => {
                addSubnav();
            }, 200);
        } else {
            addSubMenu('Jump to Day');
        }
    };

    // Function to open event card if it is now
    const openCurrentEvent = () => {
        // Only run on agenda page
        if ($('.agenda.spread').length) {
            // Wait until agenda data has populated the DOM
        	if (!$('.agenda.spread .day.block').length) {
        		setTimeout(() => {
        			openCurrentEvent();
        		}, 200);
        	} else {
                // Compute seconds from midnight January 1st 1970 to current time, unless test date is specified
                const now = testDate ? testDate : new Date();
                // Get all event cards
                const $events = $('.agenda.spread .day.block .event');
                // For each event, check if it is currently happening
                $events.each((index, event) => {
                    const dateRange = getDateRangeForEvent(event);
                    if (now > dateRange.start && now < dateRange.end) {
                        // Open event card
                        openCard($(event));
                    }
                });
            }
        }
    };

    // Function for getting js Date objects describing the duration of an event
    const getDateRangeForEvent = (event) => {
        // Get the day, start, and end time for the event
        const day = $(event).closest('.day.block').find('h1').html(),
              times = $(event).find('span.time').html().split(' - '),
              start = times[0],
              end = times[1];
        let dateRange = {start: 0, end: 0};
        // Generate Date objects for event's start and end time
        switch(day) {
            case 'Friday' :
                dateRange.start = new Date(`January 12, 2018 ${start}`);
                dateRange.end = new Date(`January 12, 2018 ${end}`);
                break;
            case 'Saturday' :
                dateRange.start = new Date(`January 13, 2018 ${start}`);
                dateRange.end = new Date(`January 13, 2018 ${end}`);
                break;
            default:
                dateRange.start = new Date(`January 14, 2018 ${start}`);
                dateRange.end = new Date(`January 14, 2018 ${end}`);
        }
        return dateRange;
    };

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
    		$('.agenda.spread').html(agendaContent);
            // Add subnavigation
            addSubnav();
            // Add events legend
    	    addLegend();
            // Open current event
            openCurrentEvent();
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
        // Add expandable section with additional details for event
        eventCard += addExpandedInfo({
            'event': event,
            'campus': campus,
            'isTalk': event.types.includes("talk"),
            'isBreakout': event.types.includes("breakout"),
            'shouldBeHidden': event.debugHide || false,
            'hasExpandable': hasExpandable
        });
        // Condtionally add expandable arrow indicator
        eventCard += hasExpandable ? `<div class='expandable arrow'><i class="fa fa-chevron-right" aria-hidden="true"></i></div>\n` : ``;
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
        'campus': campus,
        'isTalk': isTalk,
        'isBreakout': isBreakout,
        'shouldBeHidden': shouldBeHidden,
        'hasExpandable': hasExpandable
    }) => {
        // If card has no expandable
        if (!hasExpandable) {
            return "";
        } else {
            // Add desc/options element, if event is talk or breakout session
            let expandedInfo = `<div class='about ${event.types.join(' ')}'>\n`;
            if (isTalk && !shouldBeHidden) {
                expandedInfo += addTalkDesc(event);
            } else if (isBreakout && !shouldBeHidden) {
                expandedInfo += addBreakoutOptions(event);
            } else if (!shouldBeHidden) {
                expandedInfo += `<div class='inside grid'>\n<div class='desc'>\n`;
                expandedInfo += (event.shortDesc.length) ? `<p>${event.shortDesc}</p>\n` : `<p>No details currently available for this event.</p>`;
                expandedInfo += `<!--end desc--></div>\n<!--end inside grid--></div>\n`;
            }
            expandedInfo += addMap({
                'event': event,
                'campus': campus
            });
            expandedInfo += "<!-- end about--></div>";
            return expandedInfo;
        }
    };

    const addTalkDesc = (event) => {
    	let component = "";
    	if (!event.speaker || event.speaker === "TBD" || event.debugHide) {
    		return component;
    	} else {
            // Add inner grid container
    		component += `<div class='inside grid'>\n`;
            // Add speaker image
            component += `<div class='img'><img src='../img/${event.speakerImg}'></div>\n`;
            // Add speaker name
            component += `<div class='img-header'><h2>${event.speaker}</h2></div>\n`;
            // Add speaker home
    		component += `<div class='img-caption'>${event.speakerHome}</div>\n`;
            // Add event description and link to speaker page
    		component += `<div class='desc'>\n<p>${event.shortDesc}</p>\n<p>Visit her <a target='_blank' href='${event.speakerPage.URL}'>${event.speakerPage.type}</a> to learn more.</p>\n</div>\n`;
            component += `<!--end inside grid--></div>\n`;
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

    // Function to open event card details
    const openCard = (card) => {
        if (card.hasClass('expanded')) {
            card.removeClass('expanded');
            card.find('.about').slideUp();
        } else if (card.hasClass('expandable')) {
            card.addClass('expanded');
            card.find('.about').slideDown();
        }
    };

    // Clicking agenda event will open event's details
    $('.agenda.spread').on('click', '.event', (e) => {
        let $eventCard = $(e.target).closest('.event');
        openCard($eventCard);
    });
}

/* End of agenda.js */
