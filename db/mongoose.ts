import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
if (!uri) throw new Error("MONGODB_URI is required for application data.");
if (!databaseName) throw new Error("MONGODB_DATABASE is required for application data.");
const mongoUri = uri;
const mongoDatabaseName = databaseName;

const globalForMongoose = globalThis as typeof globalThis & {
  __jobPilotMongoose?: {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};
const cached = globalForMongoose.__jobPilotMongoose ?? { connection: null, promise: null };
globalForMongoose.__jobPilotMongoose = cached;

export async function connectMongoose() {
  if (cached.connection?.connection.readyState === 1) return cached.connection;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, { dbName: mongoDatabaseName }).catch((error) => {
      cached.promise = null;
      throw new Error(
        `MongoDB application connection failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    });
  }
  cached.connection = await cached.promise;
  return cached.connection;
}
