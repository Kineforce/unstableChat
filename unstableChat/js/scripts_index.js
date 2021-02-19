
color_picker = document.getElementById("colorpicker");
input = document.getElementById("login_input");

color_picker.addEventListener("change", function(){
    color_value = color_picker.value;
    input.setAttribute("style", "color:" + color_value);
})


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
            url: "./login.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == 'gotopwd'){
   
                    window.location.href = './pwd.php';

                }else if (data.status == 'password'){
                    console.log("Password validated!");
                }else if (data.status == 'invalidUser'){
                    document.getElementById('feedback_message').innerHTML = 'Please, fulfill a valid username!';
                }else if (data.status == 'usernameAlreadyTaken'){
                    document.getElementById('feedback_message').innerHTML = 'This username was already taken!';
                }

            } 
        });
    }
});
