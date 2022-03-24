const log = require('npmlog');
const axios = require('axios').default;

/**
 * @typedef { Object } Question Quiz data
 * @property { String } questionId The question id
 * @property { String } question The question
 * @property { Boolean } answer The correct answer
 */

// For more categories read https://quizapi.io/categories
const categories = [
  'Linux',
  'Docker',
];

/**
 * Request a quiz from quizapi.io and send response to callback.
 * @param { QuizCallback } [cb=null] The callback that handles the response
 * @param { Number } [amount=1] The amount of quizzes
 * @returns { Promise<[Question]> }
 */
async function quizapiProvider(cb, amount) {
  log.verbose('quizapiProvider', `call provider, cb=${!!cb}, amount=${amount}`);
  const limit = amount || 1;
  // Check if we have the secret api token
  const { SECRET_API_TOKEN } = process.env;
  if (!SECRET_API_TOKEN) {
    log.error(
      'quizapiProvider',
      'Cannot call quizapiProvider method without a secret API token',
    );
    if (typeof cb === 'function') cb(null);
    return null;
  }

  // Get a random category
  const index = Math.floor(Math.random() * categories.length);
  const category = categories[index];
  log.verbose('quizapiProvider', `get category index ${index}`);
  log.verbose('quizapiProvider', `category is ${category}`);

  try {
    const response = await axios.get('https://quizapi.io/api/v1/questions', {
      headers: { 'X-Api-Key': SECRET_API_TOKEN },
      params: {
        limit,
        difficulty: 'Hard',
        category,
      },
    });

    if (typeof cb === 'function') cb(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      log.error('quizapiProvider', error.response.data);
      log.error('quizapiProvider', error.response.status);
      log.error('quizapiProvider', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is instance of http.ClientRequest in node.js
      log.error('quizapiProvider', error.request);
    } else {
      // Something happens, but we don't know why
      log.error('quizapiProvider', error.message);
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

module.exports = quizapiProvider;
