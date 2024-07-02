import cors, { runMiddleware } from '../../middlewares/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

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

export default async function handler(req) {
  console.log('Handler started'); // Add logging to trace execution
  const startTime = Date.now();

  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { message: userMessage, apiKey } = await req.json();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not provided' }), { status: 401 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (!chatInstance) {
      // Start a new chat if there is no existing instance
      chatInstance = await model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
    }

    // Send the new message
    console.log('Sending request to Gemini API'); // Add logging to trace execution
    const result = await chatInstance.sendMessage(`${basePrompt}${userMessage}`);
    const response = await result.response;
    const text = await response.text();

    console.log('Received response from Gemini API'); // Add logging to trace execution
    return new Response(JSON.stringify({ response: text }), { status: 200 });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return new Response(JSON.stringify({ error: 'Failed to communicate with Gemini API' }), { status: 500 });
  } finally {
    const endTime = Date.now();
    console.log(`Handler finished in ${endTime - startTime}ms`); // Add logging to trace execution time
  }
}
