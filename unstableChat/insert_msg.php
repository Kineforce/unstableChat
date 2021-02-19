<?php

session_start();

if ($_SESSION['username'] != ""){

    include_once 'conn.php';

    $username = $_SESSION['username'];
    $messageColor = $_SESSION['color'];
    $messageText = $_POST['message'];

    $query = " INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText)
               VALUES (?, getdate(), ?) ";

    $result = sqlsrv_query($conn, $query, array($username, $messageText));

    $_COOKIE['new_message'] = true;

}else {
    header("Location: http://localhost:8000/");
    exit();
}

?>