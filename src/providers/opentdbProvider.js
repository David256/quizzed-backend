const log = require('npmlog');
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

    if (typeof cb === 'function') cb(response.data);
    return response.data;
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
