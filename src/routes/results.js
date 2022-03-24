/* eslint-disable no-underscore-dangle */
const log = require('npmlog');
const express = require('express');
const { v4: uuid } = require('uuid');
const Result = require('../models/result');
const buildErrorJSON = require('../helpers/buildErrorJSON');

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
router.get('/results', (req, res) => {
  Result.find({}, {}, {}, (err, data) => {
    if (err) {
      log.error('/GET results', err);
      res.sendStatus(500);
      return;
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
router.get('/results/:id', (req, res) => {
  const { id } = req.params;
  log.verbose('/GET:id results', 'get id = %s', id);

  Result.findOne({ id }, {}, {}, (err, data) => {
    if (err) {
      log.error('/GET:id results', err);
      log.error('/GET:id results', `cannot find for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (data) {
      log.verbose('/GET:id results', data);
      const document = { ...data.toObject() };
      delete document._id;
      res.json(document);
    } else {
      log.verbose('/GET:id results', 'no data');
      buildErrorJSON(res, 404, `No result found for id "${id}"`);
    }
  });
});

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
router.post('/results', (req, res) => {
  const { quizId, email, responses } = req.body;
  if (!quizId || !email || !responses) {
    buildErrorJSON(res, 400, 'Missing data');
    return;
  }

  // Create the Result object
  const result = new Result({
    id: uuid(),
    quizId,
    email,
    responses,
  });

  // Save it
  result.save((err, doc) => {
    if (err) {
      log.error('/POST:id results', err);
      log.error('/POST:id results', `cannot create for data=${req.body}`);
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
router.put('/results/:id', (req, res) => {
  const { id } = req.params;
  log.verbose('/PUT:id results', 'put id = %s', id);

  Result.findOneAndUpdate({ id }, req.body, { new: true }, (err, data) => {
    if (err) {
      log.error('/PUT:id results', err);
      log.error('/PUT:id results', `cannot find & update for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (data) {
      const document = { ...data.toObject() };
      delete document._id;
      res.json(document);
    } else {
      log.verbose('/PUT:id results', 'no data');
      buildErrorJSON(res, 404, `No result found for id "${id}"`);
    }
  });
});

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
router.delete('/results/:id', (req, res) => {
  const { id } = req.params;
  log.verbose('/DELETE:id results', 'delete id = %s', id);
  Result.deleteOne({ id }, (err, query) => {
    if (err) {
      log.error('/DELETE:id results', err);
      log.error('/DELETE:id results', `cannot delete for id=${id}`);
      res.sendStatus(500);
      return;
    }

    if (query.deletedCount === 0) {
      log.verbose('/DELETE:id results', 'no data');
      buildErrorJSON(res, 404, `No result found for id "${id}"`);
      return;
    }

    res.sendStatus(204);
  });
});

module.exports = router;
