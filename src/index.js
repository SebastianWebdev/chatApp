const express = require('express')
const path = require("path")
const http = require('http')
const socket = require('socket.io')
const Filter = require('bad-words')
const GenerateMessage = require('./utils/messege')
const glc = require('./utils/generateLocationMessage')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const app = express()
const serwer = http.createServer(app)
const io = socket(serwer)

const publicPath = path.join(__dirname, "../public");

const port = process.env.PORT || 3000
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    //console.log('new web socket connection');
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('message', GenerateMessage(`${user.username} has joined!`, 'Admin'))
        socket.emit('welcome', GenerateMessage(`Welcome ${user.username}`, "Admin"))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message', GenerateMessage(message, user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', GenerateMessage(`${user.username} has left!!`))
        }

    })
    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit(`locationMessage`, glc(position, user.username))
        callback("position shared")
    })
})

serwer.listen(port, () => {
    console.log(`serwer is running at port: ${port}`);

})