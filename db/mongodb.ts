import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
if (!uri) throw new Error("MONGODB_URI is required for authentication.");
if (!databaseName) throw new Error("MONGODB_DATABASE is required for authentication.");

const globalForMongo = globalThis as typeof globalThis & {
  __jobPilotMongo?: { client: MongoClient; promise: Promise<MongoClient> };
};
const cached =
  globalForMongo.__jobPilotMongo ??
  (() => {
    const client = new MongoClient(uri);
    return { client, promise: client.connect() };
  })();
globalForMongo.__jobPilotMongo = cached;

export async function getMongoClient() {
  return cached.promise;
}
export async function getMongoDb(): Promise<Db> {
  return (await cached.promise).db(databaseName);
}
