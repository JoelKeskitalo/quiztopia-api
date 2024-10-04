require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

const verifyToken = {
  before: async (handler) => {

    const token = handler.event.headers.Authorization || handler.event.headers.authorization

    if (!token) {
      throw new Error('Access denied. No token provided.')
    }

    try {
      const cleanToken = token.replace('Bearer ', '')

      const decoded = jwt.verify(cleanToken, secretKey)

      handler.event.user = decoded

    } catch (error) {
      throw new Error('Invalid token.')
    }
  }
}

module.exports = verifyToken
