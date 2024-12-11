export const config = {
    maxDuration: 60,  // This function can run for a maximum of 60 seconds
  };
  
  import Anthropic from "@anthropic-ai/sdk";
  
  const basePrompt = `
  You are a code generator specialized in producing p5.js sketches. 
  Every input you receive is a request for p5.js code.
  Never attempt to load external images using p.loadImage() or similar functions.
  Do not include any explanations, comments, or additional text.
  Only output the required p5.js code.
  Use this code inside p.draw to centre the artwork when necessary p.translate(p.width / 2, p.height / 2);
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
    console.log('Handler started');
    const startTime = Date.now();
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { message: userMessage, apiKey, resetChat } = req.body;
  
      // No need for chat reset functionality as we're not maintaining chat state
      if (resetChat) {
        return res.status(200).json({ message: 'Chat history reset successfully' });
      }
    
      const actualApiKey = apiKey || process.env.ANTHROPIC_API_KEY;
    
      if (!actualApiKey) {
        return res.status(500).json({ error: 'No API key available' });
      }
    
      const anthropic = new Anthropic({
        apiKey: actualApiKey,
      });
  
      console.log('Sending request to Claude API');
      const result = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: [{
              type: "text",
              text: `${basePrompt}${userMessage}`
            }]
          }
        ]
      });
  
      const text = result.content[0].text;
  
      console.log('Received response from Claude API');
      return res.status(200).json({ response: text });
    } catch (error) {
      console.error('Error:', error);
      if (error.status === 429) {
        return res.status(429).json({ error: 'Too many requests, please try again later.' });
      } else {
        return res.status(500).json({ error: 'Failed to communicate with Claude API' });
      }
    } finally {
      const endTime = Date.now();
      console.log(`Handler finished in ${endTime - startTime}ms`);
    }
  }