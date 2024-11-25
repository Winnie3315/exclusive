import { MongoClient } from "mongodb";
import mongoose, { Mongoose } from "mongoose";

// MongoClient Setup
const uri = process.env.MONGODB_URL || "";
const mongoOptions = {};

if (!process.env.MONGODB_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let mongoClient: MongoClient;
let mongoClientPromise: Promise<MongoClient>;

mongoClient = new MongoClient(uri, mongoOptions);
mongoClientPromise = mongoClient.connect();

export const mongoClientConnect = async (): Promise<MongoClient> => {
  return mongoClientPromise;
};

// Mongoose Setup
const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let mongooseCached: MongooseConn = (global as any).mongoose;

if (!mongooseCached) {
  mongooseCached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const mongooseConnect = async (): Promise<Mongoose> => {
  if (mongooseCached.conn) return mongooseCached.conn;

  mongooseCached.promise =
    mongooseCached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "clerkauthv5",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

  mongooseCached.conn = await mongooseCached.promise;

  return mongooseCached.conn;
};
