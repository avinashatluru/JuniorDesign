const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
