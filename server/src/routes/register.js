const express = require("express");
const router = express.Router();
const database = require("../utils/db/databaseInit.js");
const { storeToken } = require("../utils/token/storeToken.js");

/*
    Enregistre un utilisateur dans la base de donnée

    Interconnection entre PrestaShop et le chat

    Body {
        id (prestashop)
        username (prestashop)
        email (prestashop)
        passwd (prestashop)
    }
*/
router.post("/api/register", async (req, res) => {
  const { id, username, email, password } = req.body;
  const [userData] = await database.query("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  const idToken = id;

  console.log("idToken: ", idToken);

  try {
    // Verifie si l'utilisateur existe déjà dans la bdd
    if (userData && userData.length > 0) {
      throw new Error("L'utilisateur existe déjà dans la base de données.");
    }

    // Enregistre l'utilisateur dans la bdd du chat
    await database.query(
      "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
      [idToken, username, email, password]
    );

    // Mets en ligne l'utilisateur dans la base de donnée
    await database.query(
      "UPDATE users SET isOnline = 1 WHERE email = ? AND password = ?",
      [email, password]
    );

    // Récupère les informations de l'utilisateur
    const [userDataAfterSignUp] = await database.query(
      "SELECT id, username, email, role, isOnline FROM users WHERE id = ? AND email = ?",
      [id, email]
    );

    // Enregistre l'utilisateur dans les cookies
    await storeToken(userDataAfterSignUp, res);
    console.log("registered");

    return res.json({
      success: true,
      message: `Félicitations ${username}, vous êtes enregistré !`,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement de l'utilisateur.",
    });
  }
});

module.exports = router;
