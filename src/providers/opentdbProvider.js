const log = require('npmlog');
const { v4: uuid } = require('uuid');
const axios = require('axios').default;

/**
 * @typedef { Object } Question Quiz data
 * @property { String } questionId The question id
 * @property { String } question The question
 * @property { Boolean } answer The correct answer
 */

/**
 * Request a quiz from opentdb.com and send response to callback.
 * @param { QuizCallback } [cb] The callback that handles the response
 * @param { Number } [amount=1] The amount of quizzes
 * @returns { Promise<[Question]> }
 */
async function opentdbProvider(cb, amount) {
  log.verbose('opentdbProvider', `call provider, cb=${!!cb}, amount=${amount}`);
  const limit = amount || 1;

  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: limit,
        difficulty: 'hard',
        type: 'boolean',
      },
    });

    const processedData = response.data.results.map((result) => {
      // Choose some answer and set `answer` according to choosing
      let answer;
      let chosenAnswer;
      if (Math.random() < 0.5) {
        // Choose a good answer
        chosenAnswer = result.correct_answer;
        answer = true;
      } else {
        // Choose a bad answer randomly
        chosenAnswer = result.incorrect_answers[
          Math.floor(Math.random() * result.incorrect_answers.length)
        ];
        answer = false;
      }
      log.verbose('manager:processedData', `answer ${chosenAnswer} is ${answer}`);

      // Remove dot and semicolon symbols in the end of string.
      /** @type { String } */
      let originalQuestion = result.question.trim();
      if (originalQuestion.endsWith('.') || originalQuestion.endsWith(';')) {
        originalQuestion = originalQuestion.slice(0, originalQuestion.length - 1);
      }
      log.verbose(
        'manager:processedData',
        'original question changed by "%s"',
        originalQuestion,
      );

      // Humanize the question
      if (['True', 'False'].includes(chosenAnswer)) {
        chosenAnswer = chosenAnswer === 'True' ? 'yes' : 'not';
      } else {
        chosenAnswer = `"${chosenAnswer}"`;
      }
      log.verbose('processedData', 'chosen answer is %s', chosenAnswer);

      const question = `${originalQuestion}? the correct answer is ${chosenAnswer}`;
      return {
        questionId: uuid(),
        question,
        answer,
      };
    });

    if (typeof cb === 'function') cb(processedData);
    return processedData;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      log.error('opentdbProvider', error.response.data);
      log.error('opentdbProvider', error.response.status);
      log.error('opentdbProvider', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is instance of http.ClientRequest in node.js
      log.error('opentdbProvider', error.request);
    } else {
      // Something happens, but we don't know why
      log.error('opentdbProvider', error.message);
    }

    if (typeof cb === 'function') cb(null);
    return null;
  }
}

/**
 * This callback receives the quiz when it is requested.
 * @callback QuizCallback
 * @param { [Question] } quizData The quiz data.
 */

module.exports = opentdbProvider;
