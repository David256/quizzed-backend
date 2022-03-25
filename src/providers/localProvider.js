const log = require('npmlog');
const { v4: uuid } = require('uuid');

/**
 * @typedef { Object } Question Quiz data
 * @property { String } questionId The question id
 * @property { String } question The question
 * @property { Boolean } answer The correct answer
 */

/**
 * Generate some question.
 * @returns { [Question] }
 */
function getQuestions() {
  return [
    {
      questionId: uuid(),
      question: 'Python is an interpreted language',
      answer: true,
    },
    {
      questionId: uuid(),
      question: 'ExpressJS is a code library to image processing',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'Javascript allows us to execute the function asynchronously',
      answer: true,
    },
    {
      questionId: uuid(),
      question: 'Javascript is the same as Java',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'The isNaN function allows to know if a passed value is an array',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'All Docker images contain a mini-OS with all minimum needed to work',
      answer: true,
    },
    {
      questionId: uuid(),
      question: 'HTTP code 204 means that the resource is located in another location',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'CORS means cross-origin resource sharing',
      answer: true,
    },
  ];
}

/**
 * Request a quiz from local and send response to callback.
 * @param { QuizCallback } [cb] The callback that handles the response
 * @param { Number } [amount=1] The amount of quizzes
 * @returns { Promise<[Question]> }
 */
async function localProvider(cb, amount) {
  log.verbose('localProvider', `call provider, cb=${!!cb}, amount=${amount}`);
  log.verbose('localProvider', 'get quetions from local');

  const quizData = getQuestions();
  if (typeof cb === 'function') cb(quizData);
  return quizData;
}

/**
 * This callback receives the quiz when it is requested.
 * @callback QuizCallback
 * @param { [Question] } quizData The quiz data.
 */

module.exports = localProvider;
