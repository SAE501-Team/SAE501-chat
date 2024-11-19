const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

function authorizedOnly(req, res, next) {
  const token = req.cookies["TOKEN"];

  console.log(token);

  try {
    const decoded = jwt.decode(token, SECRET);

    req.user = {
      id: decoded.userId,
      name: decoded.username,
    };
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Vous devez être authentifié pour accéder à cette ressource",
    });
  }

  next();
}

exports.authorizedOnly = authorizedOnly;
