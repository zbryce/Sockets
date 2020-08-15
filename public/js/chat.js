let socket = io()



const { username, room, admin } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


if(admin === 'milo'){
    socket = io('/admin')
}

socket.emit('login', {username, room, admin})
socket.on('admin-log', (message) => {
    const sidebar = document.getElementById('sidebar-div')
    sidebar.style.background = 'maroon'
    const status = document.getElementById('status')
    status.innerHTML = 'ADMIN'
})
socket.on('myMessage', (message) => {
    console.log('admin message ', message)
    const myMessage = document.createElement('li')
    myMessage.classList.add('myMessage')
    myMessage.innerHTML = message
    list.appendChild(myMessage)
})
socket.on('theirMessage', (message) => {
    const there = document.createElement('li')
    there.classList.add('their')
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
socket.on('new user', (message) => {
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

socket.on('admin-message', (message) => {
    console.log('in admin')
    const item = document.createElement('li')
    item.classList.add('message')
    item.innerHTML = message
    list.appendChild(item)
})

const list = document.getElementById('messages')
const chat = document.getElementById('chat')
const input = document.getElementById('main-input')

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        console.log('val ', e.target.value)
      socket.emit('message', e.target.value, room)
      e.target.value = ''
    }
});




