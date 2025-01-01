<?php
if (!defined('_PS_VERSION_')) {
    exit;
}

class BehhChat extends Module
{
    public $apiurl = 'http://host.docker.internal:3000/';

    public function __construct()
    {
        $this->name = 'behhchat';
        $this->version = '1.0.0';
        $this->author = 'YxxgSxxl';
        $this->bootstrap = true;
        parent::__construct();

        $this->displayName = 'BehhChat Module';
        $this->description = 'Module pour le chat sav de Behh (API)';
    }

    public function install()
    {
        return parent::install() &&
            $this->registerHook('actionCustomerAccountAdd') &&
            $this->registerHook('actionAuthentication') &&
            $this->registerHook('actionCustomerLogoutAfter') &&
            $this->registerHook('ModuleRoutes');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    // Send data to express API call
    private function sendDataToExpress($data, $endpoint)
    {
        $url = $this->apiurl . $endpoint;

        $options = [
            'http' => [
                'header' => "Content-Type: application/json\r\n",
                'method' => 'POST',
                'content' => json_encode($data),
            ],
        ];

        $context = stream_context_create($options);

        // Try/Catch to handle API call errors
        try {
            $response = file_get_contents($url, false, $context);

            PrestaShopLogger::addLog('Response from API: ' . $response, 1);
        } catch (Exception $e) {
            PrestaShopLogger::addLog('API call failed: ' . $e->getMessage(), 3);
        }
    }

    // Register
    public function hookActionCustomerAccountAdd($params)
    {
        $customer = $params['newCustomer'];

        $data = [
            'id' => $customer->id,
            'username' => $customer->firstname,
            'email' => $customer->email,
            'password' => $customer->passwd,
        ];

        $this->sendDataToExpress($data, 'api/register');
    }

    // Login
    public function hookActionAuthentication($params)
    {
        $customer = $params['customer'];

        $data = [
            'id' => $customer->id,
            'email' => $customer->email, // Vérifiez si c'est le hash ou le mot de passe clair
        ];

        $this->sendDataToExpress($data, 'api/login');

        $cookieValue = json_encode($data);

        // Créer un cookie nommé 'behhchat_data', qui expire dans 1 heure
        setcookie('behhchat_data', $cookieValue, time() + 3600, "/", "", false, false);
    }


    // Logout
    public function hookActionCustomerLogoutAfter($params)
    {
        $customer = $params['customer'];

        $data = [
            'email' => $customer->email, // Email de l'utilisateur
        ];

        // Envoie une requête à l'API pour gérer la déconnexion
        $this->sendDataToExpress($data, 'api/logout');
    }
}