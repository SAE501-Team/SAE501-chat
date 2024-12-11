const express = require("express");
const { storeToken } = require("../utils/token/storeToken");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Connecte un utilisateur

    Interconnection entre PrestaShop et le chat

    Body {
        id (prestashop)
        email (prestashop)
    }
*/
router.post("/api/login", async (req, res) => {
  const id = req.body["id"];
  const email = req.body["email"];

  const [userData] = await database.query(
    "SELECT id, username, email, role, isOnline FROM users WHERE id = ? AND email = ?",
    [id, email]
  );

  if (userData.length === 0 || !userData) {
    return res.status(401).json({
      success: false,
      message: "Nom d'utilisateur et/ou le mot de passe incorrect(s).",
    });
  } else {
    // Mets en ligne l'utilisateur dans la base de donnée
    await database.query(
      "UPDATE users SET isOnline = 1 WHERE id = ? AND email = ?",
      [id, email]
    );

    // console.log(storeToken(userData, res));
    storeToken(userData, res);

    return res.json({
      success: true,
      message: {
        1: "Connexion réussie !",
        2: `Bienvenue ${userData[0]?.username} (${userData[0]?.role}) !`,
      },
    });
  }
});

module.exports = router;
