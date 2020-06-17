// ==UserScript==
// @name         BMS Remove title 'Outside Open - '
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1
// @description  Remove's 'Outside Open - ' from HTML Title
// @author       Andy Rusch <arusch@outsideopen.com>
// @match        https://bms.kaseya.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var newtitle = document.title;
newtitle = newtitle.replace('Outside Open - ','');
document.title = newtitle;
})();
