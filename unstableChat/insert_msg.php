<?php

session_start();

if ($_SESSION['username'] != ""){

    include_once 'conn.php';

    $username = $_SESSION['username'];
    $messageText = $_POST['message'];

    $query = " INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText)
               VALUES (?, getdate(), ?) ";

    $result = sqlsrv_query($conn, $query, array($username, $messageText));


    header('Content-type: application/json');

    $query_2 = "SELECT * FROM UPDATE_DIV";

    $result_2 = sqlsrv_query($conn, $query_2);

    $data = sqlsrv_fetch_array($result_2);

    if ($data['database_session'] == 1){

        $query_2 = "UPDATE UPDATE_DIV SET DATABASE_SESSION = 0";

        $result_2 = sqlsrv_query($conn, $query_2);

    }

    if ($data['database_session'] == 0){

        $query_2 = "UPDATE UPDATE_DIV SET DATABASE_SESSION = 1";

        $result_2 = sqlsrv_query($conn, $query_2);

    }

    $response_array['cookie_value'] = $data['database_session'];

    echo json_encode($response_array);

}else {
    header("Location: http://localhost:8000/");
    exit();
}

?>