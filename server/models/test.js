const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TestSchema = new Schema({
    testid: { type: Number, unique: true},
    sections: [{type:String}]
});


module.exports = mongoose.model('Test', TestSchema);