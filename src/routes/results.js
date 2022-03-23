const log = require('npmlog');
const express = require('express');
const { v4: uuid } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /results:
 *  get:
 *    summary: Get all the results.
 *    description: Get all the existent results.
 *    responses:
 *      200:
 *        description: All the results.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Result'
 *      500:
 *        description: Internal server error.
 */
router.get('/results', (req, res) => {});

/**
 * @swagger
 * /results/{id}:
 *  get:
 *    summary: Get a result by ID.
 *    description: Get a specify result by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The result id.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A requested result.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Result'
 *      404:
 *        description: The requested result does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.get('/results/:id', (req, res) => {});

/**
 * @swagger
 * /results:
 *  post:
 *    summary: Create a new result.
 *    description: Receive data to create a new result and return it.
 *    requestBody:
 *      description: the quiz result to add.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Result'
 *    responses:
 *      200:
 *        description: A requested result.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Result'
 *      400:
 *        description: Bad request.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.post('/results', (req, res) => {});

/**
 * @swagger
 * /results/{id}:
 *  put:
 *    summary: Update a result by ID.
 *    description: Update a specify result by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The result id.
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Modified data for the result.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Result'
 *    responses:
 *      200:
 *        description: The updated result.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Result'
 *      400:
 *        description: Bad request.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: The requested result does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.put('/results/:id', (req, res) => {});

/**
 * @swagger
 * /results/{id}:
 *  delete:
 *    summary: Delete a result by ID.
 *    description: Delete a specify result by given ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The result id.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      204:
 *        description: The result was deleted.
 *      404:
 *        description: The requested result does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error.
 */
router.delete('/results/:id', (req, res) => {});

module.exports = router;
