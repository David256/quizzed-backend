/* eslint-disable no-unused-expressions */
/* global describe, it, beforeEach */
const chai = require('chai');
const chaiHttp = require('chai-http');

// Prepare MongoDB
require('mongoose');

// Get the model to test
/** @type { import('mongoose').Model } */
const Quiz = require('../src/models/quiz');

// Create an app
const app = require('../src');

// Config chai to HTTP tests
const { expect } = chai;
chai.use(chaiHttp);

describe('Quiz', () => {
  beforeEach((done) => {
    Quiz.deleteMany({}, done);
  });

  describe('/GET quizzes', () => {
    it('should GET all quizzes', (done) => {
      chai.request(app)
        .get('/quizzes')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(200);
          expect(res.body).is.an('array');
          expect(res.body.length).is.equal(0);
          done();
        });
    });
  });

  describe('/GET/:id quizzes', () => {
    it('should NOT GET a non-existent quiz', (done) => {
      chai.request(app)
        .get('/quizzes/non-existent-event-id')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('message');
          done();
        });
    });

    it('should GET a existent quiz', (done) => {
      // These are data to create a temporal Quiz object
      const id = 'the-quiz-id';
      const name = 'the-quiz-name';
      const questions = [
        { questionId: 1, answer: true, question: '"1" == 1 in JS' },
        { questionId: 2, answer: false, question: '0 === false in JS' },
      ];
      // Create the Quiz object
      const createdQuiz = Quiz({
        id,
        name,
        questions,
      });
      createdQuiz.save((error, quiz) => {
        expect(error).is.null;
        chai.request(app)
          .get(`/quizzes/${quiz.id}`)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(200);
            expect(res.body).is.an('object');
            expect(res.body).has.property('id').that.is.equal(id);
            expect(res.body).has.property('name').that.is.equal(name);
            expect(res.body).has.property('questions').has.lengthOf(2);
            expect(res.body.questions).to.have.deep.members(questions);
            done();
          });
      });
    });
  });

  describe('/POST quizzes', () => {
    it('should NOT POST a quiz object with missing data', (done) => {
      const badQuizData = {};
      chai.request(app)
        .post('/quizzes')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(badQuizData)
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(400);
          expect(res.body).has.property('statusCode').that.is.equal('400');
          expect(res.body).has.property('message');
          done();
        });
    });

    it('should POST a quiz object', (done) => {
      // These are data to create a temporal Quiz object
      const quizData = {
        name: 'another quiz',
      };
      chai.request(app)
        .post('/quizzes')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(quizData)
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(200);
          expect(res.body).is.an('object');
          expect(res.body).has.property('id');
          expect(res.body).has.property('name').that.is.equal(quizData.name);
          expect(res.body).has.property('questions').has.length.greaterThan(0);
          done();
        });
    });
  });

  describe('/PUT/:id quizzes', () => {
    it('should NOT PUT a non-existent quiz', (done) => {
      chai.request(app)
        .put('/quizzes/non-existent-event-id')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('message');
          done();
        });
    });

    it('should UPDATE a quiz given the ID', (done) => {
      // These are data to create a temporal Quiz object
      const id = 'the-quiz-id';
      const name = 'the-quiz-name';
      const questions = [
        { questionId: 1, answer: true, question: '"1" == 1 in JS' },
        { questionId: 2, answer: false, question: '0 === false in JS' },
      ];
      // Create the Quiz object
      const createdQuiz = Quiz({
        id,
        name,
        questions,
      });
      // Update
      const quizUpdate = {
        questions: [
          { questionId: 1, answer: false, question: 'JS is for web only' },
        ],
      };
      createdQuiz.save((error, quiz) => {
        expect(error).is.null;
        chai.request(app)
          .put(`/quizzes/${quiz.id}`)
          .set('Content-Type', 'application/json')
          .send(quizUpdate)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(200);
            expect(res.body).is.an('object');
            expect(res.body).has.property('id').that.is.equal(id);
            expect(res.body).has.property('name').that.is.equal(name);
            expect(res.body).has.property('questions').has.lengthOf(1);
            expect(res.body.questions).to.have.deep.members(quizUpdate.questions);
            done();
          });
      });
    });
  });

  describe('/DELETE/:id quizzes', () => {
    it('should NOT DELETE a non-existent quiz', (done) => {
      chai.request(app)
        .delete('/quizzes/non-existent-event-id')
        .end((err, res) => {
          expect(err).is.null;
          expect(res).has.status(404);
          expect(res.body).has.property('message');
          done();
        });
    });

    it('should DELETE a existent quiz given the ID', (done) => {
      // These are data to create a temporal Quiz object
      const id = 'the-quiz-id';
      const name = 'the-quiz-name';
      const questions = [
        { questionId: 1, answer: true, question: '"1" == 1 in JS' },
        { questionId: 2, answer: false, question: '0 === false' },
      ];
      // Create the Quiz object
      const createdQuiz = Quiz({
        id,
        name,
        questions,
      });
      createdQuiz.save((error, quiz) => {
        expect(error).is.null;
        chai.request(app)
          .delete(`/quizzes/${quiz.id}`)
          .end((err, res) => {
            expect(err).is.null;
            expect(res).has.status(204);
            done();
          });
      });
    });
  });
});
