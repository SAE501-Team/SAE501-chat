// dotenv INIT
require("dotenv").config();

// Socket.io INIT
const { Server } = require("socket.io");

// app INIT
const allowOrigins = process.env.SERVERURL;
console.log("ALLOW ORIGINS:", allowOrigins);

const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http"); // Import du module http
const cors = require("cors");

// Middleware INIT
const { authenticateToken } = require("./middlewares/authenticateToken.js");

// Routes INIT
const registerRouter = require("./routes/register.js");
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
// const deleteRouter = require("./routes/delete-copy.js");
const getUserRouter = require("./routes/getUser.js");
const path = require("path");
const { log } = require("console");

// Crée une application Express
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: allowOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware pour servir les fichiers statiques de React
app.use(express.static(path.join(__dirname, "client")));

// Route pour l'application React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Middleware pour traiter les JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Routes INIT
app.post("/api/", async (req, res) => {
  try {
    return res.json({
      message: "Bienvenue sur le serveur de messagerie socket.io !",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(registerRouter); // Route register compte
app.use(loginRouter); // Route login compte
app.use(logoutRouter); // Route logout compte
// app.use(deleteRouter); // Route delete compte
app.use(getUserRouter); // Route get user

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

  socket.on("joinRoom", (ticketId) => {
    console.log(`Utilisateur rejoint la room ${ticketId}`);
    socket.join(ticketId);
  });

  socket.on("message", async (msgData) => {
    // TODO: Récupérer utilisateur connecté (localStorage)
    const { roomId, message } = msgData;
    console.log(`Message reçu dans la room ${roomId}:`, message);

    io.to(roomId).emit("message", message);

    // TODO: Enregistrement du message dans la base de données
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur est déconnecté");
  });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
  console.log("REACT chat:", process.env.CLIENTURL);
  console.log(`API listening on http://localhost:${PORT}`);
});
