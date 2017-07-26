/* Global variables */

// Set date/time of application-related dates in this format
let applyOpen = '1 September 2017 00:00:00 EDT';
let applyClose = '13 October 2017 23:59:00 EDT';
let registerOpen = '6 November 2017 00:00:00 PST';
let registerClose = '17 November 2017 23:59:00 PST';
// Set date/time of event in this format
let startOfCUWiP = '12 January 2018 18:00:00 PDT';

// Identify main navigation menu
let $nav = $('nav.main.menu');
// Identify footer
let $footer = $('.page.footer');

// Identify the name of the current page, given by the first class assigned to the nav menu (nav.main.menu)
let $currPage = $nav.attr('class').split(' ')[0];

// Remember each of the page sections and subsections
let $pages = $('.page');
let $subsections = $('.page > .inner.hiding.container > .text.block');

/* End of global variables*/
