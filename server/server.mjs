
import express from 'express';
import cors from 'cors';
import {connectDB}  from './db/conn.mjs';
import users from './routes/users.mjs';
import programs from './routes/programs.mjs';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/programs', programs);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
