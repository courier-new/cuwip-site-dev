/**
 * nav.js
 *
 * Auto-configures and adds main navigation menu content per page according to data read from nav.json, which is pre-ordered and split into mobile items first, desktop-only items last. Relies on retrieval of nav.main.menu item from scroll-effect.js.
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since July 23, 2017
 * @version   1.1.0
 */

// Variable for storing all of the navigation items retrieved from json
let navData = {pages: Array(0)};

$.getJSON('/js/nav.json', function(data) {
   navData = data;
	addNavs();
});

function addNavs() {
	if (!navData.pages.length) {
		setTimeout(function() {
			addNavs();
		}, 50);
	} else {
		// Variable to hold string of content to fill nav menu
	   let navContent = "<ul>\n";
		// Variable to hold mobile drawer of certain nav items
		let navDrawer = "<div class='drawer'><ul>\n";
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
			// Add relevant items to nav drawer string
			navDrawer += stillOnMobile ? "" : output;
	   });
		// Complete nav menu
		navContent += "</ul>\n";
		// Add completed navigation menu
	   $('nav.main.menu').html(navContent);
		// Complete nav drawer
		navDrawer += "</ul></div>\n"
		$('nav.menu.drawer').html(navDrawer);
		navHeight = $('nav.main.menu').outerHeight();
		setLastSubsectionHeight();
	}
}

// Add extra padding to last subsection to allow full scroll through it
let setLastSubsectionHeight = function() {
	// If page contains subsections and page is not mobile
	if ($subsections.length && $(window).width() > 1000) {
		// Get last subsection
		let last = $subsections[$subsections.length - 1];
		let $last = $(last);
		// Get readable section of window
		let $windowSpace = $(window).outerHeight() - navHeight - $('.footer').outerHeight();
		// If last subsection is shorter than readable window
		if ($last.outerHeight() < $windowSpace) {
			// Make up the difference in padding
			$last.css('padding-bottom', $windowSpace - $last.outerHeight());
		}
	}
};

// On click of hamburger, toggle display of menu drawer
$('nav.main.menu').on('click', 'a.hamburger', function() {	$('nav.menu.drawer').slideToggle();
});
// On click anywhere outside nav menus, close menu drawer if it is open
$('html').click(function(e) {
   if (!$(e.target).parents('.menu').length) {
		$('nav.menu.drawer').slideUp();
   }
});

// If page contains subsections
if ($subsections.length) {
	// Fill subsection nav menu
	let $menuOutput = "<div class='inner'>\n<strong>Quick Navigation</strong>\n<ul>\n";
	$subsections.each(function() {
		// Get name of subsection
		let $name = $(this).find('h1')[0].innerHTML;
		// Condense to short name of subsection
		let $sname = $name.replace(/ /g, "").toLowerCase();
		$menuOutput += "<a href='#" + $sname + "' class='" + $sname + "'><li><span class='border'></span>" + $name + "</li></a>\n";
	});
	$menuOutput += "</ul>\n</div>\n";
	$('nav.sub.menu').html($menuOutput);
}

/* End of nav.js */
