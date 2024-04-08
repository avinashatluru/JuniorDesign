
import express from 'express';
const router = express.Router();
import Attendee from '../schemas/attendee.mjs';
import Program from '../schemas/program.mjs';

// Create a new attendee
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, birthday } = req.body;
    const newattendee = new Attendee({ firstName, lastName, birthday });
    const savedattendee = await newattendee.save();
    res.json(savedattendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all attendees
router.get('/', async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attendee = await Attendee.findById(id);
    if (!attendee) {
      return res.status(404).json({ message: 'attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a attendee by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, birthday } = req.body;
    const updatedattendee = await Attendee.findByIdAndUpdate(
      id,
      { firstName, lastName, birthday },
      { new: true }
    );
    res.json(updatedattendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a attendee by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Attendee.findByIdAndDelete(id);
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get the programs a certain attendeeID is in.
router.get('/:id/programs', async (req, res) => {
  try {
    const { id } = req.params;
    // Find all programs where the attendees array contains the attendeeId
    const programs = await Program.find({ attendees: id });
    if (programs.length === 0) {
      return res.status(404).json({ message: 'No programs found for this attendee.' });
    }
    res.json(programs);
  } catch (error) {
    console.error('Error finding programs for attendee:', error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
