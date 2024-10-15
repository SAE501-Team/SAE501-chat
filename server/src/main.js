// dotenv INIT
require("dotenv").config();

// app INIT
const cookieParser = require("cookie-parser");
const express = require('express');
const pairOuImpairRouter = require('./routes/pairOuImpair.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');

// app server INIT
const server = express();
const port = 3000;

// use express-json and cookieParser
server.use(express.json());
server.use(cookieParser());

// Routes INIT
server.get('/', (req, res) => {
    res.send("Hello World")
});

server.use(pairOuImpairRouter);
server.use(loginRouter);
server.use(logoutRouter);

// Socket.io


server.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
})