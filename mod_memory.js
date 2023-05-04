const block_button = document.querySelector("button");

function getSync(site) {
    // sync a checkmark element with the boolean value in Storage API 
    console.log(site);
    chrome.storage.sync.get(/* String or Array */site, function(items){
        console.log('items', items);
        var isBlocked = items[site] || false;
        if (isBlocked === undefined){
            isBlocked = false;
        }
        console.log('isblocked', isBlocked);
        document.getElementById(site).checked = isBlocked;
        return isBlocked;
    });

}

function toggleOne(site) {
    // update the value in Storage API for one site
    console.log(document.getElementById(site).checked);
    chrome.storage.sync.set({ [site]: document.getElementById(site).checked }, function(){
        //  A data saved callback omg so fancy
        chrome.storage.sync.get(/* String or Array */site, function(items){
                console.log(items[site]);
        });
    });

}

function selectAll(category) {
    // update the value in Storage API to be true for each site in category
    for (let i=0; i<category.length; i++){
        let site = category[i];
        document.getElementById(site).checked = true;
        chrome.storage.sync.set({ [site]: true }, function(){
            //  A data saved callback omg so fancy
            chrome.storage.sync.get(/* String or Array */site, function(items){
                    console.log(items[site]);
            });
        });        
    }
}


var sites = [];

const allSites = ['facebook', 'twitter', 'instagram', 'linkedin', 'netflix', 'hulu', 'hbomax', 'twitch'];

const chk_facebook = document.getElementById('facebook');
const chk_instagram = document.getElementById('instagram');
const chk_twitter = document.getElementById('twitter');
const chk_linkedin = document.getElementById('linkedin');

const button_social_media = document.getElementById('all_social_media');

const chk_netflix = document.getElementById('netflix');
const chk_hulu = document.getElementById('hulu');
const chk_hbomax = document.getElementById('hbomax');
const chk_twitch = document.getElementById('twitch');

const button_streaming = document.getElementById('all_streaming');

for (let i=0; i<allSites.length; i++){
    getSync(allSites[i])
}

chk_facebook.addEventListener('click', () => {
    var result = toggleOne('facebook');
});
chk_instagram.addEventListener('click', () => {
    var result = toggleOne('instagram');
});
chk_twitter.addEventListener('click', () => {
    var result = toggleOne('twitter');
});
chk_linkedin.addEventListener('click', () => {
    var result = toggleOne('linkedin');
});
button_social_media.addEventListener('click', () => {
    const social_media_list = ['instagram', 'facebook', 'twitter', 'linkedin'];
    selectAll(social_media_list);
});


chk_netflix.addEventListener('click', () => {
    var result = toggleOne('netflix');
});
chk_hulu.addEventListener('click', () => {
    var result = toggleOne('hulu');
});
chk_hbomax.addEventListener('click', () => {
    var result = toggleOne('hbomax');
});
chk_twitch.addEventListener('click', () => {
    var result = toggleOne('twitch');
});
button_streaming.addEventListener('click', () => {
    const streaming_list = ['netflix', 'hulu', 'hbomax', 'twitch'];
    selectAll(streaming_list);
});

setInterval(() => {
    chrome.storage.local.get(["inSession"], (inSession) => {
        if (inSession.inSession === "true") {
            document.getElementById("off").innerHTML = "You can not make edits when in the middle of a Session!";
            document.getElementById("all").style.display = "none";
        }
    })
}, 100)