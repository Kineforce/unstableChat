<?php

session_start();

if (isset($_SESSION['isValidated'])){

include_once 'conn.php';

$stmt = $db->prepare(" SELECT * 
                        FROM STORED_MESSAGES AS STOR
                        JOIN USERS           AS US ON US.USERNAME = STOR.USERNAME
                        ORDER BY messageID");

$result = $stmt->execute();

$style = 'style="color: ';

?>    

<?php while($data = $result->fetchArray()) {
    $loop_style = $style . $data['userColor'] . '"';
    $messageId = $data['messageId'];
    echo "<div id='$messageId' class='inner_message' ".$loop_style.">
     <span id='username'>".$data['userName']."</span>: ".$data['messageText']."
    </div>";               
}?>

<?php
}else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}


?>