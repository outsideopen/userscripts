// ==UserScript==
// @name         BMS Short URL button
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.9
// @description  adds a "Short URL" button to the buttons on a ticket, and a context menu item
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/servicedesk/*
// @match        https://bms.kaseya.com/react/*tickets*
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
			if (pair[0] === variable){
				return pair[1];
			}
		}
		return false;
	}

	function TrelloClipboard() {
		var me = this;

		var utils = {
			nodeName: function (node, name) {
				return !!(node.nodeName.toLowerCase() === name);
			}
		}
		var textareaId = 'simulate-trello-clipboard',
		    containerId = textareaId + '-container',
		    container, textarea;

		var createTextarea = function () {
			container = document.querySelector(containerId);
			if (!container) {
				container = document.createElement('div');
				container.id = containerId;
				container.setAttribute('style', ['position: fixed;', 'left: 0px;', 'top: 0px;', 'width: 0px;', 'height: 0px;', 'z-index: 100;', 'opacity: 0;'].join(''));
				document.body.appendChild(container);
			}
			container.style.display = 'block';
			textarea = document.createElement('textarea');
			textarea.setAttribute('style', [, 'width: 1px;', 'height: 1px;', 'padding: 0px;'].join(''));
			textarea.id = textareaId;
			container.innerHTML = '';
			container.appendChild(textarea);

			textarea.appendChild(document.createTextNode(me.value));
			textarea.focus();
			textarea.select();
		}

		me.setValue = function(value) {
			textarea.innerHTML='';
			textarea.appendChild(document.createTextNode(value));
			textarea.focus();
			textarea.select();
		};

		createTextarea();
	}

	var clip = new TrelloClipboard();
	function send_to_clipboard(id, title, client)
	{
		// detect if we are on legacy or react
		var path = window.location.pathname.replace(/\/home\/views\/[0-9]+\/(my)?tickets/, "/servicedesk/tickets");
		if (window.location.pathname.search(/\/MSP\//) !== -1) {
			path = path + "?ID=" + id;
		}

		var href = window.location.protocol + "//" + window.location.host + path;

		clip.setValue(`${href} [${client} :: ${title}]`);
		document.execCommand('copy');
	}

	function copy_to_clipboard()
	{
		// detect if we are on legacy or react
		var titleSelector = '.psa-ticket-view-title';
		var clientSelector = '.psa-ticket-info-summary-account';
		if (window.location.pathname.search(/\/MSP\//) !== -1) {
			titleSelector  = '.TicketTitle em span';
			clientSelector = '.itg-org';
		}

		send_to_clipboard(
			parseAspNetFormActionVariable('ID'),
			document.querySelector(clientSelector).innerText,
			document.querySelector(titleSelector).innerText.replace(/\s+/ig,' ')
		);
	}

	document.onkeyup=function(e){
		if (e.altKey && e.shiftKey && e.ctrlKey && e.which == 67) {
			e.preventDefault();
			e.stopImmediatePropagation();
			copy_to_clipboard();
		}
	};

	var createTicketButton = jQuery('#createTicket')
	if (createTicketButton.length === 0) {
		createTicketButton = jQuery('.createTicket');
	}

	createTicketButton.append('<a id="custom-button-shorturl" class="btn btn-sm btn-primary QuickAddButton">Short URL</a>');
	jQuery('#custom-button-shorturl').on('click', function(e) {
		e.preventDefault();
		copy_to_clipboard();
	});

	// attach a context menu item to copy the url from the old UI
	var contextMenu = jQuery('#ctl00_phListing_ctrlListing_RadMenuWindow_detached ul');
	if (contextMenu.length > 0) {
		var headers = {};
		jQuery('table thead .rgHeader').each((idx, cell) => {
			headers[idx] = cell.UniqueName;
		});

		var menuItem = jQuery('<li class=rmItem><a href=# class=rmLink><span class=rmText>Short URL</span></a></li>');
		contextMenu.append(menuItem);
		menuItem.on('click', function(e) {
			e.preventDefault();
			var id = 0;
			var values = {};
			var href = jQuery('table .rgSelectedRow').attr('href').split('?');

			jQuery('table .rgSelectedRow td').each((idx, cell) => {
				values[headers[idx]] = cell.innerText;
			});

			send_to_clipboard(
				parseQueryVariable(href[href.length === 3 ? 2 : 1], "ID"),
				values.Account,
				values.Title
			);
		});
	}
})();
