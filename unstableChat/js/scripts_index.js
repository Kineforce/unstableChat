$("#login_form").submit(function(e) {

    e.preventDefault();

    login_form = document.getElementById('login_form')
    
    var formData = new FormData(login_form);

    if (login_form == ""){

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
                }else if (data.status == 'invalidUser'){
                    document.getElementById('feedback_message').innerHTML = 'Please, fulfill a valid username!';
                }else if (data.status == 'usernameAlreadyTaken'){
                    document.getElementById('feedback_message').innerHTML = 'This username was already taken!';
                }

            } 
        });
    }
});