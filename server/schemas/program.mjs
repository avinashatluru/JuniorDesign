import mongoose from 'mongoose';
import Attendee from './attendee.mjs';

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
  attendees: [Attendee]
});

const Program = mongoose.model('Program', programSchema);
export default Program;
