const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const httpServer = http.createServer(app);
const port = 3000;

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:' + port,
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
})

httpServer.listen(port, () => {
    console.log('Server is running on port ' + port);
})