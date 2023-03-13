const blockedWebsites = [
    "www.youtube.com",
    "www.facebook.com",
    "www.netflix.com"
]

chrome.storage.local.set({"inSession": "false"}, () => {});

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
                if (url.hostname === "127.0.0.1" ||
                    url.hostname === "localhost" ||
                    url.hostname === "studyhouse-74491.firebaseapp.com" ||
                    url.hostname === "studyhouse-74491.web.app") {
                    chrome.tabs.sendMessage(tab.id, {
                        from: "background",
                        source: "studyHouse"
                    });
                }
                if (blockedWebsites.includes(url.hostname)) {
                    chrome.storage.local.get(["inSession"], (inSession) => {
                        if (inSession.inSession === "true") {
                            chrome.tabs.sendMessage(tab.id, {
                                from: "background",
                                source: "blockedWebsite"
                            });
                        }
                    })
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}, 500);
  