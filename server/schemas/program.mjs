import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendee'
  }]
});

const Program = mongoose.model('Program', programSchema);
export default Program;
