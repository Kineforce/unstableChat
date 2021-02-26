// Função que checa se o scroll da div do chat está carregado
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);

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

// Carrega inicialmente todas as mensagens
var mainLoad = $('.message_box').load('./chat_box.php .inner_message'); 

// Não sei por que, mas o primeiro load na hidden-div não funciona
var firstIteration = 0;


// Compara dois arrays e retorna a diferença

function difference(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
        if (a2.indexOf(a1[i]) === -1) {
            result.push(a1[i]);
        }
    }
    return result;
}

// Verifica se novas mensagens estão presentes no banco, e carrega elas no chat

setInterval(function(){

    // Carrega em uma div escondida, as mensagens "atualizadas"
    $('.hidden-div').load('./chat_box.php .inner_message');

    // Pega os elementos carregados na div escondida
    var pureHiddenDiv = $('.hidden-div')[0].getElementsByClassName('inner_message');

    // Pega os elementos carregados inicialmente
    var pureMainLoad = $('.message_box')[0].getElementsByClassName('inner_message');

    if (firstIteration != 0){
        if (pureMainLoad.length == pureHiddenDiv.length){
            //console.log("Equal divs! Do nothing!");
        }else {
            //console.log("Differente divs! Do something!");
            string_array_hidden = [];
            string_array_main = [];

            for (i=0; i<pureHiddenDiv.length; i++){

                string_array_hidden.push(pureHiddenDiv[i].outerHTML);
                
            }

            for (i=0; i<pureMainLoad.length; i++){

                string_array_main.push(pureHiddenDiv[i].outerHTML);
                
            }
            
            result = difference(string_array_hidden, string_array_main);
        
            $('.message_box').append(result);

            var messageBody = document.querySelector('.message_box');
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            
        }
    }else {

        firstIteration =+ 1;
    
    }

    //console.log("pureMainLoad --> " + pureMainLoad.length);
    //console.log("pureHiddenDiv --> " + pureHiddenDiv.length);
    

}, 200);

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

    $.ajax({
        url:'./update_color.php',
        type:'post',
        data:{color_updated:color_updated},
        dataType:'json',
        success:function(response){
            sessionStorage.setItem("username", response.username);
            sessionStorage.setItem("color_updated", color_updated);

        }
    });
})

// Troca a cor das mensagens do usuário caso ele utiliza o botão de mudar de cor

setInterval(function(){

    if (sessionStorage.getItem("username")){

        let main_div = document.getElementsByClassName('message_box')[0];
        let all_msgs = main_div.getElementsByClassName('inner_message');
        let username = sessionStorage.getItem('username');

        for (i = 0; i<all_msgs.length; i++){

            let msg_html = all_msgs[i];
            let msg = msg_html.getElementsByTagName('span')[0].textContent;

            if (msg == username){   

                msg_html.removeAttribute("style", "color");    
                msg_html.setAttribute("style", "color: " + sessionStorage.getItem("color_updated"));    

                console.log(msg_html);          

            }
        }
    
        sessionStorage.removeItem("username");

    }

}, 200)

