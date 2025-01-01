const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

router.post("/api/getMessages", async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: "Ticket ID is required" });
  }

  try {
    const [messages] = await database.execute(
      `SELECT messages.id, messages.ticketId, messages.userId, messages.content, messages.date, users.username
       FROM messages
       JOIN users ON messages.userId = users.id
       WHERE messages.ticketId = ?
       ORDER BY messages.date`,
      [ticketId]
    );
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
