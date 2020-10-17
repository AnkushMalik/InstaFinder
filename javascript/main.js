$(window).on('load', function(){
    var name_query = window.location.search.split('=').pop();

    $.ajax({
        type:'GET',
        url: `https://www.instagram.com/web/search/topsearch/?context=blended&query=${name_query}`,
        success: (response) => {
            console.log(response, JSON.stringify(response.users))
            response.users.forEach((e,i)=>{ //will modify in future commits to render users properly with name,dp and follow btns
                $('body').append(`<p>${e.user.username}</p>`);
            })
        },
        error: (request, status, error) => {
            alert('Something went wrong while communicating with instagram. Please try again.')
        }
    });
});
