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
$('.page.footer').on('dblclick', function() {
	// If window is not mobile size
	if ($(window).width() > 700) {
		if (!$('.test.date.trigger').length) {
			let trigger = "<div class='test date trigger' style='background: rgba(255, 255, 255, 0.1); position: absolute; bottom: 0; right: 0; width: 100px; height: 50px; z-index: 200;'></div>";
			$(this).prepend(trigger);
		} else {
			$('.test.date.trigger').remove();
		}
	}
});

// Add test date changing module on click of button
$('.page.footer').on('click', '.test.date.trigger', function() {
	if (!$('.test.date.module').length) {
		console.log('opening test date module');
		console.log(`current time is ${new Date()}`);
		let module = "<div class='module container'>\n<div class='test date module'>\n<div class='text'>\n";
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
$('body').on('click', '.test.date.module .go.button', function() {
	// Try to parse date
	let input = Date.parse($('.test.date.module input').val());
	if (!input) {
		console.log('could not parse date from input');
	}
	// Set date and reload content
	testDate = input;
	addAppInfo();
	highlightCurrentPeriod();
	openCurrentEvent();
});

// Reset to current date on click of reset button
$('body').on('click', '.test.date.module .reset.button', function() {
	// Reset date and reload content
	testDate = null;
	addAppInfo();
	highlightCurrentPeriod();
});

// Close test date changing module on click of anywhere outside of it
$('body').on('click', '.module.container', function(e) {
	e = e || window.event;
	// If module is present and click is not on it
	if ($('.test.date.module').length && !$(e.target).closest('.test.date.module').length) {
        console.log('closing test date module');
		  $('.module.container').remove();
    }
});

// Close test date changing module on press of escape button
document.onkeydown = function(e) {
	e = e || window.event;
	// Boolean for remembering if key pressed is escape
	let isEscape = false;
	// Boolean for remembering if key pressed is enter
	let isEnter = false;
	if ("key" in e) { // Newer browsers
		isEscape = (e.key == "Escape" || e.key == "Esc");
		isEnter = (e.key == "Enter");
	} else { // Older browsers
		isEscape = (e.keyCode == 27);
		isEnter = (e.keyCode == 13);
	}
	// If module is present and keypress of escape
	if ($('.test.date.module').length && isEscape) {
		console.log('closing test date module');
		$('.module.container').remove();
	}
	// If module is present and keypress of enter
	if ($('.test.date.module').length && isEnter) {
		// Try to parse date
		let input = new Date(Date.parse($('.test.date.module input').val()));
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
