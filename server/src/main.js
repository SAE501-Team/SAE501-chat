// dotenv INIT
require("dotenv").config();

console.log("REACT:", process.env.CLIENTURL);
console.log("EXPRESS:", process.env.SERVERURL);

// Socket.io INIT
const { Server } = require("socket.io");

// app INIT
const allowOrigins = [process.env.CLIENTURL, process.env.SERVERURL];
const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http"); // Import du module http
const cors = require("cors");

// Routes INIT
const registerRouter = require("./routes/register.js");
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
const deleteRouter = require("./routes/delete.js");

// Crée une application Express
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: allowOrigins, // Remplace par l'URL de ton client
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware pour traiter les JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Routes INIT
app.post("/api/", (req, res) => {
  return res.json({
    message: "Bienvenue sur le serveur de messagerie socket.io !",
  });
});

app.use(registerRouter); // Route register compte
app.use(loginRouter); // Route login compte
app.use(logoutRouter); // Route logout compte
app.use(deleteRouter); // Route delete compte

// Crée un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Attache Socket.io au serveur HTTP
const io = new Server(server, {
  cors: {
    origin: allowOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("message", (msg) => {
    console.log("Message reçu :", msg);

    // Todo: Enregistrement du message dans la base de données
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur est déconnecté");
  });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
