require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

module.exports.verifyToken = async (event) => {

    const token = event.header.Authorization || event.header.authorization

    if(!token) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                message: 'Access denied. No token provided'
            })
        }
    }

    try {

        const cleanToken = token.replace('Bearer ', '')
        const decoded = jwt.verify(cleanToken, secretKey)

        return {
            statusCode: 200,
            decoded: decoded
        }

    } catch(error) {
        return {
            statusCode: 500,
            error: error.message
        }
    }
}