import mongoose from 'mongoose';
const connectionString = 'mongodb+srv://admin:Team3202@ratl.jhan6qk.mongodb.net/' || '';

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {});
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB };
