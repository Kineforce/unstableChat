// Função que redireciona o usuário para a tela de login

document.getElementById("get_back").addEventListener("click", function(){

    $.ajax({
        url: 'logout',
        type: 'post',
        data: {exit: 'true'},
        dataType: 'text',
        success: function(response){
            location.reload();
        }
    });
});


$('#pass_form').submit(function(e) {

    e.preventDefault();

    pass_form = document.getElementById('pass_form');

    pass_form_button = document.getElementById('submit_pwd');
    //$(pass_form_button).attr("disabled", true);

    var formData = new FormData(pass_form);

    formData.append('pwd', '1');

    if (pass_form == ""){

        alert("You need to enter a username!");

    } else {

        $.ajax({
            type: "POST",
            url: "chat/pwd",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if (data.status == 'success'){
                    document.getElementById('feedback_message').innerHTML = 'Redirecting to unstableChat!';
                   setTimeout(function(){ 
                    window.location.replace('/everyone');
                   }, 2000);
                }else if (data.status == 'wrongpassword') {
                    document.getElementById('feedback_message').innerHTML = 'Wrong password!';
                    setTimeout(function(){ 
                        window.location.href = 'chat';
                    }, 2000);
                } else if (data.status == 'nopassword') {
                    document.getElementById('feedback_message').innerHTML = 'Insert a password!';
                }else if (data.status == 'waitforit'){
                    document.getElementById('feedback_message').innerHTML = 'You already send a request!';
                }else {
                    document.getElementById('feedback_message').innerHTML = 'Contact support!';
                    console.log(data.status);
                }
            }
        })
    }
})