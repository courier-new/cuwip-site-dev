// Outer wrapper
(function () {

	$(document).on('ready', function(){
		// Gather array of all pages
		let pages = $('.page');

		// Mark each section as ready
		pages.each(function(){
			$(this).addClass('ready')
		});
	});
