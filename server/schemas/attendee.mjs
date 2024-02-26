import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  }
});

const Attendee = mongoose.model('User', attendeeSchema);

export default Attendee;
