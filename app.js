const express = require('express');
const app = express();
const path = require('path');
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

// app.get('/user', (req, res) => {
//     res.sendFile(path.join(__dirname, ))
// })
const getVisitors = () => {
    // let clients = io.sockets.clients.connected;
    // let sockets = Object.values(clients)
    // let users = sockets.map(s => s.user)
    // return users
    const users = io.sockets.clients()
   
}
const emitVisitors = () => {
    io.emit('users', getVisitors())
}

io.on('connection', (socket) => {
        const admin = io.of('/admin')
        admin.on('connection', (socket) => {
            socket.on('login', (obj) => {
                socket.emit('admin-log', obj)
            })
            socket.on('message', (message => {
                console.log('admin message ', message)
                socket.volatile.emit('myMessage', message)
                socket.broadcast.volatile.emit('thereMessage', message)
                // socket.broadcast.emit('thereMessage', message)

            }))
            socket.on('disconnect', () => {
                console.log('admin left')
            })
        })
       
        socket.on('login', (obj) => {
            const room = obj.room
            const username = obj.username
            socket.join(room)
            socket.emit('welcome', `Welcome to the ${room} room!`)
            socket.to(room).emit('new user', `${username} has joined the channel`)
        })
        
        socket.on('message', (message, room) => {
            console.log('user message')
            socket.emit('myMessage', message)
            socket.to(room).emit('theirMessage', message)
        })
    
        socket.on('disconnect', () => {
            console.log('disconnected')
        })
})

// adminnsp.on('connection', (socket) => {
//     socket.on('conn')
// })
server.listen('4000', () => {
    console.log('listening on 4000')
})