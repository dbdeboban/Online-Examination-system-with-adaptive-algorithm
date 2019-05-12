const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    sectionid : Number,
    questions : [{type: String}]
});


module.exports = mongoose.model('Section', SectionSchema);