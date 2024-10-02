const { dynamoDb } = require('../../database/db')

module.exports.handler = async (event) => {
    try {

        const { quizId, newQuestion } = JSON.parse(event.body)

        if(!!quizId || newQuestion ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please fill in the required form'
                })
            }
        }

        
        const getParams = {
            TableName: 'Quiztopia-Quiz',
            Key: { 
                quizId: quizId
            }
        }

        const result = await dynamoDb.get(getParams)
        const quiz = result.Item

        if(!quiz) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Quiz not found'
                })
            }
        }


        const updatedQuestions = [...quiz.questions, newQuestion]

        const updateParams = {
            TableName: 'Quiztopia-Quiz',
            Key: {
                quizId: quizId
            },
            UpdateExpression: 'SET questions = :updatedQuestions',
            ExpressionAttributeValues: {
                ':updatedQuestions': updatedQuestions
            },
            ReturnValues: 'ALL_NEW'
        }

        const updatedQuiz = await dynamoDb.update(updateParams)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Questions added: ',
                question: newQuestion,
                updatedQuiz: updatedQuiz
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