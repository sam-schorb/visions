// sketches/sketch1.js

window.sketch1 = (p) => {
  let numLayers = 20;
  let spiralStep = 5;
  let baseRadius = 10;
  let colorShiftSpeed = 0.01;
  let waveFrequency = 0.1;
  let waveAmplitude = 80;
  let numWaves = 8;

  p.setup = () => {

    p.createCanvas(800, 800);
    p.noFill();
  };

  p.draw = () => {
    
    p.background(0);
    p.translate(p.width / 2, p.height / 2);
    for (let i = 0; i < numLayers; i++) {
      let t = p.frameCount * waveFrequency + i * 0.2;
      let currentRadius = baseRadius + i * spiralStep;
      p.stroke(p.color(
        p.map(p.sin(t * colorShiftSpeed), -1, 1, 0, 255),
        p.map(p.cos(t * colorShiftSpeed + i), -1, 1, 0, 255),
        p.map(p.sin(t * colorShiftSpeed + i * 2), -1, 1, 0, 255)
      ));
      p.beginShape();
      for (let a = 0; a < p.TWO_PI; a += p.PI / 100) {
        let waveOffset = waveAmplitude * p.sin(numWaves * a + t);
        let x = (currentRadius + waveOffset) * p.cos(a);
        let y = (currentRadius + waveOffset) * p.sin(a);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  }

};