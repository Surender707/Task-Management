const mongoose = require('mongoose');

const connectDB = async () => {
  // Reuse existing connection in serverless environments
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Try persistent connection if URI is provided
    if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb://127.0.0.1:27017/taskflow') {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected (Persistent): ${conn.connection.host}`);
      return;
    }

    // On Vercel/serverless, require a real MongoDB URI
    if (process.env.VERCEL) {
      throw new Error('MONGO_URI must be set to a MongoDB Atlas URI for production deployment');
    }

    // Fallback to memory server for local development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
  } catch (err) {
    console.error(`Critical Database Error: ${err.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
};

module.exports = connectDB;
