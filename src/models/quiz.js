const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *  schemas:
 *    Question:
 *      type: object
 *      required:
 *        - questionId
 *        - question
 *        - answer
 *      properties:
 *        questionId:
 *          type: string
 *          description: The question ID
 *        question:
 *          type: string
 *          description: The question
 *        answer:
 *          type: boolean
 *          description: The correct answer
 *      example:
 *        questionId: 46
 *        question: 'Humans have 46 chromosomes'
 *        answer: true
 */
const QuestionSchema = Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

/**
 * @swagger
 * components:
 *  schemas:
 *    Quiz:
 *      type: object
 *      required:
 *        - name
 *        - questions
 *      properties:
 *        id:
 *          type: string
 *          description: The quiz ID
 *        name:
 *          type: string
 *          description: The quiz name
 *        questions:
 *          type: array
 *          description: A list with various questions
 *          items:
 *            $ref: '#/components/schemas/Question'
 *      example:
 *        id: 0
 *        name: 'final quiz'
 *        questions:
 *          - questionId: 230
 *            question: 'It takes 23 seconds for blood to circulate through the body'
 *            answer: true
 *          - questionId: 231
 *            question: '39 ºC is hypothermia'
 *            answer: false
 */
const QuizSchema = Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

module.exports = mongoose.models.Quiz || mongoose.Model('Quiz', QuizSchema);
