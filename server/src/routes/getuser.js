const express = require("express");
const database = require("../utils/db/databaseInit.js");

const router = express.Router();

/*
    Récupère un utilisateur

    Interconnection entre le React et l'API REST (Express)
*/
router.get("/api/getuser", async (req, res) => {
  try {
    console.log("Cookies :", req.cookies);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur.",
    });
  }
});

module.exports = router;
