export const extractSketchCode = (response) => {
  // Get the response string from object if necessary
  let sketchCode = typeof response === 'object' && response.response 
    ? response.response 
    : response;

  sketchCode = sketchCode.trim();
  
  // Regular expression to match content between code blocks or XML tags
  const regex = /(?:```(?:javascript|jsx)?[\r\n]*([\s\S]*?)```)|(?:<code>([\s\S]*?)<\/code>)/;
  
  // Try to find a match
  const match = regex.exec(sketchCode);
  
  if (match) {
    // match[1] will have content from markdown code blocks, match[2] from XML tags
    sketchCode = (match[1] || match[2]).trim();
  } else {
    // If no code blocks found, try to find just the p5.js sketch structure
    const sketchRegex = /\(?p\)?\s*=>\s*{[\s\S]*};/;
    const sketchMatch = sketchRegex.exec(sketchCode);
    if (sketchMatch) {
      sketchCode = sketchMatch[0].trim();
    }
  }
  
  // Clean up any escape sequences
  sketchCode = sketchCode.replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/\\'/g, "'");
  
  return sketchCode;
};