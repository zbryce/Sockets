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
    // io.of('/admin').on('greeting', () => {
        //     console.log('in greeting')
        //     io.of('/admin').emit('greeting ', 'hello admin')
        // })
        const adminnsp = io.of('/admin')
        adminnsp.on('connection', () => {
            console.log('connected')
            adminnsp.emit('admin', 'connected to admin' )
        })

        adminnsp.on('admin', (message) => {
            console.log(message)
        })  
        adminnsp.on('login', obj => {
            console.log('in admin login', obj)
        })
        socket.on('login', (obj) => {
            console.log('in login', obj)
            const room = obj.room
            const username = obj.username
            adminnsp.emit('admin', obj)
            socket.join(room)
            socket.emit('welcome', `Welcome to the ${room} room!`)
            socket.to(room).emit('new user', `${username} has joined the channel`)
        })
        adminnsp.on('message', (message) => {
            console.log('admin message')
            adminnsp.emit('admin-message', message)
        })
        socket.on('message', (message, room) => {
            console.log('wrong message')
            socket.emit('myMessage', message)
            socket.to(room).emit('thereMessage', message)
        
    })
    
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})

server.listen('4000', () => {
    console.log('listening on 4000')
})