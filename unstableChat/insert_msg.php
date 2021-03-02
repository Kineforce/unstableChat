<?php

session_start();

header('Content-type: application/json; charset=utf-8' );

if (isset($_SESSION['isValidated'])){

    include_once 'conn.php';

    $username = $_SESSION['username'];
    $messageText = $_POST['message'];

    if ($messageText != ""){

        $stmt_insert_message = $db->prepare(" INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText)
        VALUES (?, CURRENT_TIMESTAMP, ?) ");

        $stmt_insert_message->bindValue(1, $username);
        $stmt_insert_message->bindValue(2, $messageText);

        $result_insert_message = $stmt_insert_message->execute();

        $response_array['status'] = 'success';
        echo json_encode($response_array['status']);
        
    }

}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();
    
}

?>