let socket = io()



const { username, room, admin } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


if(admin === 'milo'){
    socket = io('/admin')
}
// console.log('socket is ', socket)

console.log('username is', username)
socket.emit('login', {username, room, admin})


socket.once('admin-log', (message) => {
    console.log('in admin log')
    const sidebar = document.getElementById('sidebar-div')
    sidebar.style.background = 'maroon'
    const status = document.getElementById('status')
    status.innerHTML = 'ADMIN'
    const item = document.createElement('li')
    item.classList.add('neutral')
    item.innerHTML = `Welcome to the chat, ${message.username}`
    list.appendChild(item)
})
socket.on('myMessage', (message) => {
    console.log('admin message ', message)
    const myMessage = document.createElement('p')
    myMessage.classList.add('myMessage')
    myMessage.innerHTML = message
    list.appendChild(myMessage)
})
socket.on('theirMessage', (message) => {
    const there = document.createElement('p')
    there.classList.add('theirMessage')
    there.innerHTML = message
                                                                                        
    list.appendChild(there)
})
socket.on('welcome', (message) => {
    console.log('in welcome', message)
    const welcome = document.createElement('li')
    welcome.classList.add('neutral')
    welcome.innerHTML = message
    list.appendChild(welcome)
})
socket.once('new user', (message) => {
    const hello = document.createElement('li')
    hello.classList.add('neutral')
    hello.innerHTML = message
    list.appendChild(hello)
})
//my message
socket.on('message', (message) => {
    console.log('in message ', message)
    const item = document.createElement('li')
    item.classList.add('message')
    item.innerHTML = message
    const list = document.querySelector('#list')
    list.appendChild(item)
})
// socket.once('client', (usercolor) => {
//     console.log('in client ', usercolor[0])
//     const client = document.createElement('p')
//     client.classList.add(usercolor[1])
//     client.innerHTML = usercolor[0]
//     clients.appendChild(client)
// })
// socket.once('other client', (usercolor) => {
//     const client = document.createElement('p')
//     client.classList.add(usercolor[1])
//     client.innerHTML = usercolor[0]
//     clients.appendChild(client)
// })
socket.on('admin-message', (message) => {
    const item = document.createElement('li')
    item.classList.add('message')
    item.innerHTML = message
    list.appendChild(item)
})
socket.on('userPush', (messageColor) => {
    const [message, color] = messageColor
    const header = document.getElementById('notice')
    header.innerHTML = message
    header.classList.add(color)
})
socket.once('adminClick', (message) => {
    const adminNotice = document.createElement('h2')
    adminNotice.classList.add('adminMessage')
    adminNotice.innerHTML = message
    clients.appendChild(adminNotice)
})
socket.once('private', (message) => {
    console.log('private msg ', message)
    const privateMsg = document.createElement('h3')
    privateMsg.classList.add('private')
    privateMsg.innerHTML = message
    clients.appendChild(privateMsg)
})
const list = document.getElementById('messages')
const chat = document.getElementById('chat')
const input = document.getElementById('main-input')
const clients = document.getElementById('list')
const namespaceButton = document.getElementById('namespace-button')
const adminButton = document.getElementById('admin-button')
const idButton = document.getElementById('idButton')

idButton.addEventListener('click', (e) => {
    event.preventDefault()
    const input = document.getElementById('id-string')
    const id = input.value
    const message = document.getElementById('solo-message')
    const payload = message.value

    socket.emit('get-id', ({id, payload, username}))
    input.value = ''
    message.value = ''
})
adminButton.addEventListener('click', (e) => {
    console.log('socket ', socket.nsp)
    if(socket.nsp === '/admin'){
        socket.emit('adminButton', (username))
    } else {
        const no = document.createElement('h3')
        no.innerHTML = 'Access Denied!'
        no.classList.add('no-response')
        clients.appendChild(no)
    }
})
namespaceButton.addEventListener('click', function(e) {
    socket.emit('namespace', (username))
})
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      socket.emit('message', e.target.value, room)
      e.target.value = ''
    }
});




