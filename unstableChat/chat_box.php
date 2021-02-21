<?php

session_start();


if ($_SESSION['username'] != ""){

include_once 'conn.php';

$query = "  SELECT * 
            FROM STORED_MESSAGES AS STOR
            JOIN USERS           AS US ON US.USERNAME = STOR.USERNAME
            ORDER BY messageID";

$result = sqlsrv_query($conn, $query);

$style = 'style="color: ';


?>    

<?php while($data = sqlsrv_fetch_array($result)) {
    $loop_style = $style . $data['userColor'] . '"';
    echo "<div class='inner_message' ".$loop_style.">
        ".$data['userName']." : ".$data['messageText']."
    </div>";               
}?>

<?php
}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: $base_url");
    exit();

}


?>