// ==UserScript==
// @name         BMS Assign To Me button
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1.3
// @description  adds "Assign To Me" button to the buttons on a ticket
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/*tickets*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	var psa_user = JSON.parse(localStorage.PSAUserInfo);

	function parseAspNetFormActionVariable(variable)
	{
		return parseQueryVariable(jQuery('#aspnetForm').attr('action').split('?')[1], variable);
	}

	function parseQueryVariable(query, variable)
	{
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	}

	// we need replace an array of

	function resolveTicketId()
	{
		return window.location.pathname.search(/\/MSP\//) !== -1
			   ? parseAspNetFormActionVariable('ID')
			   : window.location.pathname.replace(/^.*\/([0-9]+)$/, '$1');
	}

	var createTicketButton = jQuery('#createTicket');
	if (createTicketButton.length === 0) {
		createTicketButton = jQuery('.createTicket');
	}

	createTicketButton.append('<a id="custom-button-assigntome" class="btn btn-sm btn-secondary QuickAddButton">Assign To Me</a>');
	jQuery('#custom-button-assigntome').on('click', function(e) {
		e.preventDefault();
		jQuery.ajax({
						type    : 'PATCH',
						url     : `https://bms.kaseya.com/api2/v2/servicedesk/tickets/${resolveTicketId()}`,
						dataType: 'json',
						headers : {
							Authorization : `Bearer ${jQuery.cookie('PSAAuthToken')}`,
							'Content-Type': 'application/json',
							'Accept'      : 'application/json',
						},
						data    : JSON.stringify([
													 {
														 op   : 'replace',
														 path : 'assigneeId',
														 value: psa_user.userId,
													 },
												 ]),
					})
			  .done(() => {
				  jQuery('.psa-label-field:contains(\'Assignee\')').each((idx, el) => {
					  if (el.innerHTML === 'Assignee') {
						  jQuery(jQuery(el).siblings()[0]).find('span')[0].textContent = psa_user.fullName;
					  }
				  });

				  // handle legacy UI update
				  var legacy = jQuery('#ctl00_phContent_lblVPrimaryAssignee');
				  if (legacy.length > 0) {
					  legacy[0].textContent= psa_user.fullName;
				  }
			  })
			  .fail(() => {
				  // should likely check the result code to reload the auth token.
				  alert('Unable to re-assign ticket. Please reload the page and try again.');
			  });
	});
})();
