import express from 'express';
import Attendance from '../schemas/attendance.mjs';  // Adjust the path as necessary to where your model is defined
import Program from '../schemas/program.mjs';
import Attendee from '../schemas/attendee.mjs';
const router = express.Router();

// Create new attendance record
router.post('/', async (req, res) => {
  try {
    const { program, dates, attendees } = req.body;
    const newAttendance = new Attendance({
      program,
      dates,
      attendees
    });
    const savedAttendance = await newAttendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('program').populate('attendees');
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single attendance record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id).populate('program').populate('attendees');
    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an attendance record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { program, dates, attendees } = req.body;
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
      program,
      dates,
      attendees
    }, { new: true }).populate('program').populate('attendees');
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an attendance record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (deletedAttendance) {
      res.json({ message: 'Deleted Successfully' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
