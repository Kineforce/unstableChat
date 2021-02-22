<?php

if (isset($_SESSION['username'])){

    $serverName = "PROMITERE\\SQLEXPRESS"; 
    $connectionInfo = array( "Database"=>"messages");

    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( !$conn ) {
        echo "Connection could not be established.<br />";
    }

} else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}

?>