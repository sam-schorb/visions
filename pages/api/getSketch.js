import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { key } = req.query;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('sketchdb');

    try {
      const sketch = await db.collection('sketches').findOne({ key });
      if (sketch) {
        res.status(200).json({ success: true, encodedCode: sketch.encodedCode });
      } else {
        res.status(404).json({ success: false, message: 'Sketch not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}