// ==UserScript==
// @name         BMS Short Title
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.2
// @description  Removes 'Outside Open - Ticket#' or 'Outside Open - ' from Title on BMS Pages
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if (url.includes("TicketEdit.aspx")){
        var tickettitle = document.querySelector('.TicketTitle em span').innerText.replace(/^Ticket# /, '').replace(/\s+/ig,' ');
        document.title = tickettitle;
    }
    else {
        var newtitle = document.title;
        newtitle = newtitle.replace('Outside Open - ','');
        document.title = newtitle;
    }
})();
