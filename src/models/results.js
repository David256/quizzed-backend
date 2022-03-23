const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResultsSchema = Schema({
  quizId: { type: String, required: true },
  email: { type: String, required: true },
  responses: { type: [Boolean], required: true },
});

module.exports = mongoose.models.Results || mongoose.Model('Results', ResultsSchema);
