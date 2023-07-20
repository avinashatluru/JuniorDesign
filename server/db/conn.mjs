import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString)

const client = new MongoClient(connectionString);

let conn;
try {
  console.log("Connecting to MongoDB Atlas...")
  conn = await client.connect();
  console.log("Successfully connected!")
} catch(e) {
  console.error(e);
}

let db = conn.db("RATL");

export default db;