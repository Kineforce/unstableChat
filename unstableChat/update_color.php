<?php

session_start();

header('Content-type: application/json');

if (isset($_SESSION['isValidated'])){

    include_once 'conn.php';

    if (isset($_POST['retorna_username'])){

        $response_array['username'] = $_SESSION['username'];

    } else {

        $updated_color = isset($_POST['color_updated'])? $_POST['color_updated']: 'black';

        $stmt = $db->prepare("UPDATE USERS SET userColor = ? WHERE userName = ?");
        
        $stmt->bindValue(1, $updated_color);
        $stmt->bindValue(2, $_SESSION['username']);
    
        $stmt->execute();
    
        $_SESSION['updated_color'] = "updateit";
        $response_array['username'] = $_SESSION['username'];
    
        if (isset($_POST['check_user_color'])){
    
            $check_user_colors = $db->prepare("SELECT userColor FROM USERS");
            $result = $check_user_colors->execute();
    
            $json_array = array();
    
            while ($row = $result->fetchArray()){
                array_push($json_array, $row);
            }
    
            $response_array['color_data'] = $json_array;
    
        }
    
    }

    echo json_encode($response_array);

}


?>