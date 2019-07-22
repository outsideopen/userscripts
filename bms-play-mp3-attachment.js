// ==UserScript==
// @name         BMS MP3 player
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.2
// @description  Adds an MP3 player for any attachments that are mp3s (to the edit ticket)
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	var attachments = jQuery('#ctl00_phContent_CustomAttach_rdAttachment_GridData');
	if (attachments.length > 0) {
		jQuery('img[src$="mp3.gif"]').each(function() {
			var mp3 = document.createElement('audio');
			mp3.setAttribute('style', 'max-height: 1.75rem; vertical-align: middle; margin-left: 10px;');
			mp3.setAttribute('controls', true);
			mp3.src = jQuery(this).parent().attr('href');
			jQuery('#ctl00_phContent_pnlTicketProperties').prepend(mp3);
		});
	}
})();