
import express from 'express';
const router = express.Router();
import Program from '../schemas/program.mjs';

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

export default router;
