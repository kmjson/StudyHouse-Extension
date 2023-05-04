chrome.storage.local.set({"inSession": "false"}, () => {});


function sync(site) {
    // sync a checkmark element with the boolean value in Storage API 
    var returnValue = false;
    chrome.storage.sync.get(/* String or Array */[site], function(items){
        var isBlocked = items[site] || false;
        console.log('here is isblocked in get fxn', isBlocked);
        if (isBlocked === undefined){
            isBlocked = false;
        }
        returnValue = isBlocked;
    });
    console.log('here return value', returnValue);
    return returnValue;

}

// create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument?.()) return;
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['BLOBS'],
      justification: 'keep service worker running',
    });
}

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({"inSession": "false"}, () => {});
    createOffscreen();
});


chrome.runtime.onMessage.addListener((msg) => {
    if (msg.from === "content") {
        if (msg.inSession === "true") {
            chrome.storage.local.set({"inSession": "true"}, () => {});
        }
        else if (msg.inSession === "false") {
            chrome.storage.local.set({"inSession": "false"}, () => {});
        }
    }
});

setInterval(() => {
    chrome.tabs.query({}, (tabs) => {
        let studyhouseFlag = false;
        for (let i = 0; i < tabs.length; i++) {
            try {
                let tab = tabs[i];
                let url = new URL(tab.url);
                if (url.hostname === "127.0.0.1" ||
                    url.hostname === "localhost" ||
                    url.hostname === "studyhouse-74491.firebaseapp.com" ||
                    url.hostname === "studyhouse-74491.web.app") {
                    studyhouseFlag = true;
                }
            } catch (e) {
                console.log(e)
            }
        }
        if (!studyhouseFlag) {
            chrome.storage.local.set({"inSession": "false"}, () => {});
        }
           
        for (let i = 0; i < tabs.length; i++) {
            try {
                let tab = tabs[i];
                let url = new URL(tab.url);
                console.log('before')
                if (url.hostname === "127.0.0.1" ||
                    url.hostname === "localhost" ||
                    url.hostname === "studyhouse-74491.firebaseapp.com" ||
                    url.hostname === "studyhouse-74491.web.app") {
                    chrome.tabs.sendMessage(tab.id, {
                        from: "background",
                        source: "studyHouse"
                    });
                }
                // var blockedWebsites = [];
                const allSites = ['facebook', 'twitter', 'instagram', 'linkedin', 'netflix', 'hulu', 'hbomax', 'twitch'];
                const urls = ['www.facebook.com', 'twitter.com', 'www.instagram.com', 'www.linkedin.com', 'www.netflix.com', 'www.hulu.com', 'www.hbomax.com', 'www.twitch.tv'];
                for (let i=0; i<allSites.length; i++){
                    console.log('heres the site', allSites[i]);
                    chrome.storage.sync.get(/* String or Array */[allSites[i]], function(items){
                        var isBlocked = items[allSites[i]] || false;
                        console.log('here is isblocked in get fxn', isBlocked);
                        if (isBlocked === undefined){
                            isBlocked = false;
                        }
                        console.log('heres if it is blocked', isBlocked);
                        if (isBlocked === true) {
                            console.log("ITS TRUE!!");
                            console.log(urls[i]);
                            if (urls[i] === url.hostname) {
                                console.log('INSESSION!!!!');
                                chrome.storage.local.get(["inSession"], (inSession) => {
                                    if (inSession.inSession === "true") {
                                        chrome.tabs.sendMessage(tab.id, {
                                            from: "background",
                                            source: "blockedWebsite"
                                        });
                                    }
                                })
                            }
                            // blockedWebsites.push(urls[i]);
                            console.log('in the if heres blocked websites', blockedWebsites);
                        }
                    });
                    
                }    
                console.log('blockedsites', blockedWebsites);
                // if (blockedWebsites.includes(url.hostname)) {
                //     console.log('INSESSION!!!!');
                //     chrome.storage.local.get(["inSession"], (inSession) => {
                //         if (inSession.inSession === "true") {
                //             chrome.tabs.sendMessage(tab.id, {
                //                 from: "background",
                //                 source: "blockedWebsite"
                //             });
                //         }
                //     })
                // }
              
               
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}, 500);
  