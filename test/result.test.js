/* eslint-disable no-unused-expressions */
/* global describe, it, beforeEach */
const chai = require('chai');
const chaiHttp = require('chai-http');

// Prepare MongoDB
require('mongoose');

// Get the model to test
/** @type { import('mongoose').Model } */
const Result = require('../src/models/result');

// Create an app
const app = require('../src');

// Config chai to HTTP tests
const { expect } = chai;
chai.use(chaiHttp);

describe('Result', () => {
  beforeEach((done) => {
    Result.deleteMany({}, done);
  });

  describe('/GET results', () => {
    it('should GET all results', (done) => {
      chai.request(app)
        .get('/results')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(200);
          expect(res.body).is.an('array');
          expect(res.body.length).is.equal(0);
          done();
        });
    });
  });

  describe('/GET/:id results', () => {
    it('should NOT GET a non-existent result', (done) => {
      chai.request(app)
        .get('/results/non-existent-event-id')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('error');
          done();
        });
    });

    it('should GET a existent result', (done) => {
      // These are data to create a temporal Result object
      const id = 'the-result-id';
      const quizId = 'the-quiz-id';
      const email = 'error418@mail.co';
      const responses = [
        { questionId: 1, response: true },
        { questionId: 2, response: false },
      ];
      // Create the Result object
      const createdResult = Result({
        id,
        quizId,
        email,
        responses,
      });
      createdResult.save((error, result) => {
        expect(error).is.null;
        chai.request(app)
          .get(`/results/${result.id}`)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(200);
            expect(res.body).is.an('object');
            expect(res.body).has.property('id').that.is.equal(id);
            expect(res.body).has.property('quizId').that.is.equal(quizId);
            expect(res.body).has.property('email').that.is.equal(email);
            expect(res.body).has.property('responses').has.lengthOf(2);
            expect(res.body.responses).to.have.deep.members(responses);
            done();
          });
      });
    });
  });

  describe('/POST results', () => {
    it('should NOT POST a result object with missing data', (done) => {
      const badResultData = {
        id: 'the-result-id',
        quizId: 'the-quiz-id',
        email: 'nobody@mail.co',
      };
      chai.request(app)
        .post('/results')
        .set('Content-Type', 'application/json')
        .send(badResultData)
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(400);
          expect(res.body).has.property('statusCode').that.is.equal('400');
          expect(res.body).has.property('message');
          done();
        });
    });

    it('should POST a result object', (done) => {
      // These are data to create a temporal Result object
      const resultData = {
        id: 'the-result-id',
        quizId: 'the-quiz-id',
        email: 'herebedragons@mail.co',
        responses: [
          { questionId: 1, response: true },
          { questionId: 2, response: false },
        ],
      };
      chai.request(app)
        .post('/results')
        .set('Content-Type', 'application/json')
        .send(resultData)
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(200);
          expect(res.body).is.an('object');
          expect(res.body).has.property('id').that.is.equal(resultData.id);
          expect(res.body).has.property('quizId').that.is.equal(resultData.quizId);
          expect(res.body).has.property('email').that.is.equal(resultData.email);
          expect(res.body).has.property('responses').has.lengthOf(2);
          expect(res.body.responses).to.have.deep.members(resultData.responses);
          done();
        });
    });
  });

  describe('/PUT/:id results', () => {
    it('should NOT PUT a non-existent result', (done) => {
      chai.request(app)
        .put('/results/non-existent-event-id')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('error');
          done();
        });
    });

    it('should UPDATE a result given the ID', (done) => {
      // These are data to create a temporal Result object
      const id = 'the-result-id';
      const quizId = 'the-quiz-id';
      const email = 'art.of.listen@mail.co';
      const responses = [
        { questionId: 1, response: true },
        { questionId: 2, response: false },
      ];
      // Create the Result object
      const createdResult = Result({
        id,
        quizId,
        email,
        responses,
      });
      // Update
      const resultUpdate = {
        responses: [
          { questionId: 1, response: false },
          { questionId: 2, response: false },
          { questionId: 3, response: false },
        ],
      };
      createdResult.save((error, result) => {
        expect(error).is.null;
        chai.request(app)
          .put(`/results/${result.id}`)
          .set('Content-Type', 'application/json')
          .send(resultUpdate)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(200);
            expect(res.body).is.an('object');
            expect(res.body).has.property('id').that.is.equal(id);
            expect(res.body).has.property('quizId').that.is.equal(quizId);
            expect(res.body).has.property('email').that.is.equal(email);
            expect(res.body).has.property('responses').has.lengthOf(3);
            expect(res.body.responses).to.have.deep.members(resultUpdate.responses);
            done();
          });
      });
    });
  });

  describe('/DELETE/:id results', () => {
    it('should NOT DELETE a non-existent result', (done) => {
      chai.request(app)
        .delete('/results/non-existent-event-id')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('error');
          done();
        });
    });

    it('should DELETE a existent result given the ID', (done) => {
      // These are data to create a temporal Result object
      const id = 'the-result-id';
      const quizId = 'the-quiz-id';
      const email = 'error418@mail.co';
      const responses = [
        { questionId: 1, response: true },
        { questionId: 2, response: false },
      ];
      // Create the Result object
      const createdResult = Result({
        id,
        quizId,
        email,
        responses,
      });
      createdResult.save((error, result) => {
        expect(error).is.null;
        chai.request(app)
          .delete(`/results/${result.id}`)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(204);
            done();
          });
      });
    });
  });
});
