<?php

defined('BASEPATH') OR exit('No direct script access allowed');

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="shortcut icon" href="<?php echo BASE_URL(); ?>static/img/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?php echo BASE_URL(); ?>static/css/style_index.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>unstableChat</title>
</head>
<body>

<div id="container">
    <div class="box">
        <form id="login_form" method="post" action="./login.php">
            <label id="label_login" for="login_input"><h1>Enter your login</h1></label>
            <input type="text" name="username" id="login_input" placeholder="type your username here" autocomplete="off" maxlength="20">
            <input type="submit" id="submit_login" value="->"><br>
            <span id="feedback_message"></span><br>
            <input type="color" id="colorpicker" value="#ADFF2F">
        </form>
    </div>
</div>

<script src="<?php echo BASE_URL(); ?>static/js/scripts_index.js"></script>

</body>
</html>