chrome.runtime.onMessage.addListener(request => {
    if (request.method ==='pageLoad' && !document.querySelector('.insta_button_container')){

        let ext_styles = document.createElement('Link')
        ext_styles.rel="stylesheet"
        ext_styles.href = chrome.extension.getURL('stylesheets/index.css')
        document.querySelector('html head').append(ext_styles)

        let action_button_parent = document.querySelector('section[id*="ember"] .display-flex div.ember-view[id*="ember"].inline-flex')
        if(action_button_parent){
            appendSearchInstaButton(action_button_parent)
        }
        console.log('>>>>',chrome.extension.getURL('main.html'))
    }
})

const searchInstaButton = () => {
    let node = document.createElement("DIV");
    node.classList.add('insta_button_container')
    node.style.display='none'
    node.onclick=()=>{
        let user_name = document.querySelector('.inline.t-24.t-black.t-normal.break-words').innerText
        console.log('user_name>>>>>',user_name)
        chrome.runtime.sendMessage({grabbedUserName: user_name}, function(response) {
            console.log('message sent');
        });          
    }

    let imgNode = document.createElement('img')
    imgNode.classList.add('insta_button_img')
    imgNode.src = chrome.extension.getURL('images/instagram_icon.png')

    let buttonText = document.createElement('span')
    buttonText.classList.add('insta_button_text')
    buttonText.appendChild(document.createTextNode("Find on Instagram"))

    node.append(imgNode)
    node.append(buttonText)

    return node;
}

function appendSearchInstaButton(parent){
    console.log('from append action:', parent, searchInstaButton())
    parent.insertBefore(searchInstaButton(),parent.childNodes[0])
}