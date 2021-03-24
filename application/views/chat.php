<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="shortcut icon" href="<?php echo BASE_URL(); ?>static/img/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo BASE_URL(); ?>static/css/style_messages.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>unstableChat</title>
</head>

<body>  
    <div class="container">
        <div class="box">
            <div class="left-side">
                <div class="online_users">
                <div class="title_div">
                    <span>Chat</span>
                </div>    
                <div class="user css_scroll"> 
                </div>
            </div>
            </div> 
            <div class="right-side">
                <div class="chat">      
                    <div class="message_box css_scroll" hidden>                                                                       
                    </div>   
                    <div class="insert_box">
                        <textarea name="message" id="input_box" placeholder="start typing..." rows="1" cols="50" autocomplete="off"></textarea>
                        <div class="username_info">
                        <label class="username_info_span" for="logout">You are logged in as: <?=htmlspecialchars($_SESSION['username'])?></label>
                        <button class="logout" id="logout" onclick="logoutUser();">Logout</button>
                        <label for="colorpicker"></label>
                        <input type="color" id="colorpicker" hidden>
                        <div id="go_to_bottom" class="fa fa-angle-double-down">
                        </div>
                    </div>   
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal" style="display: none">
            <h1>Open a new chat and have fun!</h1><br>
            <h2>made by: Kineforce</h2>
        </div>

        <!-- /.modal -->

    </div>

    <script src="<?php echo BASE_URL(); ?>static/js/scripts_messages.js"></script>
        
</body>
</html>



        

            

           


                   

