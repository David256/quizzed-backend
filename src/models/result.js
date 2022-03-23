const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *  schemas:
 *    Response:
 *      type: object
 *      required:
 *        - questionId
 *        - response
 *      properties:
 *        questionId:
 *          type: string
 *          description: The question ID
 *        response:
 *          type: boolean
 *          description: The response
 *      example:
 *        questionId: 231
 *        response: false
 */
const ResponseSchema = Schema({
  questionId: { type: String, required: true },
  response: { type: Boolean, required: true },
});

/**
 * @swagger
 * components:
 *  schemas:
 *    Result:
 *      type: object
 *      required:
 *        - id
 *        - quizId
 *        - email
 *        - responses
 *      properties:
 *        id:
 *          type: string
 *          description: The result ID
 *        quizId:
 *          type: string
 *          description: The quiz ID
 *        email:
 *          type: string
 *          description: The user email
 *        responses:
 *          type: array
 *          description: The responses
 *          items:
 *            $ref: '#/components/schemas/Response'
 *      example:
 *        id: 7
 *        quizId: 3
 *        email: qwerty@debian.org
 *        responses:
 *          - questionId: 46
 *            response: true
 *          - questionId: 230
 *            response: false
 */
const ResultSchema = Schema({
  id: { type: String, required: true },
  quizId: { type: String, required: true },
  email: { type: String, required: true },
  responses: { type: [ResponseSchema], required: true },
});

module.exports = mongoose.models.Result || mongoose.Model('Result', ResultSchema);
