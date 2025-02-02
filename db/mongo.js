const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv")

dotenv.config()

const url = process.env.MONGO_URI;
const dbName = "myapp";

let db 

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(url);
        console.log("Connected to MongoDB");
        db = client.db(dbName);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
}

function getDatabase() {
    if (!db) throw new Error("Database not initialized. Call connectToDatabase() first.");
    return db;
}

module.exports = {connectToDatabase, getDatabase}