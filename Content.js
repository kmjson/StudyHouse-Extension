const generateSTYLES = () => {
    return `<style>
    
    @import url(https://fonts.googleapis.com/css?family=opensans:500);
  
    body {
      background: #f8dec7 !important;
      color: #fff2cc !important;
      font-family: "Open Sans", sans-serif !important;
      overflow: hidden !important;
    }
  
    .studyhouse_container {
      margin: auto !important;
      max-width: 1200px !important;
      padding: 50px !important;
      padding-top: 150px !important;
      padding-bottom: 20px !important;
      display: flex !important;
      justify-content: center !important;
    }
  
    #studyhouse_logo {
      max-width: 90% !important;
    }
     </style>`;
  };

const generateHTML = () => {
    var url = chrome.runtime.getURL('studyhouse.png');
    return `
    <div class='studyhouse_container'>
        <img src='https://raw.githubusercontent.com/kmjson/StudyHouse-Extension/main/studyhouse.png' id='studyhouse_logo'>
        <img src='https://raw.githubusercontent.com/kmjson/StudyHouse-Extension/main/text1.png' id='studyhouse_logo'>
        <img src='https://raw.githubusercontent.com/kmjson/StudyHouse-Extension/main/text2.png' id='studyhouse_logo'>
    </div>
     `;
};

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.from === "background") {
        if (msg.source === "blockedWebsite") {
            document.head.innerHTML = generateSTYLES();
            document.body.innerHTML = generateHTML();
        }
        else if (msg.source === "studyHouse") {
            // Enable Button
            if (document.getElementById("studyhouseStartButton")) {
                document.getElementById("studyhouseStartButton").disabled = false;
                document.getElementById("studyhouseStartButton").innerHTML = "Start Session";
            }
            // Browser Lock
            // console.log(document.getElementById("studyhouseEndButton"));
            if (document.getElementById("studyhouseEndButton") !== null) {
                chrome.runtime.sendMessage({
                    from: "content",
                    inSession: "true"
                });
            }
            else {
                chrome.runtime.sendMessage({
                    from: "content",
                    inSession: "false"
                });
            }
        }
    }
});