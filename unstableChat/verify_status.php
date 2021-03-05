<?php

session_start();

header('Content-type: application/json');

if (isset($_SESSION['isValidated'])){

    include_once 'conn.php';

    if (isset($_POST['setLastStamp'])){

        $username = $_POST['username'];

        // Seta o valor lastSeen para o usuário do contexto para 'yes'

        $stmt_0 = $db->prepare(" UPDATE USER_STATUS SET lastSeen = CURRENT_TIMESTAMP
                               WHERE  userId IN ( SELECT userID 
                                                  FROM   USERS 
                                                  WHERE  userName = ?)"
                             );

        $username_0 = $_POST['username'];

        $stmt_0->bindValue(1, $username_0, SQLITE3_TEXT);

        $result_0 = $stmt_0->execute();


        // Retorna lista de usuários online

        $stmt = $db->prepare( "SELECT   US.USERNAME, US_ST.lastSeen 
                               FROM     USER_STATUS AS US_ST
                               JOIN     USERS  AS US ON US_ST.userId = US.userID
                               WHERE    US.USERNAME <> ?
                               ORDER BY US_ST.lastSeen DESC 
                            "); 
    
        $stmt->bindValue(1, $username, SQLITE3_TEXT);

        $result = $stmt->execute();
    
        $online_users = array();


        while($data = $result->fetchArray()){

            array_push($online_users, array(
                'username' => $data[0],
                'lastSeen' => $data[1],
            ));
        }

        $response_array['status'] = json_encode($online_users);
    
        echo json_encode($response_array);

    }

}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();
}

?>