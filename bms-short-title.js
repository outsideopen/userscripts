// ==UserScript==
// @name         BMS Remove title 'Outside Open - '
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.2
// @description  Remove's 'Outside Open - Ticket#' from HTML Title
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var newtitle = document.querySelector('.TicketTitle em span').innerText.replace(/^Ticket# /, '').replace(/\s+/ig,' ');    
    document.title = newtitle;
})();
