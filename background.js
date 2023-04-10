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
                const blockedWebsites = [];
                chrome.storage.sync.get(/* String or Array */["blockList"], function(items){
                    const memorySites = items["blockList"] || [];
                    console.log('test');
                    console.log('items:', items);
                    console.log('mem:', memorySites);
                    // console.log(blockedWebsites);
                    // let list = document.getElementById("blockListDisplay");
                    console.log(items);
                    (memorySites || []).forEach((item) => {
                        blockedWebsites.push(item);
                        console.log('in here');
                        console.log(item);
                        // let li = document.createElement("li");
                        // li.innerText = item;
                        // list.appendChild(li);
                    });
                    console.log('made it to after');
                    console.log(blockedWebsites);
                    console.log('outside the sync');
                    console.log('url:', url.hostname);
                    console.log('blockedWebsites', blockedWebsites);
                    console.log(blockedWebsites.values);
    
                    
                    if (blockedWebsites.includes(url.hostname)) {
                        console.log('the if works');
                        console.log(url.hostname);
                        chrome.storage.local.get(["inSession"], (inSession) => {
                            console.log('getting storage works');
                            if (inSession.inSession === "true") {
                                console.log('its in there');
                                chrome.tabs.sendMessage(tab.id, {
                                    from: "background",
                                    source: "blockedWebsite"
                                });
                            }
                        })
                    }
                });
               
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}, 500);
  