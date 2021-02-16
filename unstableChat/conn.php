<?php

$serverName = "PROMITERE\\SQLEXPRESS"; 
$connectionInfo = array( "Database"=>"messages");

$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( !$conn ) {
    echo "Connection could not be established.<br />";
}

?>