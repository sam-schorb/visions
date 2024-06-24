// sketches/sketch3.js

window.sketch3 = (p) => {

  let angleX = 0;
  let angleY = 0;
  let recursionDepth = 4;
  let prismSize = 200;
  let flowSpeed = 0.01;
  let waveAmplitude = 50;
  let waveFrequency = 0.1;

  p.setup = () => {

    p.createCanvas(800, 800, p.WEBGL);
    p.frameRate(60);
  };

  p.draw = () => {
    p.background(0);
    p.lights();
    p.rotateX(angleX);
    p.rotateY(angleY);
    drawPrism(0, 0, 0, prismSize, recursionDepth);
    angleX += 0.01;
    angleY += 0.01;
  };

  function drawPrism(x, y, z, size, depth) {
    if (depth === 0) return;
    p.push();
    p.translate(x, y, z);
    drawWaterSurface(size);
    p.box(size);
    p.pop();

    let newSize = size / 2;
    let positions = [
      [newSize, newSize, newSize],
      [-newSize, newSize, newSize],
      [newSize, -newSize, newSize],
      [-newSize, -newSize, newSize],
      [newSize, newSize, -newSize],
      [-newSize, newSize, -newSize],
      [newSize, -newSize, -newSize],
      [-newSize, -newSize, -newSize]
    ];
    
    for (let pos of positions) {
      drawPrism(x + pos[0], y + pos[1], z + pos[2], newSize, depth - 1);
    };
  };

  function drawWaterSurface(size) {
    p.push();
    p.translate(0, 0, size / 2);
    p.rotateX(p.PI / 2);
    for (let i = 0; i < size; i += 10) {
      for (let j = 0; j < size; j += 10) {
        let dx = i - size / 2;
        let dy = j - size / 2;
        let distance = p.sqrt(dx * dx + dy * dy);
        let offset = p.floor(distance / 10) * 0.3;
        let z = p.sin(p.frameCount * flowSpeed + offset) * waveAmplitude;
        
        p.push();
        p.translate(i - size / 2, j - size / 2, z);
        p.noStroke();
        p.fill(0, 0, 255, 127);
        p.box(10, 10, 1);
        p.pop();
      };
    };
    p.pop();
  };

};