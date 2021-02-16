<?php

session_start();

if ($_SESSION['username'] != ""){

    include_once 'conn.php';

    $username = $_SESSION['username'];
    $messageText = $_POST['message'];
    $messageColor = 'white';


    $query = " INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText, messageColor)
               VALUES ('$username', getdate(), '$messageText', '$messageColor') ";

  
    $result = sqlsrv_query($conn, $query);

}else {
    header("Location: http://localhost:8000/");
    exit();
}

?>