// Função que checa se o scroll da div do chat está carregado
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);

// Faz um post para a update_color e retorna o username

$.ajax({
    url:'./update_color.php',
    type:'post',
    data:{retorna_username:'0'},
    dataType:'json',
    success:function(response){
        sessionStorage.setItem("username", response.username);
    }
});

// Variável que indica se está tudo scrollado

var checkbottom;

// Verifica a cada 200ms se o chat está scrollado

setInterval(function(){

    $('.message_box').on('scroll', function() {
        var check = $(this).scrollTop() + $(this).innerHeight() >= $(this) 
    [0].scrollHeight;
        if(check) {
           checkbottom = "bottom";
           $('#go_to_bottom').removeAttr("class", "fa fa-arrow-down");

           //console.log("Bottom");
        }
        else {
            checkbottom = "nobottom";
            $('#go_to_bottom').addClass("fa fa-arrow-down");
            $('#go_to_bottom').addClass("go_to_bottom");

            //console.log("No Bottom");
        }
    });

}, 200);

// Função para sleep

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

// Função que scrolla o chat, checando enquanto o chat não estiver totalmente scrollado

async function loopingScroll(){
    if ($('.message_box').hasScrollBar() == true){
        var chat_box = document.getElementsByClassName('message_box')[0];

        var i = 0;

        while (checkbottom != "bottom"){
            chat_box.scrollTop = i;
            i += 5000;
            await sleep(1);
        }

    }else {
        setTimeout(function(){
            loopingScroll();
        }, 200);
    }
    
}

// Chamada da função loopingScroll();

loopingScroll();

// Verifica se novas mensagens estão presentes no banco, e carrega elas no chat

function loadNewMessages(){

    var all_msgs = $('.inner_message');    
    var last_msg_div = $(all_msgs);

    if (last_msg_div.length == 0){

        var last_msg = 0;

    }else {

        var last_msg = last_msg_div.last()[0].id;

    }

    $.ajax({
        url:'./chat_box.php',
        type:'post',
        data:{load_last_msg:last_msg},
        dataType:'json',
        success:function(response){
 
            $('.message_box').append(response.status);

            if (response.status != ""){

                var messageBody = document.querySelector('.message_box');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

            }
        }
    });
    
    setTimeout(loadNewMessages, 200);

}

// Carrega inicialmente todas as mensagens e chama a função que verifica novas mensagens
var mainLoad = $('.message_box').load('./chat_box.php .inner_message', function(){

    loadNewMessages(); 

});

// Função que envia a mensagem pro banco de dados

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

// Função que efetua o logout do usuário

document.getElementById("logout").addEventListener("click", function(){

    $.ajax({
        url: './exit.php',
        type: 'post',
        data: {exit: 'true'},
        dataType: 'text',
        success: function(response){
            location.reload();
        }
    });
});

// Listener que escuta o botão de enviar mensagens

document.getElementById("send_msg").addEventListener("click", function(){
    sendMessageToChat();
});

// Listener que escuta a tecla enter e chama a função de enviar mensagens

document.addEventListener("keyup", function(event){

    if (event.key == "Enter"){
        sendMessageToChat();
    }

});

// Listener que escuta o botão para scrollar o chat

document.getElementById("go_to_bottom").addEventListener("click", function(){

    var messageBody = document.querySelector('.message_box');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

});

// Faz um post para o banco alterar a cor do usuário

document.getElementById('colorpicker').addEventListener("change", function(){

    var color_updated = $('#colorpicker')[0].value;
    console.log(color_updated);

    $.ajax({
        url:'./update_color.php',
        type:'post',
        data:{color_updated:color_updated},
        dataType:'json',
        success:function(response){
        }
    });
})

// Atualiza a cor do chat

setInterval(function(){

    let message_box = $('.message_box')[0];
    let message     = $('.inner_message');

    $.ajax({
        url:'./update_color.php',
        type:'post',
        data:{retorna_cores:"0"},
        dataType:'json',
        success:function(response){

            let parsed_data = JSON.parse(response.cores);
            
            for (j = 0; j<message.length; j++){

                for (k = 0; k<parsed_data.length; k++){

                    if ( message[j].getElementsByTagName('span')[0].innerText == parsed_data[k].username){

                        let color_style = parsed_data[k].color;

                        message[j].setAttribute('style', 'color: ' + color_style);
                    }
                } 
            }
            
            // Atualiza cor do colorpicker

            for (i = 0; i<message.length; i++){

                if ( message[i].getElementsByTagName('span')[0].innerText == sessionStorage.getItem("username") ){
                    $user_color = message[i].getAttribute("style").substring(7);
                    
                    $('#colorpicker').attr("value", $user_color);   
                    $('#colorpicker').removeAttr("hidden");

                    break;

                }
            }
        }
    })
}, 200);
