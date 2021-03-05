<?php

session_start();

if (isset($_SESSION['isValidated'])){

    header('Content-type: application/json; charset=utf-8' );

    include_once 'conn.php';

    $style = 'style="color: ';

    if (isset($_POST['load_last_msg'])){
        
        $last_id = $_POST['load_last_msg'];

        $query_id = "   SELECT      * 
                        FROM        STORED_MESSAGES AS STOR
                        JOIN        USERS           AS US ON US.USERNAME = STOR.USERNAME
                        WHERE       messageID    >  ?
                        ORDER BY    messageID";

        $stmt = $db->prepare($query_id);

        $stmt->bindValue(1, $last_id, SQLITE3_TEXT);

        $result = $stmt->execute();

        $message_div_array = array();

        while($data = $result->fetchArray()) {

            $loop_style = $style . $data['userColor'] . '"';
            $messageId = $data['messageId'];

            $message_div = "<div id='$messageId' class='inner_message' ".$loop_style.">
            <span class='msg'><span class='username'>".$data['userName']."</span>: ".$data['messageText']."</span>
            </div>";

            array_push($message_div_array, $message_div); 
        }

            $response_array['status'] = $message_div_array;
            
            echo json_encode($response_array);

    } else {

 
        $query_main_load = "    SELECT      * 
                                FROM        STORED_MESSAGES AS STOR
                                JOIN        USERS           AS US ON US.USERNAME = STOR.USERNAME
                                ORDER BY    messageID";
    
        $stmt = $db->prepare($query_main_load);

        $result = $stmt->execute();
    
        while($data = $result->fetchArray()) {
            $loop_style = $style . $data['userColor'] . '"';
            $messageId = $data['messageId'];
            echo "<div id='$messageId' class='inner_message' ".$loop_style.">
            <span class='msg'><span id='username'>".$data['userName']."</span>: ".$data['messageText']."</span>
            </div>";               
        }
    }

    
} else {

    $base_url = $_SERVER['HTTP_HOST'];

    header("Location: http://$base_url");
    exit();

}

?>
