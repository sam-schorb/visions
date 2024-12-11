window.sketch5 = (p) => {
    let numOfTriangles = 5;
    let maxSize = 100;
    let minSize = 50;
    let animationSpeed = 0.05;
  
    p.setup = () => {
      p.createCanvas(800, 800);
      p.angleMode(p.DEGREES);
    };
  
    p.draw = () => {
      p.background(0);
      p.translate(p.width / 2, p.height / 2);
  
      for (let i = 0; i < numOfTriangles; i++) {
        let size = p.map(p.sin(p.frameCount * animationSpeed + i * 50), -1, 1, minSize, maxSize);
        let hue = p.map(i, 0, numOfTriangles, 0, 255);
        p.fill(hue, 255, 255, 150);
        p.stroke(hue, 255, 255);
        p.rotate(360 / numOfTriangles + p.frameCount * animationSpeed);
        drawTriangle(size);
      }
    };
  
    function drawTriangle(size) {
      p.beginShape();
      for (let i = 0; i < 3; i++) {
        let x = size * p.cos(120 * i);
        let y = size * p.sin(120 * i);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  
    p.colorMode(p.HSB, 255);
  };