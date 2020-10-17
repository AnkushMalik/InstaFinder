$(window).on('load', function(){
    var name_query = window.location.search.split('=').pop();
    
    function getAndSetInstaCookies() {
        const instaFirstCookie = localStorage.getItem('insta_first') ? localStorage.getItem('insta_first') : Date.now()
        const instaCountCookie = localStorage.getItem('insta_count') ? parseInt(localStorage.getItem('insta_count')) : 0
        localStorage.setItem('insta_first', instaFirstCookie);
        localStorage.setItem('insta_count', instaCountCookie + 1);
    }

    getAndSetInstaCookies();

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

    name_query && $.ajax({
        type:'GET',
        url: `https://www.instagram.com/web/search/topsearch/?context=blended&query=${name_query}`,
        success: (response) => {
            console.log(response, JSON.stringify(response.users))
            response.users.forEach((e,i)=>{ //will modify in future commits to render users properly with name,dp and follow btns
                // $('body').append(`<p>${e.user.username}</p>`);
                console.log(e.user.username)
            })
        },
        error: (request, status, error) => {
            alert('Something went wrong while communicating with instagram. Please try again.')
        }
    });
});
