function storeToken(token, res) {
  res.cookie("TOKEN", token, {
    domain:
      process.env.NODE_ENV !== "development" ? ".behh.store" : "localhost:3000",
    maxAge: 60 * 60 * 1000, // 1h
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production", // Si en dev secure = false, sinon true en prod
    path: "/",
  });

  return token;
}

exports.storeToken = storeToken;
