// Função que checa se o usuário está no bottom ou top do chat

let isBottom = false;

(function checkBottom(){

    let message_box     = $('.message_box')[0];
    let scrollHeight    = message_box.scrollHeight
    let scrollTop       = Math.abs(message_box.scrollTop)
    let clientHeight    = message_box.clientHeight

    let m_scrollHeight    = scrollHeight
    let m_scrollTop       = scrollTop
    let m_clientHeight    = clientHeight + 100

    isBottom = ( (m_scrollHeight - m_scrollTop) <= m_clientHeight) ? true : false;

    setTimeout(checkBottom, 200);

})();

// Função que checa se houve uma mudança na height da div e scrolla para o bottom

(function checkDivResize(new_height){

    let message_box = $('.message_box')[0];
    let boxHeight = message_box.offsetHeight

    if (new_height != boxHeight){
        var messageBody = document.querySelector('.message_box');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }

    setTimeout(checkDivResize.bind(null, boxHeight), 200);

})();

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

// Função para sleep

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

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

            if (response.status != "" && isBottom){

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

//Listener que escuta o botão para scrollar o chat

document.getElementById("go_to_bottom").addEventListener("click", function(){

    var messageBody = document.querySelector('.message_box');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

});

//Faz um post para o banco alterar a cor do usuário

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

                    if ( message[j].getElementsByClassName('username')[0].innerText == parsed_data[k].username){

                        let color_style = parsed_data[k].color;

                        message[j].getElementsByClassName('username')[0].setAttribute('style', 'color: ' + color_style);
                    }
                } 
            }
            
            // Atualiza cor do colorpicker

            for (i = 0; i<message.length; i++){

                if ( message[i].getElementsByClassName('username')[0].innerText == sessionStorage.getItem("username") ){

                    let user_color = message[i].getElementsByClassName("username")[0].getAttribute("style").substring(7);
            
                    $('#colorpicker').attr("value", user_color);   
                    $('#colorpicker').removeAttr("hidden");

                    break;

                }
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            console.log("Busy database, retrying...")
            setTimeout(updateColorChat, 300);

        }
    }).done(function() {

        ("Color changed!")
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

                        sql_username = "<div class='line_user' style='color: green'>" + sql_username + "</div><div class='line'></div>";

                    } else { 

                        sql_username = "<div class='line_user' style='color: black'>" + sql_username + "</div><div class='line'></div>";
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

// Criando observer que observa a caixa de mensagens e notifica quando novas mensagens chegaram

(function messageBoxObserver(){

    const targetNode = document.getElementsByClassName('message_box')[0];

    const config = { childList: true};
    
    const callback = function(mutationsList, observer){
    
        for (const mutation of mutationsList) {
            if(mutation.type === 'childList'){
                filterDates();
            }
        }
    }
    
    const observer = new MutationObserver(callback);
    
    observer.observe(targetNode, config);

})();

// Função que ordena as mensagens pelo dia em que foram enviadas

function filterDates(){

    // Coleta todas as mensagens
    let msg_dates = $('.msg_date');

    // Cria o array auxiliar para as datas das mensagens

    let aux_msg_date = {};

    aux_msg_date = {
        'day'   : new Date(msg_dates[0].getAttribute('value')).getUTCDate(),
        'month' : new Date(msg_dates[0].getAttribute('value')).getMonth(),
        'year'  : new Date(msg_dates[0].getAttribute('value')).getFullYear()
    };

    msg_dates[0].removeAttribute('style');

    for (i = 0; i < msg_dates.length; i++){

        curr_msg_date = {
            'day'   : new Date(msg_dates[i].getAttribute('value')).getUTCDate(),
            'month' : new Date(msg_dates[i].getAttribute('value')).getMonth(),
            'year'  : new Date(msg_dates[i].getAttribute('value')).getFullYear()
        }

        if (aux_msg_date.year != curr_msg_date.year || aux_msg_date.month != curr_msg_date.month || aux_msg_date.day != curr_msg_date.day){

            msg_dates[i].removeAttribute('style');  
            aux_msg_date = curr_msg_date;

        }

    }

}
