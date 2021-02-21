<?php

session_start();

if (isset($_SESSION['username'])? $_SESSION['username']: "" != ""){


    $serverName = "PROMITERE\\SQLEXPRESS"; 
    $connectionInfo = array( "Database"=>"messages");

    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( !$conn ) {
        echo "Connection could not be established.<br />";
    }

} else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: $base_url");
    exit();

}

?>