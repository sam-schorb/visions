import cors, { runMiddleware } from '../../middlewares/cors';
import OpenAI from 'openai';

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

let chatHistory = []; // In-memory store for the chat history

export default async function handler(req, res) {
  console.log('Handler started'); // Add logging to trace execution
  const startTime = Date.now();

  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message: userMessage, apiKey } = req.body;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key not provided' });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const newMessage = { role: "user", content: `${basePrompt}${userMessage}` };
  chatHistory.push(newMessage);

  try {
    console.log('Sending request to OpenAI'); // Add logging to trace execution
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatHistory,
      max_tokens: 1000,
    });

    const assistantMessage = response.choices[0].message;
    chatHistory.push(assistantMessage);

    console.log('Received response from OpenAI'); // Add logging to trace execution
    res.status(200).json({ response: assistantMessage.content });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI API' });
  } finally {
    const endTime = Date.now();
    console.log(`Handler finished in ${endTime - startTime}ms`); // Add logging to trace execution time
  }
}
