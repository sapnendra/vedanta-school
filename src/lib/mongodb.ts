import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env");

type MongooseCache = {
	conn: mongoose.Mongoose | null;
	promise: Promise<mongoose.Mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
	mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
	conn: null,
	promise: null,
};

if (!globalForMongoose.mongooseCache) {
	globalForMongoose.mongooseCache = cached;
}

export async function connectDB() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
