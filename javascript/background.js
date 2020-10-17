chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    if ( changeInfo.status == 'complete') { // check if the content loading status is complete
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { method: "pageLoad" })
        })
        
    }
});

var mainWindowId = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.grabbedUserName){
        console.log('>>>>>>>grabbed user\'s name : ', request.grabbedUserName) // remove later
        if(mainWindowId === false){
            mainWindowId===true
            chrome.windows.create({
                url: `${chrome.runtime.getURL("main.html")}?search=${request.grabbedUserName}`,
                type: "popup"
            },function(win){
                mainWindowId = win.id;
            });
        }else if(typeof mainWindowId ==='number'){
            chrome.windows.update(mainWindowId,{focused:true});
        }
      }
    }
);

chrome.windows.onRemoved.addListener(function (winId){
    if(mainWindowId === winId){
        mainWindowId = false;
    }
});