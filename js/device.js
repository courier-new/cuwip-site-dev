$('.device.word').each(function() {
	let word = "";
	// If mobile
	if ($(window).width() <= 700) {
		word = "tap";
	} else {
		word = "click";
	}
	if ($(this).hasClass('capitalized')) {
		word = word.charAt(0).toUpperCase() + word.slice(1)
	}
	$(this).html(word);
});
