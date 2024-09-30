const { dynamoDb } = require('../../database/db')

module.exports.handler = async (event) => {
    try {

        const quizTableParams = {
            TableName: 'Quiztopia-Quiz'
        }

        const result = await dynamoDb.scan(quizTableParams)
        const allQuiz = result.Items

        if(!allQuiz) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No quiz found in the database'
                })
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'All quiz in the database: ',
                quiz: allQuiz
            })
        }
         
    } catch(error) {
        return {
            statusCode: 500,
            error: error.message
        }
    }
}