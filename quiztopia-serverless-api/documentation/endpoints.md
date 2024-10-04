# Quiztopia API Endpoints

A list of all available endpoints for Quiztopia API:

## Auth

### Create account (signup)

- **POST** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/auth/signup

### Login (login)

- **GET** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/auth/login

## Quiz

### Create quiz

- **POST** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/quiz

### Add a question to a quiz

- **POST** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/quiz/question

### Remove a quiz

- **DELETE** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/quiz/{userId}/{quizId}

### Get all quiz

- **GET** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/quiz

### Get a specific quiz

- **GET** - https://pfh6eaov96.execute-api.eu-north-1.amazonaws.com/quiz/{userId}/{quizId}
