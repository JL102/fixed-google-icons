var browser = browser || chrome;


const baseFaviconPath = '/images/favicons'

const faviconPaths = {
	calendar: `${baseFaviconPath}/calendar`,
	docs: `${baseFaviconPath}/docs.ico`,
	drawings: `${baseFaviconPath}/drawings.ico`,
	drive: `${baseFaviconPath}/drive-1.ico`,
	earth: `${baseFaviconPath}/earth.ico`,
	forms: `${baseFaviconPath}/forms.ico`,
	gmail: `${baseFaviconPath}/gmail.ico`,
	hangouts: `${baseFaviconPath}/hangouts.ico`,
	keep: `${baseFaviconPath}/keep.ico`,
	maps: `${baseFaviconPath}/maps.ico`,
	meet: `${baseFaviconPath}/meet.ico`,
	photos: `${baseFaviconPath}/photos.ico`,
	sheets: `${baseFaviconPath}/sheets.ico`,
	slides: `${baseFaviconPath}/slides.ico`,
	translate: `${baseFaviconPath}/translate.ico`,
	voice: `${baseFaviconPath}/voice.png`,
}

const debugPerformance = true;

function getURL(path) {
	return browser.runtime.getURL(path);
}

function codeInjection_ShortcutIcon(faviconUrl, indexNumber) {
	if (!indexNumber) indexNumber = 0;
	return `document.querySelectorAll('link[rel="shortcut icon"]')[${indexNumber}].href = "${faviconUrl}";`;
}

function codeInjection_Icon(faviconUrl, indexNumber) {
	if (!indexNumber) indexNumber = 0;
	return `document.querySelectorAll('link[rel="icon"]')[${indexNumber}].href = "${faviconUrl}";`;
}

function codeInjection_Favicon(faviconUrl) {
	return `document.querySelectorAll('link[rel="favicon"]')[0].href = "${faviconUrl}";`;
}

browser.webNavigation.onDOMContentLoaded.addListener(function () {
	
	if (debugPerformance) var startTime = Date.now();
	
	browser.tabs.query({
		active: true,
	}, tabs => {
		if (tabs && tabs[0]) {
			var tab = tabs[0];
			var tabId = tab.id;
			var url = tab.url;
			
			var faviconUrl, codeInjection;
			
			if (url.startsWith('https://calendar.google.com')) {
				// not needed yet
				
				//var dayOfMonth = new Date().getDate();
				//faviconUrl = getURL(`${faviconPaths.calendar}/${dayOfMonth}.ico`);
			}
			//all forms of google docs
			else if (url.startsWith('https://docs.google.com')) {
				switch(url.substring(24, 28)) {
					// slides (presentation)
					case 'pres': 
					
						break;
					// docs (document)
					case 'docu':
						
						break;
					// forms
					case 'form':
						
						break;
					// sheets (spreadsheets)
					case 'spre':
						
						break;
					default:
						console.warn(`Couldn't figure out what subset of google docs this url was: ${url.substring(0, 45)}...`);
				}
			}
			else if (url.startsWith('https://drawings.google.com')) {
				// not needed yet
			}
			else if (url.startsWith('https://drive.google.com')) {
				faviconUrl = getURL(faviconPaths.drive);
				codeInjection = codeInjection_Icon(faviconUrl);
			}
			else if (url.startsWith('https://www.google.com/earth')) {
				// not needed yet
			}
			else if (url.startsWith('https://mail.google.com')) {
				faviconUrl = getURL(faviconPaths.gmail);
				codeInjection = codeInjection_ShortcutIcon(faviconUrl);
			}
			else if (url.startsWith('https://hangouts.google.com')) {
				// not needed yet
				//faviconUrl = getURL(faviconPaths.hangouts);
				//codeInjection = codeInjection_Icon(faviconUrl);
			}
			else if (url.startsWith('https://keep.google.com')) {
				// not needed yet
				// It looks like there are two favicon links; "icon" links to an .ico, and "shortcut icon" links to a .png
				//	We might need to change both (which won't be difficult)
			}
			else if (url.startsWith('https://maps.google.com') || url.startsWith('https://www.google.com/maps')) {
				faviconUrl = getURL(faviconPaths.maps);
				codeInjection = codeInjection_ShortcutIcon(faviconUrl);
			}
			else if (url.includes('meet.google.com')) {
				// this one is a little more complicated; the page has 7 icon versions in the html
				// 	Editing the 2nd one in the list (32x32) seemed to do the trick, but maybe some people would experience problems with it? Keep this on our radar
				faviconUrl = getURL(faviconPaths.meet);
				codeInjection = codeInjection_ShortcutIcon(faviconUrl, 1);
			}
			else if (url.startsWith('https://photos.google.com')) {
				// This one also has multiple icon versions. Overriding the fifth one (64x64) seemed to do the trick
				faviconUrl = getURL(faviconPaths.photos);
				codeInjection = codeInjection_Icon(faviconUrl, 4);
			}
			else if (url.startsWith('https://translate.google.com')) {
				// not needed yet
				//	This one doesn't have any icon links in the document head; instead, it loads /favicon.ico. We might need to inject a link element if need be
			}
			else if (url.startsWith('https://voice.google.com')) {
				// not needed yet
			}
			
			if (faviconUrl && codeInjection) {
				browser.tabs.executeScript(tabId, {
					code: codeInjection,
				}, () => {
					if (debugPerformance) console.log(`${Date.now() - startTime} ms`);
				})
			}
		}
		else {
			console.log('couldn\'t get tab info');
		}
	})
}, 
{ url: [{ urlMatches: 'google.com' }] });

const rules = {
	// "https://ssl.gstatic.com/gb/images/p1_5df01b81.png": "",
	"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r2.png": "icons/logo_gmail_lockup_default_2x.png",
	"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png": "icons/logo_gmail_lockup_default_1x.png",

	/* Calendar */
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_1_2x.png": "icons/calendar/2x/cal_01_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_2_2x.png": "icons/calendar/2x/cal_02_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_3_2x.png": "icons/calendar/2x/cal_03_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_4_2x.png": "icons/calendar/2x/cal_04_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_5_2x.png": "icons/calendar/2x/cal_05_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_6_2x.png": "icons/calendar/2x/cal_06_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_7_2x.png": "icons/calendar/2x/cal_07_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_8_2x.png": "icons/calendar/2x/cal_08_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_9_2x.png": "icons/calendar/2x/cal_09_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_11_2x.png": "icons/calendar/2x/cal_11_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_12_2x.png": "icons/calendar/2x/cal_12_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_13_2x.png": "icons/calendar/2x/cal_13_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_14_2x.png": "icons/calendar/2x/cal_14_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_15_2x.png": "icons/calendar/2x/cal_15_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_16_2x.png": "icons/calendar/2x/cal_16_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_17_2x.png": "icons/calendar/2x/cal_17_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_18_2x.png": "icons/calendar/2x/cal_18_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_19_2x.png": "icons/calendar/2x/cal_19_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_21_2x.png": "icons/calendar/2x/cal_21_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_22_2x.png": "icons/calendar/2x/cal_22_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_23_2x.png": "icons/calendar/2x/cal_23_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_24_2x.png": "icons/calendar/2x/cal_24_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_25_2x.png": "icons/calendar/2x/cal_25_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_26_2x.png": "icons/calendar/2x/cal_26_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_27_2x.png": "icons/calendar/2x/cal_27_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_28_2x.png": "icons/calendar/2x/cal_28_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_29_2x.png": "icons/calendar/2x/cal_29_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_30_2x.png": "icons/calendar/2x/cal_30_v2.png",
	"https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_31_2x.png": "icons/calendar/2x/cal_31_v2.png",


	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_1.ico": "favicons/calendar/1.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_2.ico": "favicons/calendar/2.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_3.ico": "favicons/calendar/3.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_4.ico": "favicons/calendar/4.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_5.ico": "favicons/calendar/5.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_6.ico": "favicons/calendar/6.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_7.ico": "favicons/calendar/7.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_8.ico": "favicons/calendar/8.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_9.ico": "favicons/calendar/9.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_10.ico": "favicons/calendar/10.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_11.ico": "favicons/calendar/11.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_12.ico": "favicons/calendar/12.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_13.ico": "favicons/calendar/13.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_14.ico": "favicons/calendar/14.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_15.ico": "favicons/calendar/15.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_16.ico": "favicons/calendar/16.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_17.ico": "favicons/calendar/17.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_18.ico": "favicons/calendar/18.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_19.ico": "favicons/calendar/19.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_20.ico": "favicons/calendar/20.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_21.ico": "favicons/calendar/21.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_22.ico": "favicons/calendar/22.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_23.ico": "favicons/calendar/23.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_24.ico": "favicons/calendar/24.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_25.ico": "favicons/calendar/25.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_26.ico": "favicons/calendar/26.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_27.ico": "favicons/calendar/27.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_28.ico": "favicons/calendar/28.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_29.ico": "favicons/calendar/29.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_30.ico": "favicons/calendar/30.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v2/calendar_31.ico": "favicons/calendar/31.ico",

	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_1.ico": "favicons/calendar/1.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_2.ico": "favicons/calendar/2.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_3.ico": "favicons/calendar/3.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_4.ico": "favicons/calendar/4.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_5.ico": "favicons/calendar/5.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_6.ico": "favicons/calendar/6.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_7.ico": "favicons/calendar/7.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_8.ico": "favicons/calendar/8.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_9.ico": "favicons/calendar/9.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_10.ico": "favicons/calendar/10.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_11.ico": "favicons/calendar/11.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_12.ico": "favicons/calendar/12.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_13.ico": "favicons/calendar/13.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_14.ico": "favicons/calendar/14.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_15.ico": "favicons/calendar/15.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_16.ico": "favicons/calendar/16.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_17.ico": "favicons/calendar/17.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_18.ico": "favicons/calendar/18.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_19.ico": "favicons/calendar/19.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_20.ico": "favicons/calendar/20.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_21.ico": "favicons/calendar/21.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_22.ico": "favicons/calendar/22.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_23.ico": "favicons/calendar/23.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_24.ico": "favicons/calendar/24.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_25.ico": "favicons/calendar/25.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_26.ico": "favicons/calendar/26.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_27.ico": "favicons/calendar/27.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_28.ico": "favicons/calendar/28.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_29.ico": "favicons/calendar/29.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_30.ico": "favicons/calendar/30.ico",
	"https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_31.ico": "favicons/calendar/31.ico",

	/* Meet */
	"https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_1x_icon_124_40_2373e79660dabbf194273d27aa7ee1f5.png": "icons/google_meet_horizontal_wordmark_icon_40dp.png",
	"https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_2x_icon_124_40_292e71bcb52a56e2a9005164118f183b.png": "icons/google_meet_horizontal_wordmark_icon_80dp.png",

	/* Drive */

	"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png": "icons/drive_48dp.png",
	"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png": "icons/drive_48dp@2x.png",
	"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png": "icons/drive_48dp.png",

	/* Maps */
	"https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico": "favicons/maps.ico",

	/* Spritesheet */
	"https://ssl.gstatic.com/gb/images/p1_5df01b81.png": "icons/p1_5df01b81.png"
}

browser.webRequest.onBeforeRequest.addListener(
	obj => {
		for (let i in rules) {
			if (obj.url === i) {
				return {redirectUrl: getURL("images/" + rules[i])}
			}
		}
	},
	{urls:["https://ssl.gstatic.com/*", "https://www.gstatic.com/*", "https://calendar.google.com/*", "https://www.google.com/*"]},
	["blocking"]
)