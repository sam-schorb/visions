import { TwitterApi } from 'twitter-api-v2';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust this value based on your needs
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, url, imageData } = req.body;

  if (!text || !url || !imageData) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  try {
    const twitterClient = client.readWrite;

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');

    // Upload the image
    const mediaId = await twitterClient.v1.uploadMedia(buffer, { mimeType: 'image/png' });

    // Post the tweet with the image
    const tweet = await twitterClient.v2.tweet({
      text: `${text}\n${url}`,
      media: { media_ids: [mediaId] }
    });

    res.status(200).json({ success: true, data: tweet });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ error: 'Failed to post tweet', details: error.message });
  }
}