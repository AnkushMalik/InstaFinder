const chromeBgPage = chrome.extension.getBackgroundPage()
const serviceTerms = 'http://privacy.unimania.xyz/service_terms_uploader.pdf'
const privacyPolicy = 'http://privacy.unimania.xyz/privacy_policy_uploader.pdf'
const mailTo = 'uploader@unimania.xyz'

const mainContainer = `
<link rel="stylesheet" href="./stylesheets/index.css">
<div class="container">
    <div class="left-column">
        <button id="nav-back-btn" class="nav-back-btn">
            <span class="arrow_back">
                back
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
    <div class="logo">
        <div class="add-info">
            <p><span class="note-info show-first-note">Terms of Use and Privacy Policy</span></p>
            <p><span class="note-info show-second-note">Copyright Notice</span></p>
            <p><a class="note-info note-info-href" href="mailto:${mailTo}" target="_self">Contact Us</a></p>
        </div>
    </div>
</div>`

let autoShow = false;
const aggrement0CookieName = 'desk_agreement_0_'
const aggrement1CookieName = 'desk_agreement_1_'
const aggrement2CookieName = 'desk_agreement_2_'

const notif1 = `<div>By using Desktop for Instagram, you agree to our
                        <a target="_blank" href="${serviceTerms}">Terms of Use</a> and <a target="_blank" href="${privacyPolicy}">Privacy Policy</a>. 
                        Questions? <a href="mailto:${mailTo}" target="_self">Contact Us</a>!</div> 
                        <input class="acceptBtnTermsOfUse" type="button" value="I agree">`

const notif2 = `Desktop for Instagram was developed by Unimania Inc. It is not affiliated with or endorsed by Instagram Inc. Instagramâ„¢ is a trademark of Instagram Inc. 
                        <input class="acceptBtnCopyrightNotice" type="button" value="I agree">`

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
            var mobileWidth = $(window).outerHeight() * 60 / 100
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
        document.getElementById('nav-back-btn').addEventListener("click", goStepBack);
    })
}

function goStepBack() {
    history.back();
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
