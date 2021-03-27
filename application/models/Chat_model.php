<?php

class Chat_model extends CI_Model {


    /** 
     * Faz a verificação se o usuário existe no banco de dados
    */ 
    public function checkIfUserExists($username){

        $username = $this->db->escape($username);
        $query = $this->db->query("SELECT 1 FROM users WHERE username = $username");

        return $query;

    }

    /**
     * Insere novo usuário no banco de dados 
     */
    public function insertNewUser($username, $password, $color, $userIp){
        
        $userIp     = $this->db->escape($userIp);
        $username   = $this->db->escape($username);
        $password   = password_hash($password, PASSWORD_DEFAULT);
        $color      = $this->db->escape($color);

        $query = "  INSERT INTO USERS (userPwd, userColor, userName, userIp)
                    VALUES ('$password', $color, $username, $userIp);

                    INSERT INTO USER_STATUS (lastSeen) 
                    VALUES (current_timestamp);
                ";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Valida a senha do input do usuário com a hash que está presente no banco
     */
    public function validatePassword($username){

        $username = $this->db->escape($username);

        $query = "  SELECT userpwd, username
                    FROM   USERS
                    WHERE  USERNAME = $username;
                ";

        $result = $this->db->query($query);
        
        $row = $result->row();

        return $row;

    }

    /**
     * Insere uma nova mensagem no banco de dados
     */
    public function insertNewMessage($username, $message, $userTarget){

        $username    = $this->db->escape($username);
        $message     = $this->db->escape($message);
        $userTarget  = $this->db->escape($userTarget);

        $query =    "   INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText, targetUser)
                        VALUES ($username, current_timestamp, $message, $userTarget);
                    ";

        $result = $this->db->query($query);

        return $result;
    }

     /**
     * Retorna as últimas mensagens baseado no último ID
     */
    public function returnTargetMessages($load_last_msg, $username, $targetUser){

        $id              = $this->db->escape($load_last_msg);
        $username        = $this->db->escape($username);
        $targetUsername  = $this->db->escape($targetUser);

        if ($targetUser == 'grupoDeEstudoIESBxD'){

            $middle_query = " WHERE       STOR.targetUser IN ($targetUsername)";

        } else {

            $middle_query = " WHERE       STOR.targetuser      IN ($targetUsername, $username)
                              AND			STOR.username        IN ($targetUsername, $username)";

        }

        $query = "  SELECT      *
                    FROM        STORED_MESSAGES      AS STOR
                    JOIN        USERS                AS US ON US.USERNAME = STOR.USERNAME
                    $middle_query
                    AND         messageId            > $id
                    ORDER BY    messageStamp;
                ";

        $result = $this->db->query($query);

        return $result;

    }

     /**
     * Retorna todas as mensagens do chat aberto
     */
    public function returnAllMessages($username, $targetUser){

        $username = $this->db->escape($username);
        $targetUser = $this->db->escape($targetUser);

        $query = "  SELECT      *
                    FROM        STORED_MESSAGES      AS STOR
                    JOIN        USERS                AS US ON US.USERNAME = STOR.USERNAME
                    WHERE       STOR.targetuser      IN ($targetUser, $username)
                    AND			STOR.username        IN ($targetUser, $username)
                    ORDER BY    messageStamp;
                ";

        $result = $this->db->query($query);

        return $result;
    }   

    /**
     * Atualiza o valor lastSeen do usuário no banco
     */
    public function updateLastSeen($username){

        $username = $this->db->escape($username);

        $query    = "   UPDATE USER_STATUS SET lastseen = now()::timestamp
                        WHERE  userId IN ( SELECT userid 
                                           FROM   USERS 
                                           WHERE  userName = $username);";


        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Retorna todos os usuários cadastrados
    */
    public function returnAllUsers($username){

        $username = $this->db->escape($username);

        $query = "  SELECT   username
                    FROM     users 
                    WHERE    username <> $username
                    ORDER BY userid ASC;";


        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Retorna os status do usuário e verifica se ele está online
    */
    public function returnUserStatus($targetUser){

        $targetUser = $this->db->escape($targetUser);

        $query = "  SELECT   US.USERNAME, US_ST.lastSeen 
                    FROM     USER_STATUS AS US_ST
                    JOIN     USERS  AS US ON US_ST.userId = US.userID
                    WHERE    US.USERNAME = $targetUser ";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Atualiza a cor do usuário da sessão
    */
    public function updateUserColor($username, $color){

        $username    = $this->db->escape($username);
        $color       = $this->db->escape($color);

        $query = "UPDATE USERS SET userColor = $color WHERE userName = $username;";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Retorna as cores de todos os usuários do banco
    */
    public function returnUsersColors(){

        $query = "  SELECT username, usercolor 
                    FROM USERS";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Verifica se o ip enviado pelo controlador existe para algum usuário cadastrado
     */
    public function checkIfIpExists($userIp){

        $userIp = $this->db->escape($userIp);

        $query = "SELECT userIp FROM USERS WHERE userIp = $userIp";

        $result = $this->db->query($query);

        return $result;

    }

}

?>