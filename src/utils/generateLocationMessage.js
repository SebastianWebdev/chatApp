const generateLocationMessage = (position, username) => {
    const url = `https://google.com/maps?q=${position.latitude},${position.longitude}`
    return { url, createdAt: new Date().getTime(), username }
}
module.exports = generateLocationMessage