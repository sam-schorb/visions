// sketches/sketch4.js

window.sketch4 = 
(p) => {
  let width = 400
  let height = 800
  let flowSpeed = 0.01;
  let waveAmplitude = 50;
  let waveFrequency = 0.1;
  let gridSize = 80;
  let colorCycleSpeed = 0.02;

  p.setup = () => {
    p.createCanvas(800, 800, p.WEBGL);
    p.frameRate(60);
  };

  p.draw = () => {
    p.background(0);
    p.lights();
    drawWaterSurface();
  };

  function drawWaterSurface() {
    p.push();
    p.rotateX(p.PI / 3);
    let size = width;
    for (let i = 0; i < size; i += gridSize) {
      for (let j = 0; j < size; j += gridSize) {
        let dx = i - size / 2;
        let dy = j - size / 2;
        let distance = p.sqrt(dx * dx + dy * dy);
        let offset = p.floor(distance / gridSize) * 0.3;
        let z = p.sin(p.frameCount * flowSpeed + offset) * waveAmplitude;
        
        p.push();
        p.translate(i - size / 2, j - size / 2, z);
        p.noStroke();
        let waterColor = getColorFromTime(p.frameCount * colorCycleSpeed + offset);
        p.fill(waterColor);
        p.box(gridSize - 2, gridSize - 2, 2);
        p.pop();
      }
    }
    p.pop();
  }

  function getColorFromTime(t) {
    let r = p.sin(t + 0) * 127 + 128;
    let g = p.sin(t + p.PI / 3) * 127 + 128;
    let b = p.sin(t + p.PI * 2 / 3) * 127 + 128;
    return p.color(r, g, b);
  }

};