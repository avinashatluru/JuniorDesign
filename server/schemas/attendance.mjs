import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  dates: {
    type: [Date],
    required: true
  },
  attendees: [[{
    type: Schema.Types.ObjectId,
    ref: 'Attendee'
  }]]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
