const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ScoreSchema = new Schema({
    testid: Number,
    score:[{type: String}]
});

module.exports = mongoose.model('ScoreSchema', ScoreSchema);