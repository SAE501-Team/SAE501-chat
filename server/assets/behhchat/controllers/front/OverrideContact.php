<?php

class BehhchatOverrideContactModuleFrontController extends ContactController
{
    public function initContent()
    {
        parent::initContent();

        // Injecter des variables spécifiques pour le chat
        $this->context->smarty->assign([
            'chat_support_url' => $this->context->link->getModuleLink('behhchat', 'chat'),
        ]);

        // Charger le template personnalisé
        $this->setTemplate('module:behhchat/views/templates/front/custom_contact.tpl');

        die('test');
    }
}
