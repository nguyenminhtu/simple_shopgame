$(document).ready(function(){
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 300);
        return false;
    });

    $('#back-to-top').tooltip('show');


    $('#username-signup').blur(function () {
        var username = $(this).val();
        $.ajax({
            url: '/users/check/'+username,
            type: 'GET',
            success: function (data) {
                if(data === 'match'){
                    $("#checkUsername").html('Username is already registered.').css('color','red').css('margin-left','10px').css('margin-top','5px');
                    $('#username-signup').select();
                }else if(data === 'notMatch'){
                    $("#checkUsername").html('Username is valid').css('color','green').css('margin-left','10px').css('margin-top','5px');
                }
            }
        });
    });

    $("ul.success").fadeOut(10000);

});