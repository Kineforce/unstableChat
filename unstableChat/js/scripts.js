function sendMessageToChat(){
    
    input_box_message = document.getElementById("input_box").value;

    if (!input_box_message){
        console.log("Empty");
    }else {

        var message_box = document.getElementsByClassName("message_box")[0];
        var message_div = document.createElement("div");

        message_div.className = "inner_message";
        message_div.innerHTML = input_box_message;
        message_box.appendChild(message_div);
    
        document.getElementById("input_box").value = "";

    }
}

document.getElementById("send_msg").addEventListener("click", function(){
    sendMessageToChat();
})

document.addEventListener("keyup", function(event){

    if (event.key == "Enter"){
        sendMessageToChat();
    }

})



