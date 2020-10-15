chrome.runtime.onMessage.addListener(request => {
    if (request.method ==='pageLoad'){
        let action_button_parent = document.querySelector('section[id*="ember"] .display-flex div.ember-view[id*="ember"].inline-flex')
        if(action_button_parent){
            appendSearchInstaButton(action_button_parent)
        }
        console.log('>>>>',chrome.extension.getURL('test.html'))
    }
})

const searchInstaButton = () => {
    let node = document.createElement("DIV");
    node.classList.add('insta_button_container')

    let imgNode = document.createElement('img')
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
}