export function extractParameters(code) {
    const parameterNames = [];
    const parameterNamesAndValues = [];
  
    const lines = code.split('\n');
    let insideFunction = false;
  
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
  
      if (line.match(/^\s*\(p\)\s*=>\s*{\s*$/) || line.match(/^\s*p\s*=>\s*{\s*$/)) {
        insideFunction = true;
      } else if (insideFunction && line.match(/^\s*let\s+/)) {
        const match = line.match(/^\s*let\s+(\w+)\s*=\s*([^;]+)\s*;?\s*$/);
        if (match) {
          const name = match[1];
          let value = match[2].trim();
  
          if (name === 'canvasSize') {
            continue;
          }
  
          if (!isNaN(Number(value))) {
            parameterNames.push(name);
            parameterNamesAndValues.push([name, Number(value)]);
          }
        }
      } else if (insideFunction && line === '}') {
        insideFunction = false;
      }
    }
  
    return { parameterNames, parameterNamesAndValues };
  }
  
export function insertParameterNames(sketchCode, parameterNames) {
    return new Promise((resolve, reject) => {
      const setParamsCode = `

  p.setParams = (newParams) => {
    ${parameterNames.map((name, index) => `if (newParams[${index}] !== undefined) ${name} = newParams[${index}];`).join('\n    ')}
  };`;
  
      console.log('paramsCode', setParamsCode);
  
      // Remove the final }; and append the setParamsCode, then add the final };
      const updatedSketchCode = sketchCode.replace(/(\s*}\s*;\s*)$/, `${setParamsCode}\n$1`);
      console.log('updatedSketchCode', updatedSketchCode);
  
      resolve(updatedSketchCode);
    });
  }


  export function generateSliderLinkageCode(parameterNames) {

    const setParamsFromSliders = parameterNames.map(name => `if (sliders['${name}']) ${name} = parseFloat(sliders['${name}'].value());`).join('\n    ');

    const setSingleParamCode = `
p.setSingleParam = (paramName, paramValue) => {
    ${parameterNames.map(name => `
    if (paramName === '${name}') {
        ${name} = paramValue;
        console.log('Single param updated:', paramName, paramValue);
    }`).join('\n    ')}
};`;

    const setParamsCode = `
p.setParams = (params) => {
    console.log('Setting multiple params:', params);
    ${parameterNames.map(name => `if (params.${name} !== undefined) ${name} = params.${name};`).join('\n    ')}
    p.setParamsFromSliders();
    console.log('Current param values:', {
        ${parameterNames.map(name => `${name}`).join(', ')}
    });
};
`;

    return {
        sliderInitializationCode: `
sliders = {};

for (let key in sliders) {
    if (sliders[key]) {
        sliders[key].input(() => {
            p.setParamsFromSliders();
        });
    }
}
`,
        setParamsFromSlidersCode: `
p.setParamsFromSliders = () => {
    ${setParamsFromSliders}
    console.log('Params from sliders updated:', {
        ${parameterNames.map(name => `${name}`).join(', ')}
    });
};
`,
        setSingleParamCode: setSingleParamCode,
        setParamsCode: setParamsCode
    };
}


export const generateCanvasSize = (frameWidth, frameHeight, existingCode) => {
  // Extract renderer argument if present
  const matches = existingCode.match(/p\.createCanvas\s*\(\s*\d+\s*,\s*\d+\s*(?:,\s*p\.\w+\s*)?\)/);
  if (matches && matches[0]) {
    const parts = matches[0].split(',');
    if (parts.length === 3) {
      const renderer = parts[2].trim().replace(')', '');
      return `p.createCanvas(${frameWidth}, ${frameHeight}, ${renderer});`;
    }
  }
  return `p.createCanvas(${frameWidth}, ${frameHeight});`;
};


