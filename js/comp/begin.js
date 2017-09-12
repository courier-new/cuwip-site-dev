// Outer wrapper
(function () {

	$(document).on('ready', function(){
		// Gather array of all pages
		var pages = $('.page');

		// Mark each section as ready
		pages.each(function(){
			$(this).addClass('ready')
		});
	});
