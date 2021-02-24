<?php

session_start();

if (isset($_SESSION['isValidated'])){

    include_once 'conn.php';

     /////////////////////////////////////////////////////////////////////////////

     header('Content-type: application/json');

     $query = $db->prepare("SELECT * FROM UPDATE_DIV");
 
     $result = $query->execute();
 
     $data = $result->fetchArray();
 
     $response_array['realTime'] = $data['databaseSession'];

     echo json_encode($response_array);

}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();
    
}

?>

