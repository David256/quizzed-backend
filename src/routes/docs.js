const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'The Quizzed API Rest documentation',
      version: '1.0.0',
    },
  },
  basePath: '/',
  apis: [
    './src/routes/quizzes.js',
    './src/routes/results.js',
    './src/models/quiz.js',
    './src/models/result.js',
  ],
});

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

module.exports = router;
