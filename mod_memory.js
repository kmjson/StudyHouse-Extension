const block_button = document.querySelector("button");

const sites = [];
chrome.storage.sync.get(/* String or Array */["blockList"], function(items){
    const memorySites = items["blockList"];
    console.log('poops');
    console.log(sites);
    let list = document.getElementById("blockListDisplay");
    
    (memorySites || []).forEach((item) => {
        sites.push(item);
        let li = document.createElement("li");
        li.innerText = item;
        list.appendChild(li);
    });
});


block_button.addEventListener("click", function(){
    chrome.storage.sync.get(/* String or Array */["blockList"], function(items){
        const remSites = items["blockList"] || [];
        
        remSites.forEach((item) => {
            sites.push(item);
        });
    });

    const blocked = document.getElementById('apivalue').value;
    if (blocked != '' && (!sites.includes(blocked))) {
        sites.push(blocked);
    
        // load list from memory
        chrome.storage.sync.set({ "blockList": sites }, function(){
        //  A data saved callback omg so fancy
        chrome.storage.sync.get(/* String or Array */["blockList"], function(items){
                console.log(items["blockList"]);
            });
        });
        let list = document.getElementById("blockListDisplay");
        let li = document.createElement("li");
        li.innerText = blocked;
        list.appendChild(li);

    }

    

  
});
