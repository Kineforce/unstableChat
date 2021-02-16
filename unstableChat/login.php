<?php

$username = $_POST['userName'];

if ($username == ""){

    $response_array['status'] = 'invalidUser';

}

if (isset($username) && $username != ""){
    
    include_once("conn.php");

    $query = "SELECT * FROM STORED_MESSAGES WHERE userName = ?;";

    $result = sqlsrv_query($conn, $query , array($username));

    $row = sqlsrv_fetch_array($result);

    if (!$row){
        $response_array['status'] = 'success';
        session_start();
        $_SESSION['username'] = $username;

    } else {
        $response_array['status'] = 'usernameAlreadyTaken';
    }
}

header('Content-type: application/json');
echo json_encode($response_array);


?>