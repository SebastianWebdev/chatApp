const generateMessage = (text, user) => ({ text, createdAt: new Date().getTime(), user })
module.exports = generateMessage

