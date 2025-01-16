const express = require("express");

const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Créer la room dans la base de données

    Interconnection entre le React et l'API REST (Express)
*/
router.post("/api/createticket", async (req, res) => {
  let userCookie = null;

  try {
    if (req.cookies.behhchat_data) {
      userCookie = JSON.parse(req.cookies.behhchat_data);
    }

    const userTicketId = req.body["ticketId"];
    const userId = userCookie ? userCookie.id : null;
    const category = req.body["category"];
    const product = req.body["product"] || "";
    const details = req.body["details"];

    if (!userCookie) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const [existingRoom] = await database.query(
      "SELECT * FROM rooms WHERE userId = ? AND isClosed = 0 LIMIT 1",
      [userId]
    );

    // Si une room ouverte existe, la renvoyer
    if (existingRoom.length > 0) {
      console.log("Room already open");

      return res.json({ message: "Room already open", room: existingRoom[0] });
    } else {
      // Sinon, créer une nouvelle room
      await database.query(
        "INSERT INTO rooms (ticketId, userId, category, product, details) VALUES (?, ?, ?, ?, ?)",
        [userTicketId, userId, category, product, details]
      );

      return res.json({ message: "Room created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error (createroom route)" });
  }
});

module.exports = router;
