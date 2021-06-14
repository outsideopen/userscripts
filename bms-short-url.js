// ==UserScript==
// @name         BMS Short URL button
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.4
// @description  adds a "Short URL" button to the buttons on a ticket
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/servicedesk/tickets*
// @match        https://bms.kaseya.com/react/servicedesk/mytickets*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	function parseAspNetFormActionVariable(variable)
	{
		return parseQueryVariable(jQuery('#aspnetForm').attr('action').split('?')[1], variable);
	}

	function parseQueryVariable(query, variable)
	{
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	function TrelloClipboard() {
		var me = this;

		var utils = {
			nodeName: function (node, name) {
				return !!(node.nodeName.toLowerCase() === name)
			}
		}
		var textareaId = 'simulate-trello-clipboard',
		    containerId = textareaId + '-container',
		    container, textarea

		var createTextarea = function () {
			container = document.querySelector(containerId)
			if (!container) {
				container = document.createElement('div')
				container.id = containerId
				container.setAttribute('style', [, 'position: fixed;', 'left: 0px;', 'top: 0px;', 'width: 0px;', 'height: 0px;', 'z-index: 100;', 'opacity: 0;'].join(''))
				document.body.appendChild(container)
			}
			container.style.display = 'block'
			textarea = document.createElement('textarea')
			textarea.setAttribute('style', [, 'width: 1px;', 'height: 1px;', 'padding: 0px;'].join(''))
			textarea.id = textareaId
			container.innerHTML = ''
			container.appendChild(textarea)

			textarea.appendChild(document.createTextNode(me.value))
			textarea.focus()
			textarea.select()
		}

		me.setValue = function(value) {
			textarea.innerHTML='';
			textarea.appendChild(document.createTextNode(value));
			textarea.focus()
			textarea.select()
		};

		createTextarea();
	}

	var clip = new TrelloClipboard();
	function copy_to_clipboard()
	{
		// detect if we are on legacy or react
		var titleSelector = '.psa-ticket-view-title';
		var clientSelector = '.psa-ticket-info-summary-account';
		var path = window.location.pathname;
		if (window.location.pathname.search(/\/MSP\//) !== -1) {
			titleSelector  = '.TicketTitle em span';
			clientSelector = '.itg-org';
			path           = path + "?ID=" + parseAspNetFormActionVariable('ID');
		}

		var newURL = window.location.protocol + "//" + window.location.host + path;
		var client = document.querySelector(clientSelector).innerText;
		var title = document.querySelector(titleSelector).innerText.replace(/\s+/ig,' ');

		clip.setValue(newURL + " [" + client + ' :: ' + title + "]");
		document.execCommand('copy');
	}

	document.onkeyup=function(e){
		if (e.altKey && e.shiftKey && e.ctrlKey && e.which == 67) {
			e.preventDefault();
			e.stopImmediatePropagation();
			copy_to_clipboard();
		}
	};
	jQuery('#createTicket').append('<a id="custom-button-shorturl" class="btn btn-sm btn-primary QuickAddButton">Short URL</a>');
	jQuery('#custom-button-shorturl').on('click', function(e) {
		e.preventDefault();
		copy_to_clipboard();
	});

})();