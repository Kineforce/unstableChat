<?php

class Chat extends CI_controller {

    function __construct() {

        parent::__construct();
        $this->load->helper('url');
        $this->load->model('Chat_model');
        $this->load->library('session');

    }

    /**
     *  Esta função é chamada quando o usuário entra na tela de login
     */
    public function index(){

        if ($this->session->userdata('isAuthenticated', '1')){

            customRedir('everyone');

        } else {

            $api_response = file_get_contents("https://www.cloudflare.com/cdn-cgi/trace");

            $get_lines = explode("\n", $api_response);
            
            $api_array = array();
            
            foreach ($get_lines as $line){
            
                $inner_explode = explode('=', $line);
            
                if ($inner_explode[0] == 'ip'){
    
                    $api_array[$inner_explode[0]] = $inner_explode[1];
    
                }
            }
    
            $data = array();

            if (count($api_array) > 0){

                $data['ip'] = $api_array['ip'];
                $this->session->set_userdata('user_ip_address', $data['ip']);

            }

            $this->load->view("login", $data);

        }
    }

    /**
     * Esta função é chamada quando o usuário envia um post ao clicar para enviar o usuário
     * e tem o objetivo de validar o input do usuário
     */
    public function login(){

        if ($this->session->userdata('isAuthenticated') == 1){

            customRedir('everyone');

        } else if ($this->input->post()){

            header('Content-Type: application/json');

            $response_array = array();
            $username       = htmlspecialchars($this->input->post('username'));
            $color          = htmlspecialchars($this->input->post('color'));
            $userIp         = $this->session->userdata('user_ip_address');
            $isValidated    = false;

            if ($username == '' && $color){

                $response_array['status'] = 'emptyUsername';

            } else if (strlen($username) >= 20 && $color){

                $response_array['status'] = 'lengthUsername';

            } else {
                
                $isValidated = true;

            }        
        
            // Se o input está validado, prosseguir para a verificação do usuário no banco
        
            if ($isValidated){

                $result     = $this->Chat_model->checkIfUserExists($username);
                $num_result = $result->num_rows();

                if ($num_result > 0){

                    // Caso exista, definir variável na sessão para efetuar autenticação do usuário posteriormente
                    $this->session->set_userdata('userExists', '1');

                } else {

                    $checkIp    = $this->Chat_model->checkIfIpExists($userIp);
                    $num_check  = $checkIp->num_rows();

                    if ($num_check > 0){

                        // IP já cadastrado no banco, logo, login bloqueado
                        $response_array['status'] = "ipException";

                        echo json_encode($response_array);

                        die();

                    }

                    // Caso não exista, definir variável na sessão para cadastrar usuário posteriormente
                    $this->session->set_userdata('userExists', '0');

                }

                $this->session->set_userdata('username', $username);
                $this->session->set_userdata('color', $color);


                $response_array['status'] = 'goToPassword';

                echo json_encode($response_array);

            } else {

                echo json_encode($response_array);

            }

        } else {

            customRedir('');

        }
    }

    /**
     * Esta função é chamada quando o usuário é redirecionado para a página de login e quando efetua o submit da senha
     * E tem o objetivo de validar a autenticação do usuário
     */
    public function pwd(){  

        if ($this->session->userdata('isAuthenticated') == 1){

            customRedir('everyone');

        } else {

            $isPreAuthenticated = $this->session->username;
            $password           = $this->input->post('userpass');
            $isPost             = $this->input->method() === 'post';

            // Caso o usuário esteja pré autenticado e não tenha acontecido um post da senha
            if ($isPreAuthenticated && !$isPost){
                $data['token']      = md5(session_id() . time());
                $data['username']   = $this->session->userdata('username');

                $this->session->set_userdata('token', $data['token']);

                $this->load->view('pwd', $data);

            // Caso o usuário esteja pré autenticado e tenha efetuado o post com a senha 
            } else if($isPreAuthenticated && $isPost && $password != '') {

                header('Content-Type: application/json');

                $password       = $this->input->post('userpass');
                $post_token     = $this->input->post('token');

                $color          = $this->session->userdata('color');
                $username       = $this->session->userdata('username');
                $userIp         = $this->session->userdata('user_ip_address');
                $session_token  = $this->session->userdata('token');
                $itExists       = $this->session->userdata('userExists');

                // Se o usuário não existir na base, efetuar o cadastro
                if ($itExists == 0){

                    // Se o token enviado pelo post for diferente do que está na sessão, ocorreu um double submit
                    if ($post_token != $session_token){

                        $response_array['status'] = 'waitforit';

                    } else {

                        // Envia dados para o método da model cadastrar o usuário no banco de dados
                        $result = $this->Chat_model->insertNewUser($username, $password, $color, $userIp);

                        if ($result){

                            $response_array['status'] = 'success';
                            $this->session->set_userdata('isAuthenticated', '1');

                        } else {

                            $response_array['status'] = 'failed';

                        }

                        // Reseta o token da session
                        $this->session->set_userdata('token', md5(session_id() . time()));

                    }

                    echo json_encode($response_array);

                // Se o usuário já existir, efetuar a autenticação do mesmo
                } else if ($itExists == 1) {

                    $result = $this->Chat_model->validatePassword($username);

                    if ($result){

                        $hash_password    = $result->userpwd;
                        $user_password    = $password;

                        $is_same_password = password_verify($user_password, $hash_password);

                        if ($is_same_password){

                            // Define que o usuário está autenticado e já pode ser redirecionado para o chat
                            $this->session->set_userdata('isAuthenticated', '1');
                            $response_array['status'] = 'success';

                        } else {

                            // Usuário errou a senha e será redirecionado a página de login
                            $response_array['status'] = 'wrongpassword';
                            $this->session->unset_userdata('username');

                        }

                        echo json_encode($response_array);

                    } 

                }
            
            // Se o usuário está pré autenticado, fez um post, porém o campo da senha é vazio
            } else if ($isPreAuthenticated && $isPost && $password == ''){

                header('Content-Type: application/json');

                $response_array['status'] = 'nopassword';
                echo json_encode($response_array);
        

            } else {

                customRedir('');

            }
        }
    }

    /**
     * Redireciona o usuário caso esteja autenticado, para a tela principal do Chat
     */
    public function everyoneChat(){

        if ($this->session->userdata('isAuthenticated') == 1){

            $this->load->view('chat');

        } else {

            customRedir('');

        }

    }

    /**
     * Remove as sessões do usuário para impedir que ele acesse a aplicação
     */
    public function logout(){

        if ($this->input->post('exit') == 'true' && $this->session->userdata('isAuthenticated') == 1 || $this->session->userdata('username')){

            $this->session->unset_userdata('isAuthenticated');
            $this->session->unset_userdata('username');

        } else {

            customRedir('');

        }

    }

    /**
     * Retorna as mensagens para a view baseado no dado que veio no POST
     */
    public function getMessages(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');

            $load_last_msg      = $this->input->get('load_last_msg');
            $targetUser         = $this->input->get('targetUser');
            $username           = $this->session->userdata('username');

            $this->session->set_userdata('targetUser', $targetUser);

            if ($load_last_msg != "" && $targetUser != ""){

                $result = $this->Chat_model->returnTargetMessages($load_last_msg, $username, $targetUser);

            }

            if (count($result->result_array()) != 0){

                $message_div_concat = "";

                foreach ($result->result_array() as $data){
    
                    // Tratando hora do banco e ajustando para GMT -3
                    $stamp_msg              = $data['messagestamp'];
                    $convert_date           = strtotime($stamp_msg);
                    $time_msg               = date($convert_date);
                    $hours_to_subtract      = 3;
                    $time_to_subtract       = ($hours_to_subtract * 60 * 60);
                    $time_in_past           = $time_msg - $time_to_subtract;
                    $hour_msg               = date("H:i", $time_in_past);
    
                    // Criando varáveis de estilo
                    $style                  = "style='color: ";
                    $loop_style             = $style . $data['usercolor']. "'";
                    $messageId              = $data['messageid'];
    
                    if ($data['username'] == $this->session->userdata('username')){
    
                        $class_align = 'right';
    
                    } else {
    
                        $class_align = 'left';
    
                    }
    
                    $message_div  = "<div class='msg_date' value='".date("Y-m-d h:m:s", $time_in_past)."' style='display: none'>" . date("d/m/Y", $time_in_past) . "</div>";
                    $message_div .= "<div id='".htmlspecialchars($messageId)."' class='chat_line $class_align'>";  
                    $message_div .=     "<div class='msg_wrapper'>";
                    $message_div .=         "<span class='username' ".$loop_style.">".htmlspecialchars($data['username'])."</span>";
                    $message_div .=         "<span class='msg' style='color:black'>".htmlspecialchars($data['messagetext'])."</span>";
                    $message_div .=         "<span class='msg_stamp' style='color:black'>".htmlspecialchars($hour_msg)."</span>";
                    $message_div .=     "</div>";
                    $message_div .= "</div>";
    
                    $message_div_concat .= $message_div;
                        
                    $response_array['status'] = $message_div_concat;
    
                } 
    
                echo json_encode($response_array);
    
            } else {

                $response_array['status'] = 'nothing';
                echo json_encode($response_array);
            }

        } else {

            customRedir('');

        }

    }

    /**
     * Função que valida a mensagem do usuário retornada no post e chama a model para inserção no banco
     */
    public function setNewMessage(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');
            
            if ($this->input->post('message')){

                $username       = $this->session->userdata('username');
                $userMessage    = $this->input->post('message'); 
                $targetUser     = $this->session->userdata('targetUser');

                if (strlen($userMessage) != 0){

                    $result = $this->Chat_model->insertNewMessage($username, $userMessage, $targetUser);

                    if ($result){

                        $response_array['status'] = 'New message inserted!';

                    } else {

                        $response_array['status'] = 'Something went wrong!';

                    }

                }

                echo json_encode($response_array);

            }
        } else {

            customRedir('');

        }

    }

    /**
     * Retorna para a view o username do usuário definido na sessão
     */
    public function getUsername(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');
            
            if ($this->input->get('retorna_username')){

                $session_username           = $this->session->userdata('username');
                $response_array['username'] = $session_username;

                echo json_encode($response_array);

            }

        } else {

            customRedir('');

        }
        
    }

    /**
     * Retorna para a view um JSON indicando os usuários que estão online ou não
     */
    public function getUserStatus(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');

            if ($this->input->post('update_status')){

                $username           = $this->session->userdata('username');
                $result_update      = $this->Chat_model->updateLastSeen($username);
                $result_query       = $this->Chat_model->returnUserStatus($username);

                $online_users = array();

                if ($result_query && $result_update){

                    foreach ($result_query->result_array() as $data){

                        array_push($online_users, array(
                            'username' => htmlspecialchars($data['username']),
                            'lastSeen' => htmlspecialchars($data['lastseen']),
                        ));
    
                    }

                    $response_array['status'] = $online_users;

                } else {

                    $response_array['status'] = 'Something went wrong!';

                }

                echo json_encode($response_array);

            }

        } else {

            customRedir('');

        }

    }

    /**
     * Realiza a troca de cor do usuário
     */
    public function setUserColor(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');

            if ($this->input->post('color')){

                $username   = $this->session->userdata('username');
                $color      = $this->input->post('color'); 

                $result     = $this->Chat_model->updateUserColor($username, $color);

                if ($result){

                    $response_array['status'] = 'Color updated!';

                } else {

                    $response_array['status'] = 'Something went wrong!';

                }

                echo json_encode($response_array);

            }


        } else {

            customRedir('');

        }

    }

    /**
     * Retorna para a view um JSON com os usuários do banco e suas respectivas cores
     */
    public function getColorMessages(){

        if ($this->session->userdata('isAuthenticated') == 1){

            header('Content-Type: application/json');

            if ($this->input->get('retorna_cores')){

                $result         = $this->Chat_model->returnUsersColors();
                $user_colors    = array();

                foreach ($result->result_array() as $data){

                    array_push($user_colors, array(
                        'username' => htmlspecialchars($data['username']),
                        'color'    => htmlspecialchars($data['usercolor'])
                    ));

                }

                $response_array['cores'] = $user_colors;

                echo json_encode($response_array);

            }

        } else {

            customRedir('');

        }

    }

}



?>