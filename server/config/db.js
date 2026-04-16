const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try persistent connection if URI is provided
    if (process.env.MONGO_URI) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000 // Timeout after 5s
        });
        console.log(`MongoDB Connected (Persistent): ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`Persistent DB failed (${err.message}). Falling back to Memory Server...`);
      }
    }

    // Fallback to memory server for demo/testing
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (Memory Server): ${conn.connection.host}`);
  } catch (err) {
    console.error(`Critical Database Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
