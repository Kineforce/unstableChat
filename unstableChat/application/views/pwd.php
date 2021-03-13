<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="application\views\img\favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="application\views\css\style_index.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>unstableChat</title>
</head>
<body>

<div class="container">
    <form id="pass_form" method="post" action="./login.php">
        <label id="label_pwd" for="pwd"><h1>Enter your password</h1></label>
        <input type="password" name="userpass" id="pwd_input" placeholder="type your user here!" autocomplete="off">
        <span id="feedback_message"></span>
        <input type="hidden" name="token" value="<?=$token?>">
        <input type="submit" id="submit_pwd" value="Send it!">
    </form>
</div>

<script src="application\views\js\scripts_pwd.js"></script>

</body>
</html>
