// ==UserScript==
// @name         BMS Assign To Me button
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1.4
// @description  adds "Assign To Me" button to the buttons on a ticket
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/*tickets*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	var psa_user = JSON.parse(localStorage.PSAUserInfo);

	function parseAspNetFormActionVariable(variable)
	{
		return parseQueryVariable(jQuery('#aspnetForm')
			                          .attr('action')
			                          .split('?')[1], variable);
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

	function resolveCurrentAssignee()
	{
		jQuery('.psa-label-field:contains(\'Assignee\')')
			.each((idx, el) => {
				if (el.innerHTML === 'Assignee') {
					return jQuery(jQuery(el)
						              .siblings()[0])
						.find('span')[0].textContent;
				}
			});

		// handle legacy UI update
		var legacy = jQuery('#ctl00_phContent_lblVPrimaryAssignee');
		if (legacy.length > 0) {
			return legacy[0].textContent;
		}

		return 'kakaw';
	}

	function assignToMe()
	{
		spinner.classList.remove("hidden");
		jQuery.ajax({
			            type     : 'PATCH',
			            url      : `https://bms.kaseya.com/api2/v2/servicedesk/tickets/${resolveTicketId()}`,
			            dataType : 'json',
			            headers  : {
				            Authorization  : `Bearer ${jQuery.cookie('PSAAuthToken')}`,
				            'Content-Type' : 'application/json',
				            'Accept'       : 'application/json',
			            },
			            data     : JSON.stringify([
				                                      {
					                                      op    : 'replace',
					                                      path  : 'assigneeId',
					                                      value : psa_user.userId,
				                                      },
			                                      ]),
		            })
		      .done(() => {
			      jQuery('.psa-label-field:contains(\'Assignee\')')
				      .each((idx, el) => {
					      if (el.innerHTML === 'Assignee') {
						      jQuery(jQuery(el).siblings()[0]).find('span')[0].textContent = psa_user.fullName;
					      }
				      });

			      // handle legacy UI update
			      var legacy = jQuery('#ctl00_phContent_lblVPrimaryAssignee');
			      if (legacy.length > 0) {
				      legacy[0].textContent = psa_user.fullName;
			      }
		      })
		      .fail((xhr) => {
				  if (xhr.getResponseHeader('token-expired')) {
					  alert("Authentication token expired. Please refresh the page or visit the ticket list.");
				  }
				  else {
					  alert('Unable to re-assign ticket. Please reload the page and try again.');
				  }
		      })
			.always(() => {
				spinner.classList.add("hidden");
			});
	}

	jQuery('body')
		.append(
`<div class="modal fade" id="assignToMeModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Do you accept this ticket?
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </h5>
      </div>
      <div class="modal-body">
        <code>Someone</code> already has this ticket. Are you sure you want to take it over?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Nope</button>
        <button type="button" class="btn btn-primary bigk-button--primary " id="assignToMeNow">Yes</button>
      </div>
    </div>
  </div>
</div>`);

	var createTicketButton = jQuery('#createTicket');
	if (createTicketButton.length === 0) {
		createTicketButton = jQuery('.createTicket');
	}

	var assignToMeModal = jQuery('#assignToMeModal');
	var noone = ['Select', 'None'];
	createTicketButton.append('<a id="custom-button-assigntome" class="btn btn-sm btn-secondary QuickAddButton">Assign To Me <i class="fa fa-spinner fa-pro-spin hidden"></a>');
	var spinner = document.querySelector('#custom-button-assigntome > i');

	jQuery('#assignToMeNow').on('click', () => {
		assignToMeModal.modal('hide');
		assignToMe()
	});
	jQuery('#custom-button-assigntome')
		.on('click', function (e) {
			e.preventDefault();
			var currentAssignee = resolveCurrentAssignee();
			if (currentAssignee === psa_user.fullName) {
				// not doing it
				return;
			}

			if (noone.indexOf(currentAssignee) !== -1) {
				// no one is currently assigned, take it in the users name
				assignToMe();
			}
			else if (currentAssignee !== 'kakaw') {
				assignToMeModal.find('code')[0].textContent = currentAssignee;
				assignToMeModal.modal('show');
			}
		});
})();
