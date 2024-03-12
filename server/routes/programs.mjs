
import express from 'express';
const router = express.Router();
import Program from '../schemas/program.mjs';
import Attendee from '../schemas/attendee.mjs';
import mongoose from 'mongoose';

// Create a new program
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, date, site} = req.body;
    const newProgram = new Program({ name, date, site, attendees: [] });
    const savedProgram = await newProgram.save();
    res.json(savedProgram);
  } catch (error) {
    console.error('Error creating program:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a program by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, site } = req.body;
    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { name, date, site },
      { new: true }
    );
    res.json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a program by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndDelete(id);
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a program by ID to add attendees without duplicates
router.put('/:id/add-attendees', async (req, res) => {
  try {
    const { id } = req.params;
    const { attendeesToAdd } = req.body; // Expect an array of attendee IDs to add

    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { $addToSet: { attendees: { $each: attendeesToAdd } } },
      { new: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(updatedProgram);
  } catch (error) {
    console.error('Error updating program to add attendees:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/Attendees', async (req, res) => {
  const { id } = req.params;
  try {
    const program = await Program.findById(id);
    if (program) {
        res.json(program.attendees);
    } else {
      res.status(404).send('Program not found');
    }} catch (error) {
      console.error('Error finding attendees for program', error);
      res.status(500).json({ message: error.message })
  }
});


router.get('/:id/getAttendees', async (req, res) => {
  const { id } = req.params;
  try {
    const program = await Program.findById(id);
    if (program) {
      // Fetch detailed attendee information for each ID
      const attendeeDetails = await Attendee.find({
        '_id': { $in: program.attendees }
      });

      res.json(attendeeDetails);
    } else {
      res.status(404).send('Program not found');
    }
  } catch (error) {
    console.error('Error finding attendees for program', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:programId/removeAttendees', async (req, res) => {
  try {
    const { programId } = req.params;
    const { attendeeIds } = req.body;

    if (!Array.isArray(attendeeIds) || attendeeIds.length === 0) {
      return res.status(400).json({ message: 'No attendee IDs provided for removal.' });
    }

    // Convert attendeeIds to MongoDB ObjectIDs if they are not already
    const attendeeObjectIdArray = attendeeIds.map(id => new mongoose.Types.ObjectId(id));


    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { $pull: { attendees: { $in: attendeeObjectIdArray } } },
      { new: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ message: 'Attendees removed successfully', updatedProgram });
  } catch (error) {
    console.error('Error removing attendees from program:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
