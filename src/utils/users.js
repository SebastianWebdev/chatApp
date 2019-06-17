const users = []
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // validate the data
    if (!username || !room) {
        return { error: "username and room must be provided" }
    }
    isUserExist = users.find(user => {
        return user.room === room && user.username === username
    })
    if (isUserExist) {
        return { error: 'username is already in use' }
    }
    const user = { id, username, room }
    users.push(user)
    return { user }
}
const removeUser = id => {
    const index = users.findIndex(user => {
        return user.id === id
    })
    if (index < 0) {
        return { error: 'user does not exist' }
    }
    return users.splice(index, 1)[0]
}
const getUser = id => users.find(user => user.id === id)
const getUsersInRoom = room => users.filter(user => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }





