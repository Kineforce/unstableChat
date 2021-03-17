$("#login_form").submit(function(e) {

    e.preventDefault();

    login_form = document.getElementById('login_form')
    
    var formData = new FormData(login_form);

    formData.append('color', color_picker.value);

    if (login_form == ""){

        alert("You need to enter a username!");

    } else {
        $.ajax({
            type: "POST",
            url: "chat/login",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == 'goToPassword') {
                    window.location.replace('/pwd');
                } else if (data.status == 'emptyUsername'){
                    document.getElementById('feedback_message').innerHTML = 'Please, fulfill a valid username!';
                } else if (data.status == 'lengthUsername'){
                    document.getElementById('feedback_message').innerHTML = 'Username too big! The limit is 20 characters';
                } else if (data.status == 'missingCheckColor'){
                    document.getElementById('feedback_message').innerHTML = 'Please, reload your page!';
                } else if (data.status == 'ipException') {
                    document.getElementById('feedback_message').innerHTML = 'Only one account is allowed per IP Address!';
                } else {
                    document.getElementById('feedback_message').innerHTML = 'Please, contact support!';
                }
            } 
        }).done(function(){

        })
    }
});

color_picker = document.getElementById("colorpicker");
input = document.getElementById("login_input");

color_picker.addEventListener("change", function(){
    color_value = color_picker.value;
    input.setAttribute("style", "color:" + color_value);
})


