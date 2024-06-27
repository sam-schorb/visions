import { encrypt, decrypt } from '../../utils/encryption';
import { v4 as uuidv4 } from 'uuid';
import { parseCookies, setCookie } from 'nookies'; // Using nookies for cookie handling

let apiKeys = {}; // This should be a database in a real application

export default function handler(req, res) {
  const cookies = parseCookies({ req });
  let userId = cookies.userId;

  if (!userId) {
    userId = uuidv4();
    setCookie({ res }, 'userId', userId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
    });
  }

  if (req.method === 'POST') {
    const { apiKey, provider } = req.body;

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Store the encrypted key
    if (!apiKeys[userId]) {
      apiKeys[userId] = {};
    }
    apiKeys[userId][provider] = encryptedKey;

    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    if (!userId || !apiKeys[userId]) {
      return res.status(404).json({ error: 'No API key found' });
    }

    // Decrypt and return the API keys
    const decryptedKeys = Object.entries(apiKeys[userId]).reduce((acc, [provider, encryptedKey]) => {
      acc[provider] = decrypt(encryptedKey);
      return acc;
    }, {});

    res.status(200).json(decryptedKeys);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
