require('dotenv').config()
const secretKey = process.env.JWT_SECRET
const { dynamoDb } = require('../../database/db')
const middy = require('@middy/core')
const verifyToken = require('../../middleware/verifyToken')

const removeQuiz = async (event) => {
    try {

        const { userId, quizId } = event.pathParameters;

        if (!userId || !quizId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please provide both userId and quizId in the URL'
                })
            }
        }


        const getParams = {
            TableName: 'Quiztopia-Quiz',
            Key: {
                userId: userId, 
                quizId: quizId   
            }
        }

        const result = await dynamoDb.get(getParams);
        const quiz = result.Item;

        if (!quiz) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Quiz not found'
                })
            }
        }


        const deleteParams = {
            TableName: 'Quiztopia-Quiz',
            Key: {
                userId: userId,  
                quizId: quizId   
            }
        }

        await dynamoDb.delete(deleteParams);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Quiz deleted successfully'
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

module.exports.handler = middy(removeQuiz).use(verifyToken)
