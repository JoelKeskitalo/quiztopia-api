require('dotenv').config();
const secretKey = process.env.JWT_SECRET;
const { dynamoDb } = require('../../database/db')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')



module.exports.handler = async (event) => {
    try {
        const { userName, email, password } = JSON.parse(event.body)

        if (!userName || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please fill in the required forms'
                })
            }
        }


        
        const scanParams = {
            TableName: 'Quiztopia-Users',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }

        const scanResult = await dynamoDb.scan(scanParams)
        const existingUser = scanResult.Items[0]

        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'User email already exists'
                })
            }
        }


        const userId = uuidv4().toString()
        const createdAt = new Date().toISOString()
        const online = false

        const hashedPassword = await bcrypt.hash(password, 10)

        const createUserParams = {
            TableName: 'Quiztopia-Users',
            Item: {
                userId,
                userName,
                email,
                password: hashedPassword,
                createdAt,
                online
            }
        }

        await dynamoDb.put(createUserParams)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User created successfully',
                userId
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        }
    }
}
