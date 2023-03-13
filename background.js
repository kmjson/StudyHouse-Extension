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
    let studyHouseFlag = false;
    chrome.tabs.query({}, (tabs) => {
        for (let i = 0; i < tabs.length; i++) {
            let tab = tabs[i];
            let url = new URL(tab.url);
            if (blockedWebsites.includes(url.hostname)) {
                chrome.storage.local.get(["inSession"], (inSession) => {;
                    if (inSession.inSession === "true") {
                        chrome.tabs.sendMessage(tab.id, {
                            from: "background",
                            source: "blockedWebsite"
                        });
                    }
                })
            }
            if (url.hostname === "127.0.0.1" ||
                url.hostname === "localhost" ||
                url.hostname === "studyhouse-74491.firebaseapp.com" ||
                url.hostname === "studyhouse-74491.web.app") {
                studyHouseFlag = true;
                chrome.tabs.sendMessage(tab.id, {
                    from: "background",
                    source: "studyHouse"
                });
            }
        }
    });
    if (!studyHouseFlag) {
        chrome.storage.local.set({"inSession": "false"}, () => {});
    }
}, 500);
  