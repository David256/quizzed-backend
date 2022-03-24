const { v4: uuid } = require('uuid');

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

module.exports = getQuestions;
