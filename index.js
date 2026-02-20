const express = require("express");
const app = express()

const http = require('http');
const IO = require('socket.io')
const server = http.createServer(app)
const io = new IO.Server(server)

let users_connected = [];

function broadcast_to_otherUsers(socket, users_connected, fun_nameOne, fun_nameTwo) { 
    socket.on(`${fun_nameOne}`, (data) => { 
        users_connected.forEach(user => { 
            if(user.id !== socket.id) { 
                user.emit(`${fun_nameTwo}`, {x: data.x, y: data.y}) 
            } 
        }) 
    }) 
}

io.on('connect', (socket) => {
    users_connected.push(socket)
    console.log(`user with id: ${socket.id} connected`)

    broadcast_to_otherUsers(socket, users_connected, 'draw', 'ondraw')
    broadcast_to_otherUsers(socket, users_connected, 'down', 'ondown')

    socket.on('disconnect', (reason) => {
        users_connected = users_connected.filter((user) => user.id !== socket.id)
        console.log(`user with id: ${socket.id} disconnected, reason: ${reason}`)
    })
})

app.use(express.static("public"))

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})