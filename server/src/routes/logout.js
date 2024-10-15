const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // Efface le cookie TOKEN
    res.clearCookie('TOKEN');

    // Envoie une réponse JSON au client
    return res.json({
        success: true,
        message: 'Vous êtes déconnecté !'
    });
});

module.exports = router;
