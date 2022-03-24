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
      question: 'A',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'B',
      answer: false,
    },
    {
      questionId: uuid(),
      question: 'C',
      answer: false,
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
