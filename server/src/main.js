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

// Routes INIT
const registerRouter = require("./routes/register.js");
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
// const deleteRouter = require("./routes/delete-copy.js");
const getUserRouter = require("./routes/getUser.js");
const createTicketRouter = require("./routes/createTicket.js");
const checkOpenTicketRouter = require("./routes/checkOpenTicket.js");
const closeTicketRouter = require("./routes/closeTicket.js");

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
app.use(getUserRouter); // Route get use
app.use(createTicketRouter); // Route create room
app.use(checkOpenTicketRouter); // Route check open room
app.use(closeTicketRouter); // Route close room

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

  socket.on("joinRoom", (roomId) => {
    console.log("Utilisateur rejoint la room !", roomId); // Log ici
    if (roomId) {
      socket.join(roomId);
    } else {
      console.error("Room ID non fourni !");
    }
  });

  socket.on("message", ({ message, user, date }) => {
    const rooms = [...socket.rooms].filter((room) => room !== socket.id);
    const currentRoom = rooms[0];
    console.log("Message reçu dans la room :", currentRoom, ":", message);

    if (currentRoom) {
      const timestamp = new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      io.to(currentRoom).emit("message", { message, user, timestamp });
    } else {
      console.error("Aucune room active pour ce socket !");
    }
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
