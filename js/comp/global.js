/* Global variables */

// Set date/time of application-related dates in this format
let applyOpen = '1 September 2017 00:00:00 EDT',
    applyClose = '13 October 2017 23:59:00 EDT',
    registerOpen = '6 November 2017 00:00:00 PST',
    registerClose = '17 November 2017 23:59:00 PST',
    startOfCUWiP = '12 January 2018 18:00:00 PDT',
    travelClose = '21 January 2018 23:59:00 PST';

// Store events Array
let events = {
	"Application Opens": applyOpen,
	"Application Closes": applyClose,
	"Applicant Status Announced": registerOpen,
	"Registration Closes": registerClose,
	"Conference Weekend": startOfCUWiP,
	"Travel Reimbursement Form Due": travelClose
};

// Variable for holding test date
let testDate;

// Variable to record current stage of application process
// Key:
// Bad value                              | -100
// Before application opens               |   -1
// During application period              |    0
// After application, before registration |    1
// During registration period             |    2
// After registration                     |    3
// After travel reimbursement form due    |    4
let stage = -100;

// Identify main navigation menu
let $nav = $('nav.main.menu');
// Identify footer
let $footer = $('.page.footer');

// Identify the name of the current page, given by the first class assigned to the nav menu (nav.main.menu)
let $currPage = $nav.attr('class').split(' ')[0];

// Remember each of the page sections and subsections
let $pages = $('.page');
let $subsections = $('.page > .inner.hiding.container > .text.block');

// Remember the height of main navigation menu
let navHeight = 0;

/* End of global variables*/
