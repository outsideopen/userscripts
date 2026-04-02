// ==UserScript==
// @name         BMS reduce banner content size
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1
// @description  Reduces the banner content size from 100% to 25px
// @author       David Lundgren <dlundgren@outsideopen.com>
// @match        https://bms.kaseya.com/MSP/*
// @match        https://bms.kaseya.com/react/servicedesk/*
// @match        https://bms.kaseya.com/react/*tickets*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
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

    const style = document.createElement('style');
    style.textContent = `
    .kaseya-ui-banner {transition: padding 0.3s ease;}
    .kaseya-ui-banner.toggled {
        padding-top: 6px;
        padding-bottom: 0;
        margin: 0;
    }
    .kaseya-ui-banner .banner__children {
        transition: padding 0.3s ease;
    }
    .kaseya-ui-banner.toggled .banner__children {
        height: 25px;
    }
    `;
    document.head.appendChild(style);

    waitForElement('.kaseya-ui-banner').then((el) => {
        jQuery(el).on('click', function() {
            el.classList.toggle('toggled');
        });
    });
})();
