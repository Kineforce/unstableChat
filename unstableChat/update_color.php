<?php

session_start();

header('Content-type: application/json');

if (isset($_SESSION['isValidated'])){

    include_once 'conn.php';

    if (isset($_POST['retorna_username'])){

        $response_array['username'] = $_SESSION['username'];

    } else if (isset($_POST['retorna_cores'])){

        $select_color = $db->prepare("SELECT userName, userColor FROM USERS");

        $result = $select_color->execute();

        $user_colors = array();

        while($data = $result->fetchArray()){
            array_push($user_colors, array(
                'username' => htmlspecialchars($data[0]),
                'color' => htmlspecialchars($data[1]),
            ));
        }

        $response_array['cores'] =  json_encode($user_colors);

    } else {

        $updated_color = isset($_POST['color_updated'])? $_POST['color_updated']: 'black';

        $stmt = $db->prepare("UPDATE USERS SET userColor = ? WHERE userName = ?");
        
        $stmt->bindValue(1, $updated_color);
        $stmt->bindValue(2, $_SESSION['username']);
    
        $stmt->execute();
    
        $_SESSION['updated_color'] = "updateit";
        $response_array['username'] = $_SESSION['username'];
    
    }

    echo json_encode($response_array);

}

?>