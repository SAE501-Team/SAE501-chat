require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require('express');
const pairOuImpairRouter = require('./routes/pairOuImpair.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');

const app = express();
const port = 3000;

// Jetbrains Mono typo

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World")
});

app.use(pairOuImpairRouter);
app.use(loginRouter);
app.use(logoutRouter);

app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
})