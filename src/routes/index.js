const log = require('npmlog');
const express = require('express');
const quizzes = require('./quizzes');
const results = require('./results');

const router = express.Router();

router.use(quizzes);
router.use(results);

router.get('/', (req, res) => {
  log.verbose('Index', 'server the root endpoint and shows info');
  res.json({
    message: 'It works',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    source: 'https://github.com/David256/quizzed-backend.git',
  });
});

module.exports = router;
