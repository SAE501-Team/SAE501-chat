// const jwt = require("jsonwebtoken");
// const SECRET = process.env.SECRET;

function authenticateToken(req, res, next) {
  const userToken = req.cookies.TOKEN;

  if (!userToken) {
    return res.status(401).json({
      success: false,
      message: "Vous devez vous connecter pour accéder à cette ressource.",
    });
  } else if (userToken) {
    console.info(
      `middleware: L'utilisateur ${userToken[0].username} est connecté.`
    );
    req.user = userToken[0];
    next();
  }

  console.log("MIDDLEWARE D'AUTHENTIFICATION : ", userToken);
}

exports.authenticateToken = authenticateToken;
