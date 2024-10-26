const express = require("express");
const { storeToken } = require("../utils/token/storeToken");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Supprime un utilisateur dans la base de donnée

    TODO: Faire que les consoles logs se montrent quand on se login dans le Presta

    Body {
        firstname (prestashop)
        passwd (prestashop)
    }
*/
router.post("/api/login", async (req, res) => {
  const firstname = req.body["username"];
  const password = req.body["password"];

  const [userData] = await database.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [firstname, password]
  );

  if (userData.length === 0 || !userData) {
    return res.status(401).json({
      success: false,
      message: "Nom d'utilisateur et/ou le mot de passe incorrect(s).",
    });
  } else {
    storeToken(userData, res);

    console.log("username:", firstname);
    console.log("password:", password);

    console.log("userData:", userData);

    return res.json({
      success: true,
      message: "Connexion réussie !",
    });
  }
});

module.exports = router;
