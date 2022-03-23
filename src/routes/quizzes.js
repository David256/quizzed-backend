const log = require('npmlog');
const express = require('express');
const { v4: uuid } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Error:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: number
 *          description: The status code
 *        message:
 *          type: string
 *          description: The error ocurred
 *      example:
 *        statusCode: 40x
 *        message: 'You have problems'
 */

/**
 * @swagger
 * /quizzes:
 *  get:
 *    summary: Get all the quizzes.
 *    description: Get all the existent quizzes.
 *    responses:
 *      200:
 *        description: All the quizzes.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Quiz'
 *      500:
 *        description: Internal server error.
 */
router.get('/quizzes', (req, res) => {});

/**
 * @swagger
 * /quizzes/{id}:
 *  get:
 *    summary: Get a quiz by ID.
 *    description: Get a specify quiz by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The quiz id.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A requested quiz.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Quiz'
 *      404:
 *        description: The requested quiz does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.get('/quizzes/:id', (req, res) => {});

/**
 * @swagger
 * /quizzes:
 *  post:
 *    summary: Create a new quiz.
 *    description: Receive data to create a new quiz and return it.
 *    requestBody:
 *      description: the quiz name to create a new quiz
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            nullable: false
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *    responses:
 *      200:
 *        description: A requested quiz.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Quiz'
 *      400:
 *        description: Bad request.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.post('/quizzes', (req, res) => {});

/**
 * @swagger
 * /quizzes/{id}:
 *  put:
 *    summary: Update a quiz by ID.
 *    description: Update a specify quiz by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The quiz id.
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Modified data for the quiz.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Quiz'
 *    responses:
 *      200:
 *        description: The updated quiz.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Quiz'
 *      400:
 *        description: Bad request.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: The requested quiz does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.put('/quizzes/:id', (req, res) => {});

/**
 * @swagger
 * /quizzes/{id}:
 *  delete:
 *    summary: Delete a quiz by ID.
 *    description: Delete a specify quiz by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The quiz id.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      204:
 *        description: The quiz was deleted.
 *      404:
 *        description: The requested quiz does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.delete('/quizzes/:id', (req, res) => {});

module.exports = router;
