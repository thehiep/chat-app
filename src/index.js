const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Filter = require('bad-words')

const port = process.env.PORT || 3008;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('new websocket connection');
    socket.emit('message', 'Welcom')

    socket.broadcast.emit('message', 'A new user has joined.')
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
        callback('Delivered')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longtitude}`)
        callback()

    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left.')
    })

})

server.listen(port, () => {
    console.log(`Server is up on port:${port}`);
});