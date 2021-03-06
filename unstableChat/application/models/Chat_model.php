<?php

class Chat_model extends CI_Model {


    /** 
     * Faz a verificação se o usuário existe no banco de dados
    */ 
    public function checkIfUserExists($username){

        $username = $this->db->escape($username);
        $query = $this->db->query("SELECT 1 FROM USERS WHERE USERNAME = $username");

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
                    VALUES (CURRENT_TIMESTAMP);
                ";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Valida a senha do input do usuário com a hash que está presente no banco
     */
    public function validatePassword($username){

        $username = $this->db->escape($username);

        $query = "  SELECT userPwd, userName
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
    public function insertNewMessage($username, $message){

        $username = $this->db->escape($username);
        $message  = $this->db->escape($message);

        $query =    "   INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText)
                        VALUES ($username, CURRENT_TIMESTAMP, $message);
                    ";

        $result = $this->db->query($query);

        return $result;
    }
    
    /**
     * Retorna as últimas mensagens baseado no último ID
     */
    public function returnLastMessages($id){

        $id = $this->db->escape($id);

        $query = "  SELECT      *
                    FROM        STORED_MESSAGES AS STOR
                    JOIN        USERS           AS US ON US.USERNAME = STOR.USERNAME
                    WHERE       messageId       >  $id
                    ORDER BY    messageStamp;
                ";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Atauliza o valor lastSeen do usuário no banco
     */
    public function updateLastSeen($username){

        $username = $this->db->escape($username);

        $query    = "   UPDATE USER_STATUS SET lastSeen = CURRENT_TIMESTAMP
                        WHERE  userId IN ( SELECT userID 
                                           FROM   USERS 
                                           WHERE  userName = $username);";


        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Retorna os status de todos os usuários do banco 
    */
    public function returnUserStatus($username){

        $username = $this->db->escape($username);

        $query = "  SELECT   US.USERNAME, US_ST.lastSeen 
                    FROM     USER_STATUS AS US_ST
                    JOIN     USERS  AS US ON US_ST.userId = US.userID
                    WHERE    US.USERNAME <> $username
                    ORDER BY US_ST.lastSeen DESC;";


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

        $query = "SELECT userName, userColor FROM USERS";

        $result = $this->db->query($query);

        return $result;

    }

    /**
     * Verifica se o ip enviado pelo controlador existe para algum usuário cadastrado
     */
    public function checkIfIpExists($userIp){

        $userIp = $this->db->escape($userIp);

        $query = "SELECT userIp FROM USERS WHERE userIp = ?";

        $result = $this->db->query($query);

        return $result;

    }

}

?>