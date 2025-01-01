const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

// Route pour fermer un ticket
router.post("/api/closeticket", async (req, res) => {
  const { ticketId } = req.body;

  // Vérification que le ticketId est bien fourni
  if (!ticketId) {
    console.log("Erreur: Aucun ticketId fourni dans la requête");
    return res.status(400).json({ error: "Ticket ID is required" });
  }

  try {
    console.log(`Tentative de fermer le ticket avec ID: ${ticketId}`);

    // Rechercher une room ouverte avec ce ticketId
    const [openRoom] = await database.query(
      "SELECT * FROM rooms WHERE ticketId = ? AND isClosed = 0 LIMIT 1",
      [ticketId]
    );

    if (!openRoom || openRoom.length === 0) {
      console.log("Aucune room ouverte trouvée pour ce ticketId");
      return res.status(404).json({ message: "No open ticket found" });
    }

    // Le ticket est ouvert, on le ferme
    const roomId = openRoom[0].id;
    console.log(`Room trouvée avec l'ID ${roomId}, fermeture du ticket...`);

    // Mettre à jour la base de données pour fermer la room
    await database.query("UPDATE rooms SET isClosed = 1 WHERE ticketId = ?", [
      ticketId,
    ]);

    // Confirmer la fermeture du ticket
    console.log(`Ticket avec l'ID ${ticketId} fermé avec succès`);
    return res.json({ message: "Ticket closed successfully" });
  } catch (error) {
    console.error("Erreur lors de la fermeture du ticket:", error); // Log de l'erreur pour déboguer
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
