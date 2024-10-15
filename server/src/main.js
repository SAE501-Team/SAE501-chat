// dotenv INIT
require("dotenv").config();

// Socket.io INIT
const { Server } = require('socket.io');

// app INIT
const cookieParser = require("cookie-parser");
const express = require('express');
const http = require('http'); // Import du module http
const pairOuImpairRouter = require('./routes/pairOuImpair.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');

// Crée une application Express
const app = express();
const port = 3000;

// Crée un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Attache Socket.io au serveur HTTP
const io = new Server(server);

// Middleware pour traiter les JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Routes INIT
app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use(pairOuImpairRouter);
app.use(loginRouter);
app.use(logoutRouter);

// Gestion des événements Socket.io
io.on("connection", (socket) => {
    console.log('Un utilisateur est connecté');
    
    socket.on('message', (msg) => {
        console.log('Message reçu :', msg);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

// Démarre le serveur HTTP sur le port spécifié
server.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});
