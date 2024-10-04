require('dotenv').config();
const secretKey = process.env.JWT_SECRET;
const { dynamoDb } = require('../../database/db')

module.exports.handler = async (event) => {
    try {
        const { userId, quizId } = event.pathParameters;

        if (!userId || !quizId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Fill in the correct URL'
                })
            }
        }

        // Använd både userId (Partition Key) och quizId (Sort Key)
        const quizParameters = {
            TableName: 'Quiztopia-Quiz',
            KeyConditionExpression: 'userId = :userId AND quizId = :quizId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':quizId': quizId
            }
        }

        const result = await dynamoDb.query(quizParameters);
        const quiz = result.Items[0];  // Eftersom det bara finns ett specifikt quiz

        if (!quiz) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Could not find any quiz with that ID for the specified user'
                })
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Quiz made by user ${userId}:`,
                quiz: quiz
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
