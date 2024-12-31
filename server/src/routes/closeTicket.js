const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

router.post("/api/closeticket", async (req, res) => {
  try {
    const userTicketId = req.body["ticketId"];
    console.log("Ticket ID received:", userTicketId); // Debugging the received ticketId

    if (!userTicketId) {
      return res.status(400).json({ error: "Ticket ID is required" });
    }

    // Vérifie si l'utilisateur a une room ouverte
    const [openRoom] = await database.query(
      "SELECT * FROM rooms WHERE userId = ? AND isClosed = 0 LIMIT 1",
      [userTicketId]
    );
    console.log("Open Room:", openRoom); // Debugging the openRoom result

    if (openRoom && openRoom.length > 0) {
      // Ferme le ticket en mettant à jour la colonne isClosed
      console.log("Closing room with ID:", openRoom[0].id); // Debugging the room ID
      await database.query("UPDATE rooms SET isClosed = 1 WHERE ticketId = ?", [
        userTicketId, // Assuming `userTicketId` contains the ticketId
      ]);
      return res.json({ message: "Ticket closed successfully" });
    } else {
      return res.status(404).json({ message: "No open ticket found" });
    }
  } catch (error) {
    console.error("Error closing ticket:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
