import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongoClient, getMongoDb } from "@/db/mongodb";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
if (!secret) throw new Error("BETTER_AUTH_SECRET is required for Better Auth.");
if (!baseURL) throw new Error("BETTER_AUTH_URL is required for Better Auth.");
const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
    : undefined;
const db = await getMongoDb();
const client = await getMongoClient();

export const auth = betterAuth({
  baseURL,
  secret,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  ...(google ? { socialProviders: { google } } : {}),
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
});
