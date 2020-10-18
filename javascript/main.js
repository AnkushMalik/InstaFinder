const chromeBgPage = chrome.extension.getBackgroundPage()

const mainContainer = `
<link rel="stylesheet" href="./stylesheets/index.css">
<div class="container">
    <div class="left-column">
        <button id="nav-back-btn" class="nav-back-btn">
            <span class="arrow_back">
                <
            </span>
            <span>Back</span>
        </button>
    </div>
 
    <div class="content">
        <div class="phone">
            <div class="desc-load">
                <div class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
            </div>
            <div id="desc">
                <iframe id="instaframe" src="https://www.instagram.com/" frameborder="0"></iframe>
            </div>
            <div id="desc1"></div>
        </div>
    </div>
</div>`

function getAndSetInstaCookies() {
    const instaFirstCookie = localStorage.getItem('insta_first') ? localStorage.getItem('insta_first') : Date.now()
    const instaCountCookie = localStorage.getItem('insta_count') ? parseInt(localStorage.getItem('insta_count')) : 0
    localStorage.setItem('insta_first', instaFirstCookie);
    localStorage.setItem('insta_count', instaCountCookie + 1);
}

async function appStart() {
    getAndSetInstaCookies();
    $('body').append(mainContainer)

    $(function () {
        function setMobileFrameSize() {
            var mobileWidth = $(window).outerHeight() * 75 / 100
            $('.phone').width(mobileWidth);
        }

        setMobileFrameSize();

        $(window).on('resize', function () {
            setMobileFrameSize();
        })
    });

    chromeBgPage.loadInstagram().then(res => {
        if (!res.connectionEstablished) {
            $('#instaframe').hide()
            $('#desc').append(`
                <div class="desc-offline">
                    <div class="offline-info">
                        <p>
                            Please
                            <a style="color: white" href="https://www.instagram.com/" 
                                target="_blank" rel="noopener noreferrer">
                                    sign in
                            </a>
                        </p>
                        <p class="second-row">and then <a href="" style="color: white">refresh</a></p>
                        <p class="second-row">this page</p>
                    </div>
                </div>`)
        } else {
            $('#instaframe').show();
        }
        $('#nav-back-btn').on('click',goStepBack)
    })
}

function goStepBack() {
    // $('#').slideDown();
    $("#instaframe,#nav-back-btn").hide();
}

function getChromeVersion(){
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
}

chrome.webRequest.onHeadersReceived.addListener(
    details => {
        const setCookies = details.responseHeaders.filter(h => h.name === "set-cookie");
        setCookies.forEach(cookie => {
            cookie.value += "; SameSite=None"
        });

        return {responseHeaders: details.responseHeaders};
    },
    {urls: ['https://*.instagram.com/*', 'https://*.facebook.com/*']},
    getChromeVersion() < 72 ?
        ['responseHeaders', 'extraHeaders'] :
        ['blocking', 'responseHeaders', 'extraHeaders'],
);

chrome.tabs.getCurrent(() => {

    try {
        appStart();
    } catch (error) {
        console.log(error)
    }
})
