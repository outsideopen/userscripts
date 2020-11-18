// ==UserScript==
// @name         BMS Remove title 'Outside Open - '
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1
// @description  Removes 'Outside Open - ' from HTML Title on non-ticket pages
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/MyTickets.aspx*
// @match        https://bms.kaseya.com/Dashboard/TimesheetEdit.aspx*
// @match        https://bms.kaseya.com/MSP/TicketsListing.aspx*
// @match        https://bms.kaseya.com/CRM/*
// @match        https://bms.kaseya.com/Finance/*
// @match        https://bms.kaseya.com/Reports/*
// @match        https://bms.kaseya.com/Projects/*
// @match        https://bms.kaseya.com/Administration/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var newtitle = document.title;
    newtitle = newtitle.replace('Outside Open - ','');
    document.title = newtitle;
})();
