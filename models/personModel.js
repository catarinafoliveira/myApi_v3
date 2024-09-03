const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: String,
  idCard: {
    type: String, 
    unique: true, 
    match: [/^[0-9]{9}$/, 'idCard must be exactly 9 numerical characters'],
    minlength: [9, 'idCard must be exactly 9 numerical characters'],
    maxlength: [9, 'idCard must be exactly 9 numerical characters']
  },
  status: {
    type: String,
    default: 'active'
  }
});

const Person = mongoose.model('Person', PersonSchema);
module.exports = Person;