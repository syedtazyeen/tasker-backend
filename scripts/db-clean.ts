import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.MONGO_DB_NAME!;
const mongoUri = process.env.MONGO_URI!;

async function cleanDatabase() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB, cleaning database: ${dbName}`);

    const db = client.db(dbName);
    const collections = await db.collections();

    if (collections.length === 0) {
      console.log('No collections found. Database is already empty.');
      return;
    }

    for (const collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log('Database cleaned successfully.');
  } catch (err) {
    console.error('Error cleaning database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script
cleanDatabase();
