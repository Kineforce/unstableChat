<?php

if (isset($_SESSION['username'])){

    header('Content-type: application/json');

    $db = new SQLite3('messages.db');

    if ( !$db ){
        $response_array['status'] = "You got a error!";
        echo json_encode($response_array);
        die();

    } else {

        $create_stored_messages = $db->prepare( "   CREATE TABLE IF NOT EXISTS STORED_MESSAGES (
                                                    messageId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                                    userName TEXT NOT NULL,
                                                    messageStamp TEXT NOT NULL,
                                                    messageText TEXT NOT NULL
                                                
                                                )");

        $create_stored_messages->execute();    

        $create_users_table      = $db->prepare( "  CREATE TABLE IF NOT EXISTS USERS (
                                                    userId INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    userPwd TEXT NOT NULL,
                                                    userColor TEXT NOT NULL,
                                                    userName TEXT NOT NULL
                                                
                                                )");

        $create_users_table->execute(); 

    }
        
} else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}

?>