const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Récupérer toutes les rooms disponibles

    Récupération dans la base de données MySQL
*/
router.post("/api/getrooms", async (req, res) => {
  try {
    const rooms = await database.query("SELECT * FROM rooms");
    res.json(rooms);
  } catch (error) {
    console.error("Erreur lors de la récupération des rooms :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des rooms" });
  }
});

module.exports = router;
