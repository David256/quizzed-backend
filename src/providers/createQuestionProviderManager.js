const log = require('npmlog');
const localProvider = require('./localProvider');
const opentdbProvider = require('./opentdbProvider');
const quizapiProvider = require('./quizapiProvider');

/**
 * @typedef { Object } Question Quiz data
 * @property { String } questionId The question id
 * @property { String } question The question
 * @property { Boolean } answer The correct answer
 */

const providerNames = {
  quizapi: 'quizapi',
  opentdb: 'opentdb',
  local: 'local',
};

const availableProviders = {
  quizapi: quizapiProvider,
  opentdb: opentdbProvider,
  local: localProvider,
};

class NoApiTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoApiTokenError';
  }
}

/**
 * Create a question provider manager according to the given filter.
 * @param { String } filter The providers filter
 * @param { Number } [amount] The amount of quizzes
 * @returns { Function }
 * @throws { NoApiTokenError } If no API token is provided and filter is 'quizapi'
 */
function createQuestionProviderManager(filter, amount) {
  /**
   * @type { [quizapiProvider | opentdbProvider | localProvider] }
   */
  const providerSet = [];

  const { SECRET_API_TOKEN } = process.env;

  log.verbose('createQuestionProviderManager', 'filter is %s', filter);

  // If the user ask for quizapi, but no api token is provided, then it is wrong
  if (!SECRET_API_TOKEN && filter === providerNames.quizapi) {
    throw new NoApiTokenError('Cannot ask for quizapi if no API token is provided');
  }

  // Add providers according to the filter
  if (SECRET_API_TOKEN && filter === providerNames.quizapi) {
    log.verbose('createQuestionProviderManager', 'add provider quizapi only');
    providerSet.push(availableProviders.quizapi);
  } else if (filter === providerNames.opentdb) {
    log.verbose('createQuestionProviderManager', 'add provider opentdb only');
    providerSet.push(availableProviders.opentdb);
  } else if (filter === providerNames.local) {
    log.verbose('createQuestionProviderManager', 'add provider local only');
    providerSet.push(availableProviders.local);
  } else {
    // Add all the providers
    log.verbose('createQuestionProviderManager', 'add all providers');
    if (SECRET_API_TOKEN) {
      providerSet.push(availableProviders.quizapi);
    }
    providerSet.push(availableProviders.opentdb);
    providerSet.push(availableProviders.local);
  }

  log.verbose(
    'createQuestionProviderManager',
    'providerSet.length = %d',
    providerSet.length,
  );

  /**
   * Look for a provider that response with quiz data.
   * @param { QuizCallback } [cb] The callback that handles the response
   * @returns { Promise<[Question]> }
   */
  async function manager(cb) {
    const usedIndeces = [];

    let quizData = null;
    // Get quiz data
    // We get a random index, then get the provider, if the provider returns
    // null, then try with another provider until we don't have more providers
    // to test
    do {
      const index = Math.floor(Math.random() * providerSet.length);
      const provider = providerSet[index];
      usedIndeces.push(index);

      // eslint-disable-next-line no-await-in-loop
      quizData = await provider(null, amount);

      if (!quizData) {
        log.verbose('manager', 'no quiz data found for index %d', index);
        log.verbose('manager', `got provider ${provider.name}`);
      }
    } while (quizData === null && usedIndeces.length < providerSet.length);

    // If the last loop breaks because we used all the providers and the
    // `quizData` is still null, then somthing is wrong

    if (!quizData) {
      log.error(
        'manager',
        'it is impossible that all providers return null because local provider exists',
      );
      if (typeof cb === 'function') cb(null);
      return;
    }

    if (typeof cb === 'function') cb(quizData);
    // eslint-disable-next-line consistent-return
    return quizData;
  }

  return manager;
}

/**
 * This callback receives the quiz when it is requested.
 * @callback QuizCallback
 * @param { [Question] } quizData The quiz data.
 */

module.exports = {
  createQuestionProviderManager,
  NoApiTokenError,
  providerNames,
};
