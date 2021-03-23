<?php
/**
 * Redireciona de acorda com o nome do servidor
 */
function customRedir($appName){

    $server_name = $_SERVER['SERVER_NAME'];

    if ($server_name != 'localhost'){

        header("Location: http://unstablechat.000webhostapp.com/$appName");

    } else {
        header("Location: http://localhost:8000/$appName");

    }

}

?>