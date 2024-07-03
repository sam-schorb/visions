export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = 'force-dynamic';

import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';

let chatInstance = null; // In-memory store for the chat instance

const basePrompt = `
You are a code generator specialized in producing p5.js sketches. 
Every input you receive is a request for p5.js code.
Do not include any explanations, comments, or additional text.
Only output the required p5.js code.
Always use variable assignments for parameter values using let and use those variables in the drawing code.
Never set canvasSize, canvasHeight or canvasWidth as variables. Always set p.createCanvas(800, 800);
Always ensure variable names are understandable and useful.
Always enclose the p5.js code within JSX tags <code> and </code>.

Example:
<code>
(p) => {
  let param1 = 50;
  let param2 = 50;
  let param3 = 100;
  let param4 = 100;

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.someFunction(param1, param2, param3, param4);
  };
};
</code>
`;

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // Limit each IP to 30 requests per window
  message: { error: 'Too many requests, please try again later.' },
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress,
});

export default async function handler(req, res) {
  console.log('Handler started');
  const startTime = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run the rate limiter
    await new Promise((resolve, reject) => {
      limiter(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        resolve(result);
      });
    });

    const { message: userMessage, apiKey } = req.body;
  
    const actualApiKey = apiKey || process.env.GEMINI_API_KEY;
  
    if (!actualApiKey) {
      return res.status(500).json({ error: 'No API key available' });
    }
  
    const genAI = new GoogleGenerativeAI(actualApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (!chatInstance) {
      chatInstance = await model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
    }

    console.log('Sending request to Gemini API');
    const result = await chatInstance.sendMessage(`${basePrompt}${userMessage}`);
    const response = await result.response;
    const text = await response.text();

    console.log('Received response from Gemini API');
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    if (error.statusCode === 429) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    } else {
      return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
  } finally {
    const endTime = Date.now();
    console.log(`Handler finished in ${endTime - startTime}ms`);
  }
}