/* eslint-disable no-underscore-dangle */
const log = require('npmlog');
const express = require('express');
const { v4: uuid } = require('uuid');
const Quiz = require('../models/quiz');
const buildErrorJSON = require('../helpers/buildErrorJSON');

const {
  createQuestionProviderManager,
  providerNames,
  NoApiTokenError,
} = require('../providers/createQuestionProviderManager');

const router = express.Router();

const questionAmount = Number.parseInt(process.env.AMOUNT, 10) || 10;
log.verbose('quizzes', 'question amount is %d', questionAmount);

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
 *    tags: ['quizzes']
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
router.get('/quizzes', (req, res) => {
  Quiz.find({}, {}, {}, (err, data) => {
    if (err) {
      log.error('/GET quizzes', err);
      res.sendStatus(500);
    }

    const documents = [...data].map((document) => {
      const clone = { ...document.toObject() };
      delete clone._id;
      return clone;
    });

    res.json(documents);
  });
});

/**
 * @swagger
 * /quizzes/{id}:
 *  get:
 *    summary: Get a quiz by ID.
 *    tags: ['quizzes']
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
router.get('/quizzes/:id', (req, res) => {
  const { id } = req.params;
  Quiz.findOne({ id }, {}, {}, (err, data) => {
    if (err) {
      log.error('/GET:id quizzes', err);
      log.verbose('/GET:id quizzes', `cannot find for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (data) {
      const document = { ...data.toObject() };
      delete document._id;
      res.json(document);
    } else {
      buildErrorJSON(res, 404, `no quizzes found for id "${id}"`);
    }
  });
});

/**
 * @swagger
 * /quizzes:
 *  post:
 *    summary: Create a new quiz.
 *    tags: ['quizzes']
 *    description: Receive data to create a new quiz and return it.
 *    parameters:
 *      - name: provider
 *        in: query
 *        description: This parameter set the wanted provider to use.
 *        required: false
 *        schema:
 *          type: string
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
router.post('/quizzes', async (req, res) => {
  const { name } = req.body;
  const { provider: wantedProvider } = req.query;
  log.verbose('/POST quizzes', 'wanted provider is %s', wantedProvider);

  if (!name) {
    buildErrorJSON(res, 400, 'Missing parameter "name"');
    return;
  }

  log.verbose('/POST quizzes', `name = "${name}"`);

  let questionFilter;
  // If we are testing, the filter must be local just because
  if (process.env.NODE_ENV === 'test') {
    log.verbose('/POST quizzes', 'question filter will be "local"');
    questionFilter = providerNames.local;
  } else {
    questionFilter = (wantedProvider in providerNames) ? wantedProvider : null;
  }
  log.verbose('/POST quizzes', 'provider filter is %s', questionFilter);

  const questions = [];
  try {
    // Create a question provider
    const questionProvider = createQuestionProviderManager(questionFilter, questionAmount);
    const providedQuestion = await questionProvider();
    questions.push(...providedQuestion);
  } catch (err) {
    log.error('/POST quizzes', err);
    if (err instanceof NoApiTokenError) {
      // Delegate provider choosing to the manager setting filter to null
      const otherQuestionProvider = createQuestionProviderManager(null, questionAmount);
      const providedQuestion = await otherQuestionProvider();
      questions.push(...providedQuestion);
    } else {
      // Maybe connection error. Force to use local provider
      const locaQuestionProvider = createQuestionProviderManager(
        providerNames.local,
        questionAmount,
      );
      const providedQuestion = await locaQuestionProvider();
      questions.push(...providedQuestion);
    }
  }

  const data = {
    id: uuid(),
    name,
    questions,
  };
  log.verbose('>', data);
  const quiz = new Quiz(data);

  quiz.save((err, doc) => {
    if (err) {
      log.error('/POST:id quizzes', err);
      log.error('/POST:id quizzes', `cannot create for name=${name}`);
      res.sendStatus(500);
      return;
    }

    const document = { ...doc.toObject() };
    delete document._id;
    res.json(document);
  });
});

/**
 * @swagger
 * /quizzes/{id}:
 *  put:
 *    summary: Update a quiz by ID.
 *    tags: ['quizzes']
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
router.put('/quizzes/:id', (req, res) => {
  const { id } = req.params;
  log.verbose('/PUT:id quizzes', 'put id = %s', id);

  Quiz.findOneAndUpdate({ id }, req.body, { new: true }, (err, data) => {
    if (err) {
      log.error('/PUT:id quizzes', err);
      log.error('/PUT:id quizzes', `cannot find & update for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (data) {
      const document = { ...data.toObject() };
      delete document._id;
      res.json(document);
    } else {
      log.verbose('/PUT:id quizzes', 'no data');
      buildErrorJSON(res, 404, `No result found for id "${id}"`);
    }
  });
});

/**
 * @swagger
 * /quizzes/{id}:
 *  delete:
 *    summary: Delete a quiz by ID.
 *    tags: ['quizzes']
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
router.delete('/quizzes/:id', (req, res) => {
  const { id } = req.params;
  log.verbose('/DELETE:id quizzes', 'delete id = %s', id);
  Quiz.deleteOne({ id }, (err, query) => {
    if (err) {
      log.error('/DELETE:id quizzes', err);
      log.error('/DELETE:id quizzes', `cannot delete for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (query.deletedCount === 0) {
      log.verbose('/DELETE:id quizzes', 'no data');
      buildErrorJSON(res, 404, `No result found for id "${id}"`);
      return;
    }

    res.sendStatus(204);
  });
});

module.exports = router;
