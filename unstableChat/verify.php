<?php

session_start();

if (isset($_SESSION['username'])? $_SESSION['username']: "" != ""){

    include_once 'conn.php';

     /////////////////////////////////////////////////////////////////////////////

     header('Content-type: application/json');

     $query = "SELECT * FROM UPDATE_DIV";
 
     $result = sqlsrv_query($conn, $query);
 
     $data = sqlsrv_fetch_array($result);
 
     $response_array['realTime'] = $data['database_session'];

     echo json_encode($response_array);

}else {
    header("Location: http://localhost:8000/");
    exit();
}

?>

