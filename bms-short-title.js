// ==UserScript==
// @name         Kaseya BMS Short Title
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.4
// @description  Removes 'Company Name - Ticket#' or 'Company Name - ' from Title on BMS Pages
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if (url.includes("TicketEdit.aspx")){ // Only match tickets
        //Replace the CSS class TicketTitle with an empty string which leaves just the ticket subject.
        var tickettitle = document.querySelector('.TicketTitle em span').innerText.replace(/^$/, '');
        document.title = tickettitle;
    }
    else {
        var newtitle = document.title;
        //Replace up to and including ' - ' to remove company name from the title on non ticket pages
        newtitle = newtitle.replace(/ - .*$/, '');
        document.title = newtitle;
    }
})();
