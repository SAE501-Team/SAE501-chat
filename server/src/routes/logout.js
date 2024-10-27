const express = require("express");
const router = express.Router();
const database = require("../utils/db/databaseInit.js");

/*
    Deconnecte un utilisateur dans la base de donnée

    Interconnection entre PrestaShop et le chat

    Body {
        email (prestashop)
    }
*/
router.post("/api/logout", async (req, res) => {
  // Efface le cookie TOKEN
  // res.clearCookie('TOKEN');

  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    // Mettre à jour le statut de l'utilisateur dans la base de données
    const result = await database.query(
      "UPDATE user SET isOnline = 0 WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, message: "User logged out." });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
});

module.exports = router;
