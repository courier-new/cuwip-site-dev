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

// Array for storing all the different event types for creating bubble legend
var eventTypes = [];

$.getJSON('agenda.min.json', function (data) {
  progData = data;
  addAgenda();
});

// Function for populating the whole agenda via data read in from json
var addAgenda = function addAgenda() {
  var output = "";
  if (!progData.schedule.length) {
    setTimeout(function () {
      console.log('trying to fetch agenda again');
      addAgenda();
    }, 200);
  } else {
    // For each day of the schedule
    $(progData.schedule).each(function (i, dayObj) {
      // Begin parsing data with date title
      var currOutput = "<h1>" + dayObj.day + "</h1>\n";
      currOutput += "<span class='campus reference'>" + dayObj.college + "</span>\n<div class='day table'>\n";
      $(dayObj.events).each(function (i, eventObj) {
        currOutput += addEvent(eventObj);
      });
      currOutput += "</div>\n";
      // Add separator unless last day
      currOutput += progData.schedule.indexOf(dayObj) !== progData.schedule.length - 1 ? "<div class='separator'></div>" : "";
      output += currOutput;
    });
    // Fill agenda
    $('.agenda.spread').html(output);

    var legend = "";
    eventTypes.sort();
    // For each type of event
    $(eventTypes).each(function (i, eType) {
      // Get event proper name
      var pn = eType;
      if (eType == "breakout") {
        pn = "Breakout Session";
      } else if (eType == "free") {
        pn = "Free Time";
      } else if (eType == "misc") {
        pn = "Misc/Special";
      } else if (eType == "shuttle") {
        pn = "Shuttle Run";
      } else {
        pn = pn.charAt(0).toUpperCase() + pn.slice(1);
      }
      legend += "<div><span class='" + eType + "'></span>" + pn + "</div>\n";
    });
    $('.event.types.legend').html(legend);
  }
};

var addEvent = function addEvent(e) {
  // Add individual event item
  var currOutput = "<div class='event " + e.sname + "'>\n";
  // Add event type designations
  currOutput += "<div class='type bubbles'>\n";
  $(e.types).each(function (i, eType) {
    // If event type is not yet part of legend array
    if (!eventTypes.includes(eType)) {
      // Add it
      eventTypes.push(eType);
    }
    // Mark what type of event this is
    currOutput += "<span class='" + eType + "'></span>\n";
  });
  currOutput += "</div>\n<div class='info'>";
  // Add event name
  currOutput += "<span class='name " + e.sname + "'>" + e.name;
  // Mark if event is Optional
  currOutput += !e.required ? " <span class='optional'>(Optional)</span>" : "";
  currOutput += "</span>\n";
  // Add event time
  currOutput += "<span class='time " + e.sname + "'>" + e.timeStart + " - " + e.timeEnd + "</span>";
  // Add event location
  currOutput += "<span class='place " + e.sname + "'>" + e.place + "</span>";
  currOutput += "</div>\n";
  // Add desc/options element, if event is talk or parallel session
  if (e.types.includes("talk")) {
    currOutput += addTalkDesc(e);
  } else if (e.types.includes("breakout")) {
    currOutput += addBreakoutOptions(e);
  } else if (e.shortDesc.length || e.shortDesc !== "" && !e.debugHide) {
    currOutput += "<div class='about'>\n<div class='inside flex " + e.types[0] + "'>\n<div class='desc'>\n";
    currOutput += "<p>" + e.shortDesc + "</p>\n";
    currOutput += "</div>\n</div>\n</div>";
  }
  currOutput += "</div>\n";
  return currOutput;
};

var addTalkDesc = function addTalkDesc(e) {
  var output = "";
  if (!e.speaker || e.speaker === "TBD" || e.debugHide) {
    return output;
  } else {
    output += "<div class='about'>\n<div class='inside flex " + e.types[0] + "'>\n<div class='desc'>\n";
    output += "<h2>" + e.speaker + " <em>" + e.speakerHome + "</em></h2>\n";
    output += "<div class='lil-img'><img src='../img/" + e.speakerImg + "'></div>\n";
    output += "<p>" + e.shortDesc + " Visit her <a target='_blank' href='" + e.speakerPage.URL + "'>" + e.speakerPage.type + "</a> to learn more.</p>\n";
    output += "</div>\n<div class='big-img'><img src='../img/" + e.speakerImg + "'></div>\n</div>\n</div>\n";
    return output;
  }
};

var addBreakoutOptions = function addBreakoutOptions(e) {
  var output = "";
  if (!e.options || e.options.length === 0 || e.debugHide) {
    return output;
  } else if (e.name.match(/breakout session \d of \d/i)) {
    // Remember current breakout session number by extracting from session name (i.e. "Breakout Session 1 of 3" => 1)
    var snum = parseInt(e.name.match(/\d of \d/)[0].substr(0, 1));
    // Label container with event types
    output += "<div class='about ";
    for (var t = 0; t < e.types.length; t++) {
      output += e.types[t];
      output += t + 1 === e.types.length ? "" : " ";
    }
    output += "'>\n<div class='inside flex'>\n<ul>\n";
    for (var id in progData.breakouts) {
      // Store current breakout session data
      var s = progData.breakouts[id];
      // If breakout session is included in current session number
      if (s.sessions.includes(snum)) {
        // Add breakout session occurrences
        output += "<li>\n<div class='occurrences'>";
        for (var i = 1; i < 4; i++) {
          output += s.sessions.includes(i) ? '<span class=\'indicator true\'>' + i + '</span>' : '<span class=\'indicator false\'>' + i + '</span>';
        }
        // Add breakout session info
        output += "</div>\n<div class='details'><span class='session'>" + s.name + "</span>";
        // If breakout session has special property
        if (s.hasOwnProperty("special")) {
          output += "<span class='label";
          // If breakout session is labeled as only occurring once
          output += s.special.toLowerCase().includes("once") ? " once'>" : "'>";
          output += s.special + "</span>";
        }
      }
      output += "</li>\n";
    }
    output += "</ul>\n</div>\n</div>\n";
    return output;
  } else if (e.name.match(/career/i)) {
    // Label container with event types
    output += "<div class='about ";
    for (var _t = 0; _t < e.types.length; _t++) {
      output += e.types[_t];
      output += _t + 1 === e.types.length ? "" : " ";
    }
    output += "'>\n<div class='inside flex'>\n<ul>\n";
    for (var _id in progData.careerBreakouts) {
      // Store current breakout session data
      var _s = progData.careerBreakouts[_id];
      // Add breakout session info
      output += "<li>\n<div class='details'><span class='session'>&#8226;&emsp;" + _s.name + "</span>";
      output += "</li>\n";
    }
    output += "</ul>\n</div>\n</div>\n";
    return output;
  }
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
  } else {
    $eventItem.addClass('expanded');
    $eventItem.find('.about').slideDown();
  }
});

/* End of agenda.js */
})();
//# sourceMappingURL=agenda-dist.js.map
