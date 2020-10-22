var faviconUrls = {
	gmail: 'https://old-google-icons.s3.amazonaws.com/gmail/gmail.ico',
	maps: 'https://old-google-icons.s3.amazonaws.com/maps/maps-2.ico',
	drive: 'https://old-google-icons.s3.amazonaws.com/drive/drive-2.ico',
	calendar: 'https://old-google-icons.s3.amazonaws.com/calendar/',
}

chrome.webNavigation.onDOMContentLoaded.addListener(function () {
	
	chrome.tabs.query({
		active: true,
	}, tabs => {
		if (tabs && tabs[0]) {
			var tab = tabs[0];
			var tabId = tab.id;
			var url = tab.url;
			
			//console.log(tab);
			console.log(`tab url=${tab.url}, id=${tab.id}`);
			
			var faviconUrl, codeInjection;
			if (url.includes('mail.google.com')) {
				faviconUrl = faviconUrls.gmail;
				codeInjection = `document.querySelectorAll('link[rel="shortcut icon"]')[0].href = "${faviconUrl}"`
			}
			else if (url.includes('maps.google.com') || url.includes('google.com/maps')) {
				faviconUrl = faviconUrls.maps;
				codeInjection = `document.querySelectorAll('link[rel="shortcut icon"]')[0].href = "${faviconUrl}"`
			}
			else if (url.includes('docs.google.com')) {
				// not needed yet
			}
			else if (url.includes('calendar.google.com')) {
				// Not needed yet
			}
			
			if (faviconUrl) {
				chrome.tabs.executeScript(tabId, {
					code: codeInjection,
					//code: 'console.log(1)'
				}, () => {
					
				})
			}
		}
		else {
			console.log('couldn\'t get tab info');
		}
	})
}, 
{ url: [{ urlMatches: 'google.com' }] });
