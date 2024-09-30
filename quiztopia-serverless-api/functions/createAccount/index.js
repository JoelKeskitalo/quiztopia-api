const { dynamoDb } = require('../../database')
const { v4: uuidv4 } = require('uuid')

module.exports.handler = async (event) => {
    try {

        const { userId, userName, email, password, createdAt} = JSON.parse(event.body)

        if(!userId || !userName || !email || !password || !createdAt) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please fill in the required forms'
                })
            }
        }


        const userParams = {
            TableName: 'Quiztopia-Users',
            Key: { userId }
        }

        const result = await dynamoDb.get(userParams)
        const user = result.Item

        if(user.userId === userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'User id already exists'
                })
            }
        }


        userId = uuidv4()
        createdAt = new Date().toString()

        const createUserParams = {
            TableName: 'Quiztopia-Users',
            Item: {
                userId,
                userName,
                email,
                password,
                createdAt
            }
        }

        await dynamoDb.put(createUserParams)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User created successfully',
                user: userId
            })
        }
        

    } catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        }
    }
}