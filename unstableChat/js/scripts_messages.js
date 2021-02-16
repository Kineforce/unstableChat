(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);


function looping(){
    if ($('.message_box').hasScrollBar() == true){
        var chat_box = document.getElementsByClassName('message_box')[0];
        chat_box.scrollTo(0, chat_box.scrollHeight);
    }else {
        setTimeout(function(){
            looping();
        }, 10)
    }
    
}

looping();

setInterval(function(){
    $('.message_box').load('./chat_box.php .inner_message');
}, 100);

var checkbottom;

setInterval(function(){


    $('.message_box').on('scroll', function() {
        var check = $(this).scrollTop() + $(this).innerHeight() >= $(this) 
    [0].scrollHeight;
        if(check) {
           checkbottom = "bottom";
        }
        else {
            checkbottom = "nobottom";
        }
    })

}, 500);

window.setInterval(function(){

    if (checkbottom=="bottom") {
        var chat_box = document.getElementsByClassName('message_box')[0];
        chat_box.scrollTo(0, chat_box.scrollHeight);
    }

}, 500);

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
    }

})



