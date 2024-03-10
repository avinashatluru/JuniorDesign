import mongoose from 'mongoose';
import { parse } from 'json2csv';
import fs from 'fs';

const connectionString = 'mongodb+srv://admin:Team3202@ratl.jhan6qk.mongodb.net/' || '';

const programSchema = new mongoose.Schema({}, { collection: 'programs' });
const Program = mongoose.model('Program', programSchema);

const exportProgramsToCsv = async () => {
    try {
        await mongoose.connect(connectionString, {});
        console.log('MongoDB connected...');

        const programs = await Program.find({});
        const csv = parse(programs, { fields: Object.keys(programs[0].toObject()) });

        fs.writeFileSync('programs.csv', csv);
        console.log('Exported programs to programs.csv');

        await mongoose.disconnect();
        console.log('MongoDB disconnected...');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

exportProgramsToCsv();
