// const mongoose = require("mongoose");

// async function connectDB(uri) {
//   try {
//     await mongoose.connect(uri);
//     console.log("MongoDB Connected Successfully");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;


const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(uri) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;