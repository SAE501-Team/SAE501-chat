const jwt = require('jsonwebtoken');
const SECRET = process.env.TOKEN_SECRET;

function generateToken(user, res) {
    const payload = {
        userId: user.id,
        username: user.username
    }

    const token = jwt.sign(payload, SECRET, {
        expiresIn: "1h"
    });

    res.cookie("TOKEN", token, {
        maxAge: 60 * 60 * 1000, // 1h
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" // Si en dev secure = false, sinon true en prod
    });
}

exports.generateToken = generateToken;