require('dotenv').config()
const secretKey = process.env.JWT_SECRET
const { dynamoDb } = require('../../database/db')
const { v4: uuidv4 } = require('uuid')
const middy = require('@middy/core')
const verifyToken = require('../../middleware/verifyToken')
const { verify } = require('jsonwebtoken')

const createQuiz = async (event) => {
    try {
        const { userId, quizName, questions,  } = JSON.parse(event.body)

        if (!userId || !quizName || !questions) {
            return {
                responseCode: 400,
                body: JSON.stringify({
                    message: 'Please fill in the required forms'
                })
            }
        }

        if(!Array.isArray(questions) || questions.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Please provide at least one question'
                })
            }
        }


        const scanParams = {
            TableName: 'Quiztopia-Quiz',
            FilterExpression: 'quizName = :quizName',
            ExpressionAttributeValues: {
                ':quizName': quizName
            }
        }

        const scanResult = await dynamoDb.scan(scanParams)
        const existingName = scanResult.Items[0]

        if(existingName) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'That quiz name is already taken'
                })
            }
        }

        const quizId = uuidv4()
        const createdAt = new Date().toISOString()


        const createQuizParams = {
            TableName: 'Quiztopia-Quiz',
            Item: {
                quizId,
                userId,
                quizName,
                questions,
                createdAt: createdAt
            }
        }

        try {
            await dynamoDb.put(createQuizParams);
            console.log("Successfully inserted into DynamoDB:", createQuizParams.Item);
        } catch (error) {
            console.error("Failed to insert into DynamoDB", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: error.message
                })
            };
        }
        

        console.log(questions)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Quiz created successfully',
                quiz: quizId,
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

module.exports.handler = middy(createQuiz).use(verifyToken)