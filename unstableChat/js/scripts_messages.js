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
}).done(function(){
    setTimeout(isTabActive, 2000);
})

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
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            //console.log("Busy database, retrying...")
            setTimeout(loadNewMessages, 500);


        }
    }).done(function(){

        //console.log("Messages loaded!")
        setTimeout(loadNewMessages, 200);

    })

}

// Carrega inicialmente todas as mensagens e chama a função que verifica novas mensagens
var mainLoad = $('.message_box').load('./chat_box.php .inner_message', function(){

    loadNewMessages(); 

});

// Função que envia a mensagem pro banco de dados

function sendMessageToChat(){
    
    let input_box_message = $('#input_box').val().trimStart().trimEnd().replaceAll(' ', '&nbsp');

    $.ajax({
        url:'./insert_msg.php',
        type:'post',
        data:{message:input_box_message},
        dataType:'json',
        success:function(response){

        }
    }).then(function(){
        document.getElementById("input_box").value = "";
    })

    //console.log("Message sent!")
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

    var color_updated = $('#colorpicker')[0].value;

    $.ajax({
        url:'./update_color.php',
        type:'post',
        data:{color_updated:color_updated},
        dataType:'json',
        success:function(response){
            
        }
    });

    //console.log("Color sent!")

})

// Atualiza a cor do chat baseado em um json vindo do backend

function updateColorChat(){

    let message = $('.inner_message');

    $.ajax({
        url:'./update_color.php',
        type:'post',
        data:{retorna_cores:"0"},
        dataType:'json',
        success:function(response){

            let parsed_data = JSON.parse(response.cores);
            
            for (j = 0; j<message.length; j++){

                for (k = 0; k<parsed_data.length; k++){

                    if ( message[j].getElementsByTagName('span')[1].innerText == parsed_data[k].username){

                        let color_style = parsed_data[k].color;

                        message[j].setAttribute('style', 'color: ' + color_style);
                    }
                } 
            }
            
            // Atualiza cor do colorpicker

            for (i = 0; i<message.length; i++){

                if ( message[i].getElementsByTagName('span')[1].innerText == sessionStorage.getItem("username") ){

                    $user_color = message[i].getAttribute("style").substring(7);
                    
                    $('#colorpicker').attr("value", $user_color);   
                    $('#colorpicker').removeAttr("hidden");

                    break;

                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            //console.log("Busy database, retrying...")
            setTimeout(updateColorChat, 500);

        }
    }).done(function() {

        //console.log("Color changed!")
        setTimeout(updateColorChat, 1000);

    })

}

// Chama função acima

$(document).ready(function(){

    updateColorChat();

});

function isTabActive(){

    if (document.visibilityState == 'visible'){

        let username = sessionStorage.getItem("username");

        $.ajax({
            url:'./verify_status.php',
            type:'post',
            data:{

                username:username,
                setLastStamp:'1'
                
                },
            dataType:'json',
            success:function(response){

                let parsed_users = JSON.parse(response.status);
                let string_online_users = '';

                for (var value in parsed_users){

                    // Recebe timestamp do banco em UTC
                    let sqlite_timestamp = parsed_users[value].lastSeen;

                    // Converte o dado para objeto date do js
                    let sqlite_date = new Date(sqlite_timestamp);

                    // Subtrai 3 horas para o gmt de brasília
                    sqlite_date.setHours(sqlite_date.getHours() - 3);

                    // Converte para data no formato string
                    sqlite_timestamp = sqlite_date.toLocaleString();

                    // Recebe a data atual do usuário
                    let curr_date   = new Date();

                    // Calcula a diferença entre a data do banco e a data atual do usuário
                    let diffTime = Math.abs(curr_date - sqlite_date);

                    // Recebe o username do banco
                    let sql_username = parsed_users[value].username;

                    // Atribui a diferença à variavel last_seen
                    let last_seen = diffTime;

                    let five_sec = 5 * 1000;
                    let minute = 60 * 1000;
                    let ten_minutes = 600 * 1000;
                    let hour = ten_minutes * 6;
                    let two_hour = hour * 2;
                    let day = hour * 24;
                    
                    if (last_seen < five_sec){

                        last_seen = "<span style='color: darkgreen'>online</span>";

                    } else if (last_seen >= five_sec && last_seen < minute){

                        last_seen = "<span style='color: darkgrey'>offline</span>";

                    } else if (last_seen >= minute && last_seen < ten_minutes) {

                        last_seen = "<span style='color: grey'>a minute ago</span>";

                    } else if (last_seen >= ten_minutes && last_seen < hour) {

                        last_seen = "<span style='color: grey'>10 minutes ago</span>";

                    } else if (last_seen >= hour && last_seen < two_hour){

                        last_seen = "<span style='color: grey'>a hour ago</span>";

                    } else if (last_seen >= two_hour && last_seen < day){

                        last_seen = "<span style='color: grey'>today</span>";

                    } else if (last_seen >= day && last_seen < (day * 2)){

                        last_seen = "<span style='color: grey'>yesterday</span>";

                    } else {
                        
                        last_seen = "<span style='color: grey'>more than two days</span>";

                    }
        
                    string_online_users = string_online_users + "<li>" + sql_username + ": <br>" + last_seen + " </li>";

                }

                $('.user')[0].innerHTML = string_online_users;

            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                console.log("Erro em dar update yes!")
                console.log(XMLHttpRequest);
                console.log(errorThrown)
                console.log(textStatus);

                setTimeout(isTabActive, 2000);

            }
        })

    } 

    setTimeout(isTabActive, 2000);

}
