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
    public function insertNewMessage($username, $message, $targetUser_id){

        $username    = $this->db->escape($username);
        $message     = $this->db->escape($message);
        $targetUser_id  = $this->db->escape($targetUser_id);

        $query =    "   INSERT INTO STORED_MESSAGES (userName, messageStamp, messageText, targetUser)
                        VALUES ($username, current_timestamp, $message, $targetUser_id);
                    ";

        $result = $this->db->query($query);

        return $result;
    }

     /**
     * Retorna as últimas mensagens baseado no último ID
     */
    public function returnTargetMessages($load_last_msg, $username, $targetUser_id){

        $id              = $this->db->escape($load_last_msg);
        $username        = $this->db->escape($username);
        $targetUser_id   = $this->db->escape($targetUser_id);

        $get_user_id =     "SELECT  userid
                            FROM    USERS AS US
                            WHERE   US.USERNAME = $username";

        $res_user_id = $this->db->query($get_user_id);
        $res_user_id = $res_user_id->result_array();
        $user_id     = $res_user_id[0]['userid'];

        $query = "  SELECT      *
                    FROM        stored_messages      AS stor
                    JOIN        users                AS users ON stor.username = users.username
                    WHERE       (users.userid         = $user_id AND stor.targetuser = $targetUser_id
                    OR          users.userid          = $targetUser_id AND stor.targetuser = $user_id)
                    AND         stor.messageid        > $id  
                    ORDER BY    messageStamp;
                ";


        $result = $this->db->query($query);

        return $result;

    }

     /**
     * Retorna todas as mensagens do chat aberto
     */
    public function returnAllMessages($username, $targetUser_id){

        $username      = $this->db->escape($username);
        $targetUser_id = $this->db->escape($targetUser_id);

        $get_user_id =     "SELECT  userid
                            FROM    USERS AS US
                            WHERE   US.USERNAME = $username";

        $res_user_id = $this->db->query($get_user_id);
        $res_user_id = $res_user_id->result_array();
        $user_id     = $res_user_id[0]['userid'];

        $query = "  SELECT      *
                    FROM        stored_messages      AS stor
                    JOIN        users                AS users ON stor.username = users.username
                    WHERE       (users.userid         = $user_id AND stor.targetuser = $targetUser_id
                    OR          users.userid         = $targetUser_id AND stor.targetuser = $user_id)
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
        

        $query = "  SELECT   username, userid
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