const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuestionSchema = Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

const QuizSchema = Schema({
  name: { type: String, required: true },
  results: { type: [QuestionSchema], required: true },
});

module.exports = mongoose.models.Quiz || mongoose.Model('Quiz', QuizSchema);
