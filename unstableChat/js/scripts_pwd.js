$('#pass_form').submit(function(e) {

    e.preventDefault();

    pass_form = document.getElementById('pass_form');

    var formData = new FormData(pass_form);

    if (pass_form == ""){

        alert("You need to enter a username!");

    } else {

        $.ajax({
            type: "POST",
            url: "./login.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == 'success'){

                    document.getElementById('feedback_message').innerHTML = 'Redirecting to unstableChat!';

                    setTimeout(function(){ 
                        window.location.href = './chat.php';
                    }, 3000);

                }else if (data.status = 'wrongpassword') {

                    document.getElementById('feedback_message').innerHTML = 'Wrong password!';
                    
                    setTimeout(function(){ 
                        window.location.href = './';
                    }, 3000);
                }
            }
        })
    }
})