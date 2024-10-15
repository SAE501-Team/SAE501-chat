const express = require('express');
const users = require('../data/users.json');
const { generateToken } = require('../utils/generateToken');

const router = express.Router();

router.post('/login', (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];

    const matchingUser = users.find((user) => {
        return user.username === username && user.password === password;
    });

    if (!matchingUser) {
        return res.status(401).json({
            success: false,
            message: "Nom d'utilisateur et/ou le mot de passe incorrect(s)."
        })
    }

    generateToken(matchingUser, res);

    return res.json({
        success: true,
        message: 'Connexion réussie !'
    })
})

module.exports = router;