// ==UserScript==
// @name         BMS MP3 player
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.3
// @description  Adds an MP3 player for any attachments that are mp3s (to the edit ticket)
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/*tickets*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	function createAudioPlayer(url)
	{
		var mp3 = document.createElement('audio');
		mp3.setAttribute('style', 'max-height: 1.75rem; vertical-align: middle; margin-left: 10px;');
		mp3.setAttribute('controls', true);
		mp3.src = url;

		return mp3;
	}

	// legacy ui
	var attachments = jQuery('#ctl00_phContent_CustomAttach_rdAttachment_GridData');
	if (attachments.length > 0) {
		jQuery('img[src$="mp3.gif"]').each(function() {
			jQuery('#ctl00_phContent_pnlTicketProperties').prepend(createAudioPlayer(jQuery(this).parent().attr('href')));
		});
	}

	// new ui
	function waitForElement(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector))
			}
			var observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			})
			observer.observe(document.body, {childList: true, subtree:true});
		})
	}

	waitForElement('.psa-attachments .psa-link a').then((el) => {
		if (el.textContent.endsWith('.mp3')) {
			jQuery('.psa-right-side > .psa-sidebar > .psa-sidebar-container')
				.prepend(jQuery('<div class="collapsible-box" style="padding:1rem">').append(createAudioPlayer(el.getAttribute('href'))));
		}
	});
})();