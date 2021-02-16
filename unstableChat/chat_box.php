<?php

session_start();


if ($_SESSION['username'] != ""){

include_once 'conn.php';

$query = "SELECT * FROM STORED_MESSAGES";

$result = sqlsrv_query($conn, $query);

$style = 'style="color: ';


?>    

<?php while($data = sqlsrv_fetch_array($result)) {
    $loop_style = $style . $data['messageColor'] . '"';
    echo "<div class='inner_message' ".$loop_style.">
        ".$data['userName']." : ".$data['messageText']."
    </div>";               
}?>

<?php
}else {

    header("Location: http://localhost:8000/");
    exit();

}


?>