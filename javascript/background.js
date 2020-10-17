chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    if ( changeInfo.status == 'complete') { // check if the content loading status is complete
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { method: "pageLoad" })
        })
        
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.grabbedUserName){
        console.log('>>>>>>>grabbed user\'s name : ', request.grabbedUserName) // remove later
        chrome.windows.create({
            url: chrome.runtime.getURL("main.html"),
            type: "popup"
        });
      }
    }
);