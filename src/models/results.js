const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResponseSchema = Schema({
  questionId: { type: String, required: true },
  response: { type: Boolean, required: true },
});

const ResultsSchema = Schema({
  quizId: { type: String, required: true },
  email: { type: String, required: true },
  responses: { type: [ResponseSchema], required: true },
});

module.exports = mongoose.models.Results || mongoose.Model('Results', ResultsSchema);
