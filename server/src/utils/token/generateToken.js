const jwt = require("jsonwebtoken");
const SECRET = process.env.TOKEN_SECRET;
const { storeToken } = require("./storeToken.js");

function generateToken(user, res) {
  const payload = {
    userId: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });

  storeToken(token, res);

  return token;
}

exports.generateToken = generateToken;
