<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="shortcut icon" href="<?php echo BASE_URL(); ?>static/img/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo BASE_URL(); ?>static/css/style_pwd.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>unstableChat</title>
</head>
<body>

<div id="container">
    <div class="box">
        <form id="pass_form" method="post" action="./login.php">
            <label id="label_pwd" for="pwd"><h1>Enter your password</h1></label>
            <input type="password" name="userpass" id="pwd_input" placeholder="type your user here!" autocomplete="off">
            <input type="submit" id="submit_pwd" value="->"><br>
            <span id="feedback_message"></span>
            <input type="hidden" name="token" value="<?=$token?>">
        </form>
    </div>
</div>

<script src="<?php echo BASE_URL(); ?>static/js/scripts_pwd.js"></script>

</body>
</html>
