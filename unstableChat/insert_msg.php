<?php

session_start();

header('Content-type: application/json');

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
        
        //$result = sqlsrv_query($conn, $query, array($username, $messageText));

        $query_2 = $db->prepare("SELECT * FROM UPDATE_DIV");

        //$result_2 = sqlsrv_query($conn, $query_2);

        //$data = sqlsrv_fetch_array($result_2);

        $result_2 = $query_2->execute();
        $data = $result_2->fetchArray();

        if ($data['databaseSession'] == 1){

            $stmt_update_query = $db->prepare("UPDATE UPDATE_DIV SET databaseSession = 0");
            $stmt_update_query->execute();
            
        }

        if ($data['databaseSession'] == 0){

            $stmt_update_query = $db->prepare("UPDATE UPDATE_DIV SET databaseSession = 1");
            $stmt_update_query->execute();

        }

        $response_array['cookie_value'] = $data['databaseSession'];

        echo json_encode($response_array);

    }

}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();
    
}

?>