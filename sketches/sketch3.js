// sketches/sketch3.js

window.sketch3 = (p) => {
    let initialSize = 300;
    let numTriangles = 50;
    let angleOffset = p.PI / 20;
    let sizeDecrement = 6;
    let rotationSpeed = 0.01;
  
    p.setup = () => {
      p.createCanvas(800, 800);
    };
  
    function drawSpirograph(x, y, size, numTriangles, angleOffset, sizeDecrement) {
      let angle = p.frameCount * rotationSpeed;
      for (let i = 0; i < numTriangles; i++) {
        p.push();
        p.translate(x, y);
        p.rotate(angle + i * angleOffset);
        p.fill(p.map(i, 0, numTriangles, 0, 255), 255, 255);
        p.triangle(
          -size / 2, size / (2 * Math.sqrt(3)),
          size / 2, size / (2 * Math.sqrt(3)),
          0, -size / Math.sqrt(3)
        );
        p.pop();
        size -= sizeDecrement;
      }
    }
  
    p.draw = () => {
      p.colorMode(p.HSB, 255);
      p.background(0);
      drawSpirograph(p.width / 2, p.height / 2, initialSize, numTriangles, angleOffset, sizeDecrement);
    };
  };