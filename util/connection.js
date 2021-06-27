import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

if (!MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable inside .env.local")
}

let cached = global.MongoClient;
if (!cached) {
    cached = global.mongo = { connection: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        cached.promise = MongoClient.connect(MONGODB_URI, options).then(client => {
            return {
                client,
                db: client.db(MONGODB_DB)
            }
        })
    }

    cached.connection = await cached.promise;
    return cached.connection;
}

export function isConnected() {
    return global.mongo.connection.client.isConnected();  
}