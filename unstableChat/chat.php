<?php

session_start();


if ($_SESSION['username'] != ""){

include_once 'conn.php';

$query = "SELECT * FROM STORED_MESSAGES";

$result = sqlsrv_query($conn, $query);

$style = 'style="color: ';


?>    
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="static/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="css/style_messages.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>unstableChat</title>
</head>
<body>

<div class="container">

    <div class="chat">
        <div class="message_box">
        </div>    
        <div class="insert_box">
            <span id="input_msg" >Insert your message: </span>
            <input type="text" name="message" id="input_box" placeholder="start typing...">
            <button name="data" id="send_msg">Send it!</button>
        </div>
        <div class="username_info">
            <span class="username_info_span">You are logged in as: <?=$_SESSION['username']?></span>
            <div class="logout"><span id="logout">Logout<span></div>
        </div>
    </div>
</div>


<script src="js/scripts_messages.js"></script>

</body>
</html>

<?php
}else {

    header("Location: http://localhost:8000/");
    exit();

}


?>