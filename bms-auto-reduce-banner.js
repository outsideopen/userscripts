// ==UserScript==
// @name         BMS auto reduce banner content size
// @namespace    https://github.com/outsideopen/userscripts
// @version      0.1
// @description  Auto Reduces the banner content size from 100% to 25px
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
    .kaseya-ui-banner {
        transition: padding 0.3s ease;
        padding-top: 6px;
        padding-bottom: 0;
        margin: 0;
    }
    .kaseya-ui-banner.opened {
        padding: 16px 16px 16px 21px;
        margin: unset;
    }
    .kaseya-ui-banner .banner__children {
        transition: padding 0.3s ease;
        height: 25px
    }
    .kaseya-ui-banner .banner__inner-container .more {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
    }
    .kaseya-ui-banner.opened .banner__children {
        height: 100%;
    }
    .kaseya-ui-banner.opened .banner__inner-container .more {
        display: none;
    }
    `;
    document.head.appendChild(style);

    const more_wrapper = document.createElement('div');
    more_wrapper.classList.add('more');
    const more = document.createElement('i');
    more.classList.add('kaseya-ui-icon', 'far', 'fa-fw', 'fa-angles-down');
    more_wrapper.appendChild(more);

    waitForElement('.kaseya-ui-banner').then((el) => {
        el.children[0].appendChild(more_wrapper);
        jQuery(el).on('click', function() {
            el.classList.toggle('opened');
        });
    });
})();
