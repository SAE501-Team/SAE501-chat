const express = require("express");

const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Récupère un utilisateur

    Interconnection entre le React et l'API REST (Express)
*/
router.post("/api/getuser", async (req, res) => {
  try {
    // Informations de l'utilisateur (cookie)
    const userCookie = JSON.parse(req.cookies.behhchat_data);

    // Informations de l'utilisateur (liaison bdd chat)
    const [userData] = await database.query(
      "SELECT * FROM users WHERE id = ?",
      [userCookie.id]
    );

    const userInfo = userData[0];

    return res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error (getuser route)" });
  }
});

module.exports = router;
