const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: Number
});

module.exports = mongoose.model('Question', QuestionSchema);