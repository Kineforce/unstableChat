var shortPollingSpeed   = 1000;
var DOMListenerCheck    = 100;
var longPollingSpeed    = 10000;
var canTrackStatus      = false;

// Função que atualiza o status de online do usuário

(function isTabActive(){

    if (document.visibilityState == 'visible'){

        $.ajax({
            url:"updateUserStatus",
            type:"POST",
            data:{update_status: "1"},
            dataType:"JSON",
            success:function(response){

                //console.log(response.status);
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                setTimeout(isTabActive, shortPollingSpeed);

            }
        }).done(function(){

            setTimeout(isTabActive, shortPollingSpeed);

        })

    } else {

        setTimeout(isTabActive, shortPollingSpeed);

    }

})();

// Função que recupera o status do usuário do chat ativo

(function getTargetStatus(){

    if (canTrackStatus){

        $.ajax({
            url:"getUserStatus",
            type:"POST",
            data:{return_status: "1"},
            dataType:"JSON",
            success:function(response){
        
                let target_status       = "";

                try {
                    
                    let db_timestamp        = response.status[0].lastseen;
                    let db_date             = new Date(db_timestamp);
    
                    db_date                 = db_date.setHours(db_date.getHours()-3)
                    db_date                 = new Date(db_date);
                    let curr_date           = new Date();
    
                    let diffTime            = Math.abs(curr_date - db_date);
                    let limit_sec           = 5000;
    
                    console.log(curr_date);
                    console.log(db_date);
    
                    if (diffTime < limit_sec){
    
                        target_status = "<span style='color: green'>Online</span>";
    
                    } else { 
    
                        target_status = "<span style='color: black'>Offline</span>";
    
                    }
                                                
                    $('#user_status')[0].innerHTML = target_status

                } catch (err) {

                    console.log("We got an error!");

                }
               

            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                console.log("Busy database, retrying...")
                console.log("textStatus --> " + textStatus);
                setTimeout(getTargetStatus, shortPollingSpeed);
                console.log("Error GetUserStatus")

            }
        }).done(function(){

            setTimeout(getTargetStatus, shortPollingSpeed);

        })
    } else {

        setTimeout(getTargetStatus, shortPollingSpeed);

    }

})();


// Função que retorna todos os usuários cadastrados no banco

(function returnUsers(){

    $.ajax({
        url:"getUsers",
        type:"GET",
        data:{get_users: "1"},
        dataType:"JSON",
        success:function(response){
                        
            let parsed_users = response.status;
            let string_online_users = '';
            let line_user = $('.line_user');

                
                for (var value in parsed_users){

                    let sql_username = parsed_users[value].username;
            
                    sql_username = "<div class='line_user' onclick='openNewChat(this.innerText)' >" + sql_username + "</div><div class='line'></div>";     
                    string_online_users = string_online_users + sql_username;
                    
                }

                if (line_user.length < parsed_users.length) {

                    $('.user')[0].innerHTML = string_online_users;

                }

            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){

            setTimeout(isTabActive, 2000);

        }
    }).done(function(){

        setTimeout(returnUsers, 2000);

    })

})();

// Função que realiza o load da modal para cobrir a caixa de mensagens

var temp_msg = $('.chat').clone(true);

(function loadModal(){
    // Mostra o banner 

    $('.chat').replaceWith($('.modal'));
    $('.modal').show();
    
    
})();

 // Função que efetua o logout do usuário

function logoutUser(){

    $.ajax({
        url: "logout",
        type: "POST",
        data: {exit: 'true'},
        dataType: 'text',
        success: function(response){

            sessionStorage.clear();
            location.reload();
        }
    });


};

// Esconde a modal, reseta a div e carrega todas as mensagens daquele chat

var runPolling = false;

function resetAndLoad(){




    // Liberar div para o chat

    if ($('.modal').length != 0){

        $('.modal').replaceWith(temp_msg);
        $('.modal').hide();

    }

    // Reseta a message_box

    var firstAjax = $.ajax({
        type: "GET",
        url: "getMessages",
        data: {targetUser: sessionStorage.getItem('targetUser')},
        dataType: 'json',
        async: false,
        success: function(response){

            if (response.status != "nothing"){
                
                let msgResponse = response.status;

                $('.message_box')[0].innerHTML = msgResponse;

                scrollToBottom();
                filterDates();

                runPolling = true;

            } else {

                $('.message_box')[0].innerHTML = "";
        
                runPolling = false;

            }

        }
    })

    let user_header = $('#user_header')[0].innerText;

    if ( user_header != sessionStorage.getItem('targetUser')){

        $('#user_header')[0].innerText = sessionStorage.getItem('targetUser');
        
    }

    canTrackStatus = true;

};

// Verifica se novas mensagens estão presentes no banco, e carrega elas no chat

(function loadNewMessages(){

    if (runPolling){
        
        //("Run polling is working!");

        let run_ajax = true;
        let all_msgs = $('.chat_line');    
        let last_msg = 0

        try {

            last_msg = all_msgs.last()[0].id;

        } catch (err) {

            run_ajax = false;

        }

        if (sessionStorage.getItem('targetUser')){

            targetUser = sessionStorage.getItem('targetUser')

        } 

        if (run_ajax){

            //console.log("Run polling is working!");

            $.ajax({
                url:"getMessages",
                type:"GET",
                data:{
                    load_last_msg: last_msg,
                    targetUser: targetUser
                },
                dataType:"JSON",
                success:function(response){
                    
                    //(response.status);

                    if (response.status != "nothing"){

                        $('.message_box').append(response.status);

                    }
                
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){

                    //console.log("Busy database, retrying...")
                    //console.log("textStatus --> " + textStatus);
                    setTimeout(loadNewMessages, shortPollingSpeed);

                }
                
            }).done(function(){

                setTimeout(loadNewMessages, shortPollingSpeed);

            })

        } else {

            setTimeout(loadNewMessages, shortPollingSpeed);

        }

    } else {

        setTimeout(loadNewMessages, shortPollingSpeed);

    }

})();

// Atualiza a cor do chat baseado em um json vindo do backend

(function updateColorChat(){

    if (runPolling){

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
                        $('#colorpicker').removeAttr("style");

                        break;

                    }
                }
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                //console.log("Busy database, retrying...")
                setTimeout(updateColorChat, shortPollingSpeed);

            }
        }).done(function() {

            setTimeout(updateColorChat, shortPollingSpeed);

        })
    } else {

        setTimeout(updateColorChat, shortPollingSpeed);

    }

})();

// Criando observer que observa a caixa de mensagens e executa funções

(function messageBoxObserver(){

    if (runPolling) {

        const targetNode = document.getElementsByClassName('message_box')[0];
        const config = { childList: true};

        const callback = function(mutationsList, observer){
        
            for (const mutation of mutationsList) {
                if(mutation.type === 'childList'){
                    filterDates();
                }
                if(mutation.type === 'childList' && isBottom){
                    var messageBody = document.querySelector('.message_box');
                    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
                }
                
            }
        }

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

    } else {

        setTimeout(messageBoxObserver, DOMListenerCheck);

    }

})();

// Função que ordena as mensagens pelo dia em que foram enviadas

function filterDates(){
 
    // Coleta todas as mensagens se houver mensagens
    let msg_dates = $('.msg_date');

    if (msg_dates.length > 0){

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
}      

// Função que checa se o usuário está no bottom ou top do chat

let isBottom = false;

(function checkBottom(){

    if (runPolling) {
        
        let message_box     = $('.message_box')[0];
        let scrollHeight    = message_box.scrollHeight
        let scrollTop       = Math.abs(message_box.scrollTop)
        let clientHeight    = message_box.clientHeight

        let m_scrollHeight    = scrollHeight
        let m_scrollTop       = scrollTop
        let m_clientHeight    = clientHeight + 100

        isBottom = ( (m_scrollHeight - m_scrollTop) <= m_clientHeight) ? true : false;

        setTimeout(checkBottom, DOMListenerCheck);

    } else {

        setTimeout(checkBottom, DOMListenerCheck);

    }

})();

// Função que checa se houve uma mudança na height da div e scrolla para o bottom

(function checkDivResize(new_height){

    if (runPolling){

        let message_box = $('.message_box')[0];
        let boxHeight = message_box.offsetHeight

        if (new_height != boxHeight  && isBottom){
            scrollToBottom();
        }

        setTimeout(checkDivResize.bind(null, boxHeight), DOMListenerCheck);

    } else {

        setTimeout(checkDivResize, DOMListenerCheck);

    }

})();

// Função que envia a mensagem pro banco de dados

function sendMessageToChat(){
        
    let input_box_message = $('#input_box').val().trimStart().trimEnd();
    document.getElementById("input_box").value = "";

    $.ajax({
        url:"setNewMessage",
        type:"POST",
        data:{message:input_box_message},
        dataType:"JSON",
        success:function(response){

        }
    })
}


//Faz um post para o banco alterar a cor do usuário

function changeColor(){

    var color = $('#colorpicker')[0].value;

    $.ajax({
        url:"setUserColor",
        type:"POST",
        data:{color:color},
        dataType:"JSON",
        success:function(response){
        }
    });

};

// Listener que escuta a tecla enter e chama a função de enviar mensagens

document.addEventListener("keyup", function(event){
    
    if (event.key == "Enter" && !event.shiftKey){
        sendMessageToChat();
    }

});

//Listener que escuta o botão para scrollar o chat

function scrollToBottom(){

    var messageBody = document.querySelector('.message_box');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

};



$(document).ready(function() {

    if (sessionStorage.getItem('targetUser')){

        resetAndLoad();
    }

});

// Função que abre uma nova conversa na message_box

function openNewChat(username){
    
    // Apenas se tiver tiver inicializado a janela pela primeira vez ou se trocou de janelas 

    if (username != sessionStorage.getItem('targetUser')){

        // Unsets de variáveis

        sessionStorage.clear();

        // --------------------

        // Seta o usuário clicado na session para ser o receptor de mensagens
        sessionStorage.setItem('targetUser', username);

        // Recupera o username do usuário logado 

        $.ajax({
            type: "GET",
            url: "getUsername",
            data: {retorna_username: 1},
            dataType: 'json',
            success: function(response){

                // Seta o username do usuário na session
                sessionStorage.setItem('username', response.username);
            }
        }).then(function(){

            // Chama a função para resetar o chat e carregar novas mensagens
            
            resetAndLoad();

        })

    }

}