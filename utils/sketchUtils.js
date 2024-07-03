// utils/sketchUtils.js
export const INITIAL_SLIDER_VALUE = 50;
export const RENDER_STILL_DELAY = 2000;


export const extractSketchCode = (response) => {
  let sketchCode = response.trim();

  // Check if the response is a string literal
  if (sketchCode.startsWith('"') && sketchCode.endsWith('"')) {
    // Remove the outer quotation marks
    sketchCode = sketchCode.slice(1, -1);

    // Unescape the special characters
    sketchCode = sketchCode.replace(/\\n/g, '\n').replace(/\\`/g, '`');
  }

  // Handle code blocks with backticks
  const backtickMatch = sketchCode.match(/```(\w+)?\s*([\s\S]*?)```/);
  if (backtickMatch) {
    sketchCode = backtickMatch[2].trim();
  } else {
    // Handle the response as plain text with <code> tags
    const codeStartIndex = sketchCode.indexOf('<code>');
    if (codeStartIndex !== -1) {
      sketchCode = sketchCode.slice(codeStartIndex + 6);
      const codeEndIndex = sketchCode.indexOf('</code>');
      if (codeEndIndex !== -1) {
        sketchCode = sketchCode.slice(0, codeEndIndex);
      }
    }
  }

  // Remove any remaining <code> tags
  sketchCode = sketchCode.replace(/<\/?code>/g, '').trim();

  // Ensure the sketch code is wrapped in a function
  if (!sketchCode.startsWith('(p) =>') && !sketchCode.startsWith('function')) {
    sketchCode = `(p) => {\n${sketchCode}\n}`;
  }

  return sketchCode;
};