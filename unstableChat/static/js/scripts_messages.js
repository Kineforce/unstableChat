// Função que checa se o scroll da div do chat está carregado

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);

// Faz um get para o controlador e retorna o username

$.ajax({
    url:'getUsername',
    type:"GET",
    data:{retorna_username:'1'},
    dataType:"JSON",
    success:function(response){

        sessionStorage.setItem("username", response.username);
        
    }
}).done(function(){
    setTimeout(isTabActive, 200);
})

// Variável que indica se está tudo scrollado

var checkbottom;
                
// Verifica a cada 200ms se o chat está scrollado

(function checkScroll(){

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
    
    setTimeout(checkScroll, 200);

})();

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

(function loadNewMessages(){

    var all_msgs = $('.chat_line');    
    var last_msg_div = $(all_msgs);

    if (last_msg_div.length == 0){

        var last_msg = 0;

    }else {

        var last_msg = last_msg_div.last()[0].id;

    }

    $.ajax({
        url:"getMessages",
        type:"GET",
        data:{load_last_msg:last_msg},
        dataType:"JSON",
        success:function(response){
 
            $('.message_box').append(response.status);

            if (response.status != "" && checkbottom == "bottom"){

                var messageBody = document.querySelector('.message_box');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            //console.log("Busy database, retrying...")
            //console.log(XMLHttpRequest);
            //console.log(errorThrown);
            //console.log(textStatus);
            setTimeout(loadNewMessages, 300);

        }
    }).done(function(){

        //console.log("Messages loaded!")
        setTimeout(loadNewMessages, 200);

    })

})();

// Função que envia a mensagem pro banco de dados

function sendMessageToChat(){
    
    //let input_box_message = $('#input_box').val().trimStart().trimEnd().replaceAll(' ', '&nbsp');

    let input_box_message = $('#input_box').val().trimStart().trimEnd();
    document.getElementById("input_box").value = "";

    $.ajax({
        url:"setNewMessage",
        type:"POST",
        data:{message:input_box_message},
        dataType:"JSON",
        success:function(response){

            //console.log(response.status);

        }
    })

    //console.log("Message sent!")
}

// Função que efetua o logout do usuário

document.getElementById("logout").addEventListener("click", function(){

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

// Listener que escuta a tecla enter e chama a função de enviar mensagens

document.addEventListener("keyup", function(event){

    if (event.key == "Enter" && !event.shiftKey){
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

    var color = $('#colorpicker')[0].value;

    $.ajax({
        url:"setUserColor",
        type:"POST",
        data:{color:color},
        dataType:"JSON",
        success:function(response){
        }
    });

    //
})

// Atualiza a cor do chat baseado em um json vindo do backend

function updateColorChat(){

    let message = $('.chat_line');

    $.ajax({
        url:"getColorMessages",
        type:"GET",
        data:{retorna_cores:"1"},
        dataType:"JSON",
        success:function(response){

            let parsed_data = response.cores;
            
            for (j = 0; j<message.length; j++){

                for (k = 0; k<parsed_data.length; k++){

                    if ( message[j].getElementsByTagName('span')[1].innerText == parsed_data[k].username){

                        let color_style = parsed_data[k].color;

                        message[j].getElementsByClassName('username')[0].setAttribute('style', 'color: ' + color_style);
                    }
                } 
            }
            
            // Atualiza cor do colorpicker

            for (i = 0; i<message.length; i++){

                if ( message[i].getElementsByTagName('span')[1].innerText == sessionStorage.getItem("username") ){

                    let user_color = message[i].getElementsByClassName("username")[0].getAttribute("style").substring(7);
            
                    $('#colorpicker').attr("value", user_color);   
                    $('#colorpicker').removeAttr("hidden");

                    break;

                }
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            //console.log("Busy database, retrying...")
            setTimeout(updateColorChat, 300);

        }
    }).done(function() {

        //("Color changed!")
        setTimeout(updateColorChat, 200);

    })

}

// Chama função acima

$(document).ready(function(){

    updateColorChat();

});

function isTabActive(){

    if (document.visibilityState == 'visible'){

        $.ajax({
            url:"getUserStatus",
            type:"POST",
            data:{

               update_status: "1"
                
                },
            dataType:"JSON",
            success:function(response){
                
                let parsed_users = response.status;

                let string_online_users = '';

                for (var value in parsed_users){

                    let sqlite_timestamp     = parsed_users[value].lastSeen;
                    let sqlite_date          = new Date(sqlite_timestamp);

                    sqlite_date.setHours(sqlite_date.getHours() - 3);
                    sqlite_timestamp        = sqlite_date.toLocaleString();

                    let curr_date           = new Date();
                    let diffTime            = Math.abs(curr_date - sqlite_date);
                    let sql_username        = parsed_users[value].username;
                    let last_seen           = diffTime;
                    let five_sec            = 5 * 1000;
                                       
                    if (last_seen < five_sec){

                        sql_username = "<div class='line_user' style='color: #37ff00'>" + sql_username + "</div>";

                    } else { 

                        sql_username = "<div class='line_user' style='color: grey'>" + sql_username + "</div>";
                    }
                         
                    string_online_users = string_online_users + sql_username;

                }

                $('.user')[0].innerHTML = string_online_users;

                //console.log(response.status);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                // console.log("Erro!")
                // console.log(XMLHttpRequest);
                // console.log(errorThrown)
                // console.log(textStatus);

                setTimeout(isTabActive, 2000);

            }
        }).done(function(){

            setTimeout(isTabActive, 2000);

        })

    } else {

        setTimeout(isTabActive, 2000);

    }

}
