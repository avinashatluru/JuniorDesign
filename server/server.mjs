
import express from 'express';
import cors from 'cors';
import {connectDB}  from './db/conn.mjs';
import attendees from './routes/attendees.mjs';
import programs from './routes/programs.mjs';
import attendance from './routes/attendance.mjs';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/attendees', attendees);
app.use('/api/program', programs);
app.use('/api/attendance', attendance)

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
