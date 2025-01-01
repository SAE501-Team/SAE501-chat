const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

// Fonction pour convertir une date ISO en format MySQL
function formatDateForMySQL(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // Mois (01-12)
  const dd = String(d.getDate()).padStart(2, "0"); // Jour (01-31)
  const hh = String(d.getHours()).padStart(2, "0"); // Heures (00-23)
  const mi = String(d.getMinutes()).padStart(2, "0"); // Minutes (00-59)
  const ss = String(d.getSeconds()).padStart(2, "0"); // Secondes (00-59)

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

router.post("/api/saveMessage", async (req, res) => {
  const { ticketId, userId, content, date } = req.body;

  if (!ticketId || !userId || !content || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Formater la date pour MySQL
    const formattedDate = formatDateForMySQL(date);

    const query = `
      INSERT INTO messages (ticketId, userId, content, date)
      VALUES (?, ?, ?, ?)
    `;
    const values = [ticketId, userId, content, formattedDate];
    await database.execute(query, values);

    return res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
