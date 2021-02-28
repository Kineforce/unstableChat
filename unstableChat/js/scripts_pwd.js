$('#pass_form').submit(function(e) {

    e.preventDefault();

    pass_form = document.getElementById('pass_form');

    pass_form_button = document.getElementById('submit_pwd');
    $(pass_form_button).attr("disabled", true);

    var formData = new FormData(pass_form);

    formData.append('pwd', '1');

    if (pass_form == ""){

        alert("You need to enter a username!");

    } else {

        $.ajax({
            type: "POST",
            url: "./login.php",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if (data.status == 'success'){
                    document.getElementsByClassName('feedback_message')[0].innerHTML = 'Redirecting to unstableChat!';
                    setTimeout(function(){ 
                        window.location.href = './chat.php';
                    }, 2000);
                }else if (data.status == 'wrongpassword') {
                    document.getElementsByClassName('feedback_message')[0].innerHTML = 'Wrong password!';
                    setTimeout(function(){ 
                        window.location.href = './';
                    }, 2000);
                } else if (data.status == 'nopassword') {
                    document.getElementsByClassName('feedback_message')[0].innerHTML = 'Insert a password!';
                }else if (data.status == 'waitforit'){
                    document.getElementsByClassName('feedback_message')[0].innerHTML = 'You already send a request!';
                }else {
                    document.getElementsByClassName('feedback_message')[0].innerHTML = 'Contact support!';
                }
            }
        })
    }
})