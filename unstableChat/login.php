<?php

session_start();

$username = isset($_POST['userName'])? $_POST['userName']: '';
$color    = isset($_POST['color'])? $_POST['color']: '';
$password = isset($_POST['userPass'])? $_POST['userPass']: '';

if ($username == ""){

    $response_array['status'] = 'invalidUser';

}

if (isset($username) && $username != ""){
    
    include_once("conn.php");

    $query = "SELECT * FROM users WHERE USERNAME = ?;";

    $result = sqlsrv_query($conn, $query , array($username));

    $row = sqlsrv_fetch_array($result);

    if (!$row){
       
        $response_array['status'] = 'gotopwd';
        $_SESSION['itexists'] = 'false';
        $_SESSION['username'] = $username;
        $_SESSION['color'] = $color;

    } else {

        $_SESSION['username'] = $username;
        $_SESSION['itexists'] = 'true';
        $response_array['status'] = 'gotopwd';

    }
}

if ($password != ""){

    include_once("conn.php");

    $username = $_SESSION['username'];
    $userexists = isset($_SESSION['itexists'])? $_SESSION['itexists']: '';    

    if($userexists == 'false'){

        $insert_query = "INSERT INTO USERS (userName, userPwd)
                         VALUES (? , ?)";

        $password = password_hash($password, PASSWORD_DEFAULT);                 

        $result = sqlsrv_query($conn, $insert_query, array($username, $password));

        $response_array['status'] = 'success';

    }else {

        $hash_query = " SELECT userPwd
                        FROM   USERS
                        WHERE  USERNAME = ?;";


        $result_query = sqlsrv_query($conn, $hash_query, array($username) );

        $hash_db_pass = sqlsrv_fetch_array($result_query);

        $password = password_verify($password, $hash_db_pass[0]);

        if ($password == true){

            $response_array['status'] = 'success';
        
        } else {
    
            $response_array['status'] = 'wrongpassword';
            $response_array['dbhash'] = $password;
    
            session_destroy();
    
        }
    }  
}

header('Content-type: application/json');
echo json_encode($response_array);


?>