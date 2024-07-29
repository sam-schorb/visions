import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key, encodedCode } = req.body;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('sketchdb');

    try {
      await db.collection('sketches').insertOne({ key, encodedCode });
      res.status(200).json({ success: true, key });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}