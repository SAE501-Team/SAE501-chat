<?php
if (!defined('_PS_VERSION_')) {
    exit;
}

class BehhChat extends Module
{
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
        return parent::install() && $this->registerHook('actionCustomerAccountAdd') && $this->registerHook('actionAuthentication');
    }

    private function sendDataToExpress($data)
    {
        $url = 'http://localhost:3000/api/register';

        $options = [
            'http' => [
                'header'  => "Content-Type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
            ],
        ];
        
        $context = stream_context_create($options);
        file_get_contents($url, false, $context);
    }

    public function hookActionCustomerAccountAdd($params)
    {
        $customer = $params['newCustomer'];

        $data = [
            'id' => $customer->id,
            'username' => $customer->firstname,
            'email' => $customer->email,
            'password' => $customer->passwd,
        ];

        $this->sendDataToExpress($data);
    }

    public function hookActionAuthentication($params)
{
    $customer = $params['customer'];
    
    $data = [
        'username' => $customer->firstname,
        'password' => $customer->passwd, // ou utilise un champ spécifique
    ];
    
    $this->sendDataToExpress($data);
}
}
