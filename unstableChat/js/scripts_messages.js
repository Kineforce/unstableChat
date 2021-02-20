(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

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

}, 200);

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function looping(){
    if ($('.message_box').hasScrollBar() == true){
        var chat_box = document.getElementsByClassName('message_box')[0];

        var i = 0;

        while (checkbottom != "bottom"){
            chat_box.scrollTop = i;
            i += 50;
            await sleep(1);
        }

 
    }else {
        setTimeout(function(){
            looping();
        }, 200)
    }
    
}

looping();

if (sessionStorage.getItem('js_isUpdated') === null){
    sessionStorage.setItem('js_isUpdated', 1);
    $('.message_box').load('./chat_box.php .inner_message');

}else {
    $('.message_box').load('./chat_box.php .inner_message');

}

var input_box_message = document.getElementById("input_box").value;

(function update() {

    $.ajax({
        url:'./verify.php',
        type:'post',
        data:{message:input_box_message},
        dataType:'json',
        success:function(response){
            sessionStorage.setItem('realTime', response.realTime);
        }
    }).then(function() {
        setTimeout(update, 200);
    })
})();

setInterval(function(){

    js_session = sessionStorage.getItem('js_isUpdated');
    realTime = sessionStorage.getItem('realTime');

    var aux = true;

    if (sessionStorage.getItem('js_isUpdated') == 1){
        aux = false;

    }

    if (js_session == realTime){
        $('.message_box').load('./chat_box.php .inner_message');

        if (aux == false){
            sessionStorage.setItem("js_isUpdated", 0);
        }else{
            sessionStorage.setItem("js_isUpdated", 1);
        }
    }   
}, 200);

window.setInterval(function(){

    if (checkbottom=="bottom") {
        var chat_box = document.getElementsByClassName('message_box')[0];
        chat_box.scrollTo(0, chat_box.scrollHeight);
    }

}, 500);

function sendMessageToChat(){
    
    var input_box_message = document.getElementById("input_box").value;

    if (!input_box_message){
    }else {

        $.ajax({
            url:'./insert_msg.php',
            type:'post',
            data:{message:input_box_message},
            dataType:'json',
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



