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

    // Extract the code block
    const codeStartIndex = sketchCode.indexOf('```');
    if (codeStartIndex !== -1) {
      sketchCode = sketchCode.slice(codeStartIndex + 3);
      const codeEndIndex = sketchCode.indexOf('```');
      if (codeEndIndex !== -1) {
        sketchCode = sketchCode.slice(0, codeEndIndex);
      }
    }
  } else {
    // Handle the response as plain text
    const codeStartIndex = sketchCode.indexOf('<code>');
    if (codeStartIndex !== -1) {
      sketchCode = sketchCode.slice(codeStartIndex + 6);
      const codeEndIndex = sketchCode.indexOf('</code>');
      if (codeEndIndex !== -1) {
        sketchCode = sketchCode.slice(0, codeEndIndex);
      }
    }
  }

  sketchCode = sketchCode.replace(/<\/?code>/g, '').trim();
  return sketchCode;
};