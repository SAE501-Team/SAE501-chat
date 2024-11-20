function storeToken(token, res) {
  res.cookie("TOKEN", token, {
    maxAge: 60 * 60 * 1000, // 1h
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Si en dev secure = false, sinon true en prod
  });

  return token;
}

exports.storeToken = storeToken;
