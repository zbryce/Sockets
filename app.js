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
const serveClients = (keys) => {
    keys.forEach(key => {
        console.log('key ', key)
    });
}
const connectedUsers = {

}
io.on('connection', (socket) => {

    connectedUsers[socket.id] = socket

        const admin = io.of('/admin')
        admin.on('connection', (socket) => {
            connectedUsers[socket.id] = socket
      
            // serveClients(clients)
            socket.on('login', (obj) => {
                console.log('api obj', obj)
                socket.emit('admin-log', obj)
                socket.broadcast.emit('new user', `${obj.username} ${socket.id} has joined the chat`)
                socket.emit('client', [obj.username, 'red'])
                socket.broadcast.emit('other client', [obj.username, 'red'])
                
                socket.emit('adminMember', [obj.username, socket.id])
                socket.broadcast.emit('adminMember', [obj.username, socket.id])
            })
            socket.on('namespace', (username) => {
                
                admin.emit('userPush', ([`${username} pushed the admin namespace button!`, 'red']))
            })
            socket.on('get-id', (idMessage => {
                const {id, payload, username } = idMessage
                const user = connectedUsers[id]
                const newMessage = `${user.id} ${username}: ${payload}`
               connectedUsers[id].emit('private', newMessage)
               
            }))
            socket.on('adminButton', (username) => {
                admin.emit('adminClick', (`Admin ${username} sent a notice to everyone.`))
                io.emit('adminClick', (`Admin ${username} sent a notice to everyone.`))
            })
            socket.on('message', (message => {
                socket.volatile.emit('myMessage', message)
                socket.broadcast.volatile.emit('theirMessage', message)
                // socket.broadcast.emit('thereMessage', message)

            }))
            socket.on('disconnect', () => {
                console.log('admin left')
            })
        })
        socket.on('get-id', (idMessage => {
            const {id, payload, username } = idMessage
            const user = connectedUsers[id]
            const newMessage = `${user.id} ${username}: ${payload}`
            connectedUsers[id].emit('private', newMessage)
           
        }))
        socket.on('login', (obj) => {
            const room = obj.room
            const username = obj.username
            socket.join(room)
            socket.emit('welcome', `Welcome to the ${room} room!`)
            socket.to(room).emit('new user', `${username} ${socket.id} has joined the channel`)
        })
        socket.on('get-id', (idMessage => {
            console.log('in get id')
            const {id, message } = idMessage
            io.to(id).emit('private', message)
        }))
        socket.on('message', (message, room) => {
            console.log('user message')
            socket.emit('myMessage', message)
            socket.to(room).emit('theirMessage', message)
        })
        socket.on('namespace', (username) => {
            console.log('namespace', username)
            io.emit('userPush', [`${username} pushed the user namespace button!`, 'blue'])
        })
        socket.on('disconnect', () => {
            console.log('disconnected')
        })
})

// adminnsp.on('connection', (socket) => {
//     socket.on('conn')
// })
server.listen('2020', () => {
    console.log('listening on 2020')
})