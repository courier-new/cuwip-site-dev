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

$.when(getNavs()).then(function() {
   setTimeout(function() {
		addNavs();
	}, 100);
});

function getNavs() {
   $.getJSON('/js/nav.json', function(data) {
      navData = data;
   });
}

function addNavs() {
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
}

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
	let $isFirst = true;
	$subsections.each(function() {
		// Get name of subsection
		let $name = $(this).find('h1')[0].innerHTML;
		// Condense to short name of subsection
		let $sname = $name.replace(/ /g, "").toLowerCase();
		$menuOutput += "<a class='" + $sname;
		$menuOutput += $isFirst ? " current" : "";
		if ($isFirst) {
			$isFirst = false;
		}
		$menuOutput += "'><li>" + $name + "</li></a>\n";
	});
	$menuOutput += "</ul>\n</div>\n";
	$('nav.sub.menu').html($menuOutput);

	// Add previous and next buttons to each subsection
	let addDirectionButtons = function() {
		$subsections.each(function() {
			let $output = "";
			// Get previous text block
			let $prev = $(this).prev();
			// If previous text block exists
			if ($prev.length) {
				// Derive subsection short name from text block
				$prev = $prev.attr('class').split(' ')[0];
				$output += "<a class='" + $prev + "'><div class='back button " + $prev + "'>";
				// Get readable name from corresponding subsection navigation menu label
				$prev = $('nav.sub.menu').find('a.' + $prev + ' li')[0].innerHTML;
				$output += "<span class='back label'>Back</span><span class='section label'>" + $prev + "</span>";
			} else {
				$output += "<a><div class='back button none'>"
			}
			$output += "</div></a>\n";
			// Get next text block
			let $next = $(this).next();
			// If next text block exists
			if ($next.length) {
				// Derive subsection short name from text block
				$next = $next.attr('class').split(' ')[0];
				$output += "<a class='" + $next + "'><div class='next button " + $next + "'>";
				// Get readable name from corresponding subsection navigation menu label
				$next = $('nav.sub.menu').find('a.' + $next + ' li')[0].innerHTML;
				$output += "<span class='next label'>Next</span><span class='section label'>" + $next + "</span>";
			} else {
				$output += "<a><div class='next button none'>"
			}
			$output += "</div></a>\n";
			let $buttons = $(this).find('.forward.back.buttons');
			$buttons.html($output);
		});
	}

	$.when(addDirectionButtons()).then(function() {
	   setTimeout(function() {
			// Set initial height of subsections panel once prev/next buttons are in
			setSubsectionsHeight();
		}, 100);
	});
}

/* End of nav.js */
