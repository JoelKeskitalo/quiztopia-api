const { dynamoDb } = require('../../database/db')

module.exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

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

        const result = await dynamoDb.query(userParams);
        const user = result.Items[0];  

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


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                userId: user.userId  
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        }
    }
}
