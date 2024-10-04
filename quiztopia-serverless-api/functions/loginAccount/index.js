require('dotenv').config()
const secretKey = process.env.JWT_SECRET
const { dynamoDb } = require('../../database/db')

const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body)

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please fill in the required forms'
                })
            }
        }


        const userParams = {
            TableName: 'Quiztopia-Users',
            IndexName: 'email-index', 
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        const result = await dynamoDb.query(userParams)
        const user = result.Items[0]

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found'
                })
            }
        }


        if (user.password !== password) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Incorrect password'
                })
            }
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email
            },
            secretKey, 
            { expiresIn: '1h'}
        )


        const updateParams = {
            TableName: 'Quiztopia-Users',
            Key: {
                userId: user.userId
            },
            UpdateExpression: 'SET #onlineStatus = :onlineStatus',
            ExpressionAttributeNames: {
                '#onlineStatus': 'online'  // Alias för det reserverade ordet "online"
            },
            ExpressionAttributeValues: {
                ':onlineStatus': true  
            },
            ReturnValues: 'ALL_NEW'
        }
        
        const updatedUser = await dynamoDb.update(updateParams)


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                token: token,
                user: updatedUser.Attributes
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
