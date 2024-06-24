// pages/api/askGemini.js
import cors, { runMiddleware } from '../../middlewares/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userMessage = req.body.message;
  const apiKey = req.headers['x-api-key']; // Get the API key from the request headers

  if (!apiKey) {
    return res.status(401).json({ error: 'API key not provided' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (!chatInstance) {
      // Start a new chat if there is no existing instance
      chatInstance = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
    }

    // Send the new message
    const result = await chatInstance.sendMessage(`${basePrompt}${userMessage}`);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
}
