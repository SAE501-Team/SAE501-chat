const express = require("express");

const router = express.Router();

/*
    Récupère un utilisateur

    Interconnection entre le React et l'API REST (Express)
*/
router.post("/api/getuser", async (req, res) => {
  try {
    return res.json(req.cookies.behhchat_data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
