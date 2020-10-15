chrome.runtime.onMessage.addListener(request => {
    if (request.method ==='pageLoad'){
        console.log('<<<<<<<<hello there user - 2 !!!!!>>>>>>>')
    }
})
