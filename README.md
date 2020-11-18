#  Userscripts

These have been tested in Chrome.

## Installation

- Open the **Tampermonkey** extension
- Go to the **Utilities** tab
- Copy URL to the script that you want to add the **URL** input and click on the **Import** button
  - The scripts are linked below on their header names
  - If you intend to use the code browser (in github), you will need to copy the raw file url.
- Click on the **Install** button

## BMS extra buttons

![BMS URL buttons](/screenshots/bms-extra-buttons.png)

### [BMS Markdown URL button](https://raw.githubusercontent.com/outsideopen/userscripts/master/bms-markdown-url.js)

This creates a "Markdown URL" button, that creates a link that looks like the following:

`[client :: title](https://bms.example.com/MSP/TicketEdit.aspx?ID=####)`

### [BMS Short URL button](https://raw.githubusercontent.com/outsideopen/userscripts/master/bms-short-url.js)

This creates "Short URL" button that creates a link that is a little more suitable for Slack.

Much shorter when compared to the URL in the address bar!

`https://bms.example.com/MSP/TicketEdit.aspx?ID=#### [client :: title]`

## [BMS Play Mp3 Attachment](https://raw.githubusercontent.com/outsideopen/userscripts/master/bms-play-mp3-attachment.js)

Creates an *audio* element on the **Ticket View** tab that allows you to play
any attached mp3's.

![BMS MP3 Attachment Player](/screenshots/bms-play-mp3.png)

## [BMS Short Title - Tickets](https://github.com/outsideopen/userscripts/blob/master/bms-short-title-tickets.js)

Removes "Outside Open - Ticket#" from the Page title, making more details visible on open tabs.

## [BMS Short Title](https://github.com/outsideopen/userscripts/blob/master/bms-short-title.js)

Removes "Outside Open - " from the Page title on other pages like CRM, Timesheet, etc.
