const express = require('express');
const { authorizedOnly } = require('../middlewares/authorizedOnly');

const router = express.Router();

router.post("/pair-ou-impair", authorizedOnly, (req, res) => {
    // console.log(req.query);

    const nombre = parseInt(req.query["nombre"]);

    const resultat = nombre % 2 === 0 ? "pair" : 'impair';

    res.json({
        success: true,
        message: `${nombre} est ${resultat}`
    })
})

module.exports = router;