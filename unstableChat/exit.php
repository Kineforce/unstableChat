<?php

session_start();

if($_SESSION['username'] != ""){

    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
    
}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: $base_url");
    exit();

}



?>