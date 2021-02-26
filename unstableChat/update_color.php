<?php

session_start();

header('Content-type: application/json');

if (isset($_SESSION['isValidated'])){

    $updated_color = isset($_POST['color_updated'])? $_POST['color_updated']: 'black';

    include_once 'conn.php';

    $stmt = $db->prepare("UPDATE USERS SET userColor = ? WHERE userName = ?");
    
    $stmt->bindValue(1, $updated_color);
    $stmt->bindValue(2, $_SESSION['username']);

    $stmt->execute();

    $response_array['username'] = $_SESSION['username'];
    echo json_encode($response_array);


}


?>