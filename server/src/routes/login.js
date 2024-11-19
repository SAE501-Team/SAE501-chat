const express = require("express");
const { storeToken } = require("../utils/token/storeToken");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Connecte un utilisateur

    Interconnection entre PrestaShop et le chat

    Body {
        email (prestashop)
        passwd (prestashop)
    }
*/
router.post("/api/login", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  const [userData] = await database.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (userData.length === 0 || !userData) {
    return res.status(401).json({
      success: false,
      message: "Nom d'utilisateur et/ou le mot de passe incorrect(s).",
    });
  } else {
    // Mets en ligne l'utilisateur dans la base de donnée
    await database.query(
      "UPDATE users SET isOnline = 1 WHERE email = ? AND password = ?",
      [email, password]
    );

    storeToken(userData, res);

    console.log(storeToken(userData, res));

    return res.json({
      success: true,
      message: "Connexion réussie !",
    });
  }
});

module.exports = router;
