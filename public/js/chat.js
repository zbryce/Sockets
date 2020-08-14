let socket = io('/admin')


const { username, room, admin } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// if(admin === 'milo'){
//     socket = io('/admin')
// }
console.log('socket it ', socket)
socket.emit('login', {username, room, admin})
socket.on('admin', (message) => {
    console.log('admin obj ', message)
    const sidebar = document.getElementById('sidebar')
    sidebar.style.background = 'maroon'
})
socket.on('myMessage', (message) => {
    const mine = document.createElement('li')
    mine.classList.add('mine')
    mine.innerHTML = message
    list.appendChild(mine)
})
socket.on('thereMessage', (message) => {
    const there = document.createElement('li')
    there.classList.add('there')
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

const list = document.getElementById('list')
const chat = document.getElementById('chat')
const input = document.getElementById('enter')

input.addEventListener('keypress', function (e) {
    console.log('e list ', socket)
    if (e.key === 'Enter') {
      socket.emit('message', e.target.value, room)
      e.target.value = ''
    }
});




