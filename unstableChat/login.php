<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    
    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}

$username = isset($_POST['userName'])? $_POST['userName']: '';
$color    = isset($_POST['color'])? $_POST['color']: '';
$password = isset($_POST['userPass'])? $_POST['userPass']: '';
$_SESSION['color_real'] = ($color != "")? $color : "";

if (isset($_POST['pwd'])){

    if ($password != ""){

        include_once("conn.php");
    
        $username = $_SESSION['username'];
        $userexists = isset($_SESSION['itexists'])? $_SESSION['itexists']: '';    
    
        if($userexists == 'false'){
    
            if ($_POST['token'] != $_SESSION['token']){
                
                $response_array['status'] = 'waitforit';

            } else {
    
                //$insert_query = "INSERT INTO USERS (userName, userPwd, userColor)
                //VALUES (?, ?, ?)";
    
                $stmt = $db->prepare("INSERT INTO USERS (userPwd, userColor, userName)
                VALUES (?, ?, ?) ");

                $password = password_hash($password, PASSWORD_DEFAULT);                 
    
                //$result = sqlsrv_query($conn, $insert_query, array($username, $password, $_SESSION['color']));
    
                $stmt->bindValue(1, $password, SQLITE3_TEXT);
                $stmt->bindValue(2, $_SESSION['color'], SQLITE3_TEXT);
                $stmt->bindValue(3, $username, SQLITE3_TEXT);

                $result = $stmt->execute();

                $response_array['status'] = 'success';
                
                $_SESSION['isValidated'] = true;
    
                $_SESSION['token'] = md5(session_id() . time());
                
    
            }
    
        }else {
    
            $stmt = $db->prepare("  SELECT userPwd
                                    FROM   USERS
                                    WHERE  USERNAME = ?;");
    
    
            /*$result_query = sqlsrv_query($conn, $hash_query, array($username) );
    
            $hash_db_pass = sqlsrv_fetch_array($result_query);
    
            $password = password_verify($password, $hash_db_pass[0]);*/

            $stmt->bindValue(1, $username, SQLITE3_TEXT);
            $result = $stmt->execute();
            $hash_db_pass = $result->fetchArray();
            $password = password_verify($password, $hash_db_pass[0]);

            if ($password == true){
    
                $response_array['status'] = 'success';
                $_SESSION['isValidated'] = true;
            
            } else {
        
                $response_array['status'] = 'wrongpassword';
            
            }
        }  
    
    } else {
    
        $response_array['status'] = "nopassword";
    
    }

} else {

    if (isset($username) && $username != ""){

        $_SESSION['username'] = $username;
    
        include_once("conn.php");
    
        /*$query = "SELECT * FROM users WHERE USERNAME = ?;";
    
        $result = sqlsrv_query($conn, $query , array($username));
    
        $row = sqlsrv_fetch_array($result);*/

        $stmt = $db->prepare("SELECT 1 FROM USERS WHERE USERNAME = ?");
        $stmt->bindValue(1, $username, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
    
        if ($row === false){
           
            $_SESSION['itexists'] = 'false';
            $_SESSION['color'] = $color;      
    
        } else {
    
            $_SESSION['itexists'] = 'true';
    
        }
    
        $response_array['status'] = 'gotopwd';
    
    }else {
    
        $response_array['status'] = 'invalidUser';
        
    }
}

header('Content-type: application/json');
echo json_encode($response_array);

exit();

?>