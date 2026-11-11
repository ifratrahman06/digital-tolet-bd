import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(
    MONGODB_URI &&
    !MONGODB_URI.includes('user:password') &&
    !MONGODB_URI.includes('<db_password>') &&
    !MONGODB_URI.includes('<password>')
  );
}

export function getConnectionState(): string {
  if (!mongoose.connection) return 'disconnected';
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'uninitialized';
  }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!isDatabaseConfigured()) {
    // Return null safely if credentials are still placeholder templates
    return null;
  }

  // If connection is already open and active, reuse it immediately (avoids multi-connection overhead)
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        console.log('✅ Connected to MongoDB Atlas successfully.');
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB connection warning:', err.message);
        cached.promise = null; // Clear promise so subsequent calls can retry cleanly
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.conn || cached.conn.connection.readyState !== 1) {
      cached.promise = null;
      cached.conn = null;
    }
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;
