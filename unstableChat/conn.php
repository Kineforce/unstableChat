<?php

if (isset($_SESSION['username'])){

        
    header('Content-type: application/json');

    /*$serverName = "PROMITERE\\SQLEXPRESS"; 
    $connectionInfo = array( "Database"=>"messages");

    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( !$conn ) {
        echo "Connection could not be established.<br />";
    }*/

    $db = new SQLite3('messages.db');

    if ( !$db ){
        $response_array['status'] = "You got a error!";
        echo json_encode($response_array);
        die();
    } 
        
} else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}

?>