const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Vérifier si un utilisateur a déjà un ticket ouvert

    Interconnexion entre React et l'API REST (Express)
*/
router.post("/api/checkOpenTicket", async (req, res) => {
  try {
    const userCookie = JSON.parse(req.cookies.behhchat_data);

    // Vérifie si l'utilisateur a une room ouverte
    const [openRoom] = await database.query(
      "SELECT * FROM rooms WHERE userId = ? AND isClosed = 0 LIMIT 1",
      [userCookie.id]
    );

    if (openRoom.length > 0) {
      return res.json({ ticket: openRoom[0] });
    } else {
      return res.json({ ticket: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error (checkOpenTicket route)" });
  }
});

module.exports = router;
