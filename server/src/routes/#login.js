const express = require("express");
const users = require("../data/users.json");
const { generateToken } = require("../utils/token/generateToken");

const router = express.Router();

/*
    Supprime un utilisateur dans la base de donnée

    TODO: Interconnection entre PrestaShop et le chat pour recup l'id et le password pour se connecter au chat

    Body {
        id (prestashop)
        username (prestashop)
    }
*/
router.post("/login", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  const matchingUser = users.find((user) => {
    return user.username === username && user.password === password;
  });

  if (!matchingUser) {
    return res.status(401).json({
      success: false,
      message: "Nom d'utilisateur et/ou le mot de passe incorrect(s).",
    });
  }

  generateToken(matchingUser, res);

  return res.json({
    success: true,
    message: "Connexion réussie !",
  });
});

module.exports = router;
