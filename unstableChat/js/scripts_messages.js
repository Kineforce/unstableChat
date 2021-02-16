function sendMessageToChat(){
    
    var input_box_message = document.getElementById("input_box").value;

    if (!input_box_message){
        console.log("Empty");
    }else {

        $.ajax({
            url:'./insert_msg.php',
            type:'post',
            data:{message:input_box_message},
            dataType:'text',
            success:function(response){
                document.getElementById("input_box").value = "";
                $(document).ready(function() { /// Wait till page is loaded
                    $('.message_box').load('./chat_box.php .inner_message');
                 }); 
            }
        });
    }
}



document.getElementById("logout").addEventListener("click", function(){

    $.ajax({
        url: './exit.php',
        type: 'post',
        data: {exit: 'true'},
        dataType: 'text',
        success: function(response){
            location.reload();
        }
    })
})

document.getElementById("send_msg").addEventListener("click", function(){
    sendMessageToChat();
})

document.addEventListener("keyup", function(event){

    if (event.key == "Enter"){
        sendMessageToChat();
        document.getElementsByClassName('message_box')[0].scrollTo(0,document.body.scrollHeight);

    }

})



