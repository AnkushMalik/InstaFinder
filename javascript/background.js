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
        var grabbedUserName = request.grabbedUserName
        if (grabbedUserName){
            if(mainWindowId === false){
                mainWindowId===true
                chrome.windows.create({
                    url: `${chrome.runtime.getURL("main.html")}?search=${grabbedUserName}`,
                    type: "popup",
                    height: 700,
                    width: 625,
                    top: 100,
                    left: 9999, // stick to right side of window no matter what the size of window is
                },function(win){
                    mainWindowId = win.id;
                });
            }else if(typeof mainWindowId ==='number'){
                // chrome.tabs.query({ windowType:"popup" }, tabs => {
                //     // chrome.tabs.sendMessage(tabs[0].id, { method: "pageLoad" })
                //     console.log('popup',tabs)
                //     chrome.tabs.executeScript(tabs[0].id, window.location.replace(`${chrome.runtime.getURL("main.html")}?search=${grabbedUserName}`));
                // })
                chrome.tabs.query({ windowType:"popup" }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, { method: { update:true, grabbedUserName:grabbedUserName }  })
                })
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

let chromeTabId = null
let instaUrl = 'https://www.instagram.com'

const requestFilter = {
        urls: ['https://*.instagram.com/*']
    }
    // const iphoneAgent =
    //     `Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1`

function parseActivityCounts(instaPage, res) {

    if (/activity_counts.{0,4}null/.test(instaPage)) {
        res.connectionEstablished = false
    } else {
        let matches = instaPage.match(/activity_counts[^{]*({[^}]*})/)
        if (matches && matches.length > 1) {
            let json = JSON.parse(matches[1])
            res.notifications = Object.keys(json).reduce((acc, k) => json[k] + acc, 0)
        }
    }

    return res;
}

window.loadInstagram = async() => {
    let res = {
        connectionEstablished: true,
        notifications: 0
    }
    let instagramResponse;
    let instaPage;

    try {
        instagramResponse = await fetch(instaUrl, { credentials: 'include' })
        instaPage = await instagramResponse.text()
    } catch (error) {
        console.log(error)
    }

    if (!instaPage) {
        res.connectionEstablished = false;
        return res
    }

    try {
        parseActivityCounts(instaPage, res)
    } catch (error) {
        console.error(error)
    }
    return res
}

window.setCurrentTabId = tabId => {
    chromeTabId = tabId
}

const iphoneUa =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.tabId && (details.tabId === chromeTabId || details.tabId === -1)) {
            const { requestHeaders } = details

            requestHeaders.forEach(header => {
                if (header.name === 'User-Agent') {
                    header.value = iphoneUa
                }
            })

            const headers = requestHeaders.filter(header => {
                return header.name.toLowerCase() !== 'referer'
            })

            return { requestHeaders: headers }
        }
    },
    requestFilter,
    ['blocking', 'requestHeaders']
)

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        const toBeRemoved = [
            'x-frame-options',
            'content-security-policy-report-only',
            'content-security-policy'
        ]
        const headers = details.responseHeaders.filter(header => {
            return toBeRemoved.indexOf(header.name.toLowerCase()) === -1
        })

        return {
            responseHeaders: headers
        }
    },
    requestFilter,
    ['blocking', 'responseHeaders']
)

async function checkNotification() {
    const { notifications } = await window.loadInstagram()

    chrome.browserAction.setBadgeText({
        text: notifications > 0 ? notifications.toString() : ''
    })
}

function initNotifChecker() {
    chrome.browserAction.setBadgeBackgroundColor({
        color: '#ed4956'
    })
    setInterval(checkNotification, 60000)
    checkNotification()
}

initNotifChecker()

if (localStorage.user_opted_out === undefined) {
    localStorage.user_opted_out = true;
}

function getChromeMajorVersion() {
    const match = navigator.userAgent.match(/Chrome\/(\d+)/);
    return (match && parseInt(match[1], 10)) || null;
}

async function background() {
    chrome.tabs.onUpdated.addListener((tId, changeInfo, tab) => {
        if (changeInfo.status === "complete") {
            switch (tab.url) {
                case "https://www.instagram.com/":
                    ga('send', 'pageview', "instagram");
                    break;
            }
        }
    })
}
background()
