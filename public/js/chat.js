
const socket = io()
moment.locale('pl')

// Elements 
const $messageForm = document.querySelector('#form')
const $sendButton = $messageForm.querySelector('#send-message')
const $formInput = $messageForm.querySelector('input')
const $geoBtn = document.querySelector('#location')
const $messeges = document.querySelector('#messeges')
const $aside = document.getElementById('user-list')
//Templates
const messegesTemplate = document.getElementById('messeges-template').innerHTML
const linkTemplate = document.getElementById('location-template').innerHTML
const usersListTemplate = document.getElementById('roomList-template').innerHTML
// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

console.log(Qs.parse(location.search));

socket.on('welcome', (message) => {

})
socket.on('message', (message) => {
    //console.log(message);
    const html = Mustache.render(messegesTemplate, {
        username: message.user,
        message: message.text,
        createdAt: moment(message.createdAt).format("LT")
    })
    $messeges.insertAdjacentHTML('beforeend', html)

})
socket.on('locationMessage', location => {

    const link = Mustache.render(linkTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format("LT"),
        username: location.username
    })
    $messeges.insertAdjacentHTML('beforeend', link)
})
socket.on('roomData', data => {
    console.log(data.room);

    const html = Mustache.render(usersListTemplate, {
        room: data.room,
        users: data.users
    })
    $aside.innerHTML = html

})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $sendButton.setAttribute('disabled', 'disabled') // powoduje wyłązcenie buttona

    const message = $formInput.value

    socket.emit('sendMessage', message, error => {
        $sendButton.removeAttribute('disabled')
        $formInput.value = ""
        $formInput.focus()
        if (error) {
            return console.log(error);
        }
        console.log('message delivered');
    })

})
$geoBtn.addEventListener('click', (e) => {
    navigator.geolocation
    if (!navigator.geolocation) {
        return alert('geolocation is not suported by your browser')
    }
    $geoBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.coords.latitude);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, delivered => {
            console.log(delivered);
            $geoBtn.removeAttribute('disabled')
        })
    })
})
socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})

