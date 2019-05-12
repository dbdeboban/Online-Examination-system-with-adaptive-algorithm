const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SectionScoreSchema = new Schema({
    sectionid: Number,
    sectionScore: Number
});

module.exports = mongoose.model('SectionScore', SectionScoreSchema);