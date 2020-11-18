// ==UserScript==
// @name         BMS Remove title 'Outside Open - Ticket#'
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1
// @description  Removes 'Outside Open - Ticket#' from HTML Title on Ticket Pages
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var newtitle = document.querySelector('.TicketTitle em span').innerText.replace(/^Ticket# /, '').replace(/\s+/ig,' ');    
    document.title = newtitle;
})();
