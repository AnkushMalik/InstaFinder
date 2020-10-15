chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    if ( changeInfo.status == 'complete') { // check if the content loading status is complete
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { method: "pageLoad" })
        })
        
    }
});