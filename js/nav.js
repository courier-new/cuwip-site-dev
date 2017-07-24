/**
 * nav.js
 *
 * Auto-configures and adds main navigation menu content per page according to data read from nav.json, which is pre-ordered and split into mobile items first, desktop-only items last. Relies on retrieval of nav.main.menu item from scroll-effect.js.
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 23, 2017
 * @version   1.0.0
 */

// Variable for storing all of the navigation items retrieved from json
let navData;
// Identify the name of the current page, given by the first class assigned to the nav menu (nav.main.menu)
let $currPage = $nav.attr('class').split(' ')[0];

$.when(getNavs()).then(function() {
   setTimeout(function() {
		addNavs();
	}, 400);
});

function getNavs() {
   $.getJSON('/js/nav.json', function(data) {
      navData = data;
   });
}

function addNavs() {
	// Variable to hold string of content to fill nav menu
   let navContent = "<ul>\n";
	// Boolean to track where the break between mobile and desktop-only items is
	let stillOnMobile = true;
   $(navData.pages).each(function() {
      let curr = $(this)[0];
		// Add components of nav menu item
		// If stillOnMobile but curr is desktop-only
		if (stillOnMobile && !curr.mobile) {
			// Remember that all succeeding items are not mobile
			stillOnMobile = false;
			// Add "more" button
			navContent += "<a class='hamburger'><img class='nav icon' src='../img/more-256.png' /><li>More</li></a>\n";
		}
		// Variable to hold current item's content string
		let output = "<a class='";
		// Check if current nav item corresponds to current page
		let isCurrentPage = curr.name.toLowerCase() === $currPage;
		output += isCurrentPage ? "current " : "";
		// If current nav item is desktop-only
		output += curr.mobile ? "" : "desktop only";
		// Add link unless nav item is current page
		output += isCurrentPage ? "'>" : "' href='.." + curr.link + "'>";
		// Make sure only mobile items have nav icons
		if (curr.mobile && curr.icon === "") {
			console.log("Warning: " + curr.name + " navigation item is marked to display on mobile navigation menu but has no icon specified.");
		} else if (!curr.mobile && curr.icon !== "") {
			console.log("Warning: " + curr.name + " navigation item is marked to display on desktop navigation menu only but has an icon specified.");
		}
		// If nav item has an icon
		if (curr.icon !== "") {
			output += "<img class='nav icon' src='../img/" + curr.icon;
			// If nav item is current page, use turquoise icon variant
			output += isCurrentPage ? "-turquoise" : "";
			output += ".png' />";
		}
		output += "<li>" + curr.name;
		// Add border element if nav item is current page
		output += isCurrentPage ? "<span class='border'></span>" : "";
		output += "</li></a>\n";
		// Add nav item content string to full nav menu string
		navContent += output;
   });
	// Complete nav menu
	navContent += "</ul>\n";
	// Add completed navigation menu
   $('nav.main.menu').html(navContent);
}
