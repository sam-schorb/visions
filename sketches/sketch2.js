// sketches/sketch1.js

window.sketch2 = (p) => {
  let circles = [];
  let maxCircles = 50;
  let maxDistance = 50;
  let deceleration = 0.98;
  let circleRadius = 15; // Radius of the circles (half the diameter)

  class Circle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.color = p.color(0, 0, p.random(100, 255)); // Different shades of blue
    }

    update() {
      let dx = p.mouseX - this.x;
      let dy = p.mouseY - this.y;
      let distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);
      
      if (distance < maxDistance) {
        this.vx = dx * 0.1;
        this.vy = dy * 0.1;
      }

      this.x += this.vx;
      this.y += this.vy;

      this.vx *= deceleration;
      this.vy *= deceleration;

      this.checkCollision();
      this.checkEdges();
    }

    checkCollision() {
      for (let other of circles) {
        if (other !== this) {
          let dx = other.x - this.x;
          let dy = other.y - this.y;
          let distance = p.dist(this.x, this.y, other.x, other.y);
          let minDist = circleRadius * 2;

          if (distance < minDist) {
            let angle = p.atan2(dy, dx);
            let targetX = this.x + p.cos(angle) * minDist;
            let targetY = this.y + p.sin(angle) * minDist;
            let ax = (targetX - other.x) * 0.05;
            let ay = (targetY - other.y) * 0.05;

            this.vx -= ax;
            this.vy -= ay;
            other.vx += ax;
            other.vy += ay;
          }
        }
      }
    }

    checkEdges() {
      if (this.x < circleRadius) {
        this.x = circleRadius;
        this.vx *= -1;
      } else if (this.x > p.width - circleRadius) {
        this.x = p.width - circleRadius;
        this.vx *= -1;
      }

      if (this.y < circleRadius) {
        this.y = circleRadius;
        this.vy *= -1;
      } else if (this.y > p.height - circleRadius) {
        this.y = p.height - circleRadius;
        this.vy *= -1;
      }
    }

    draw() {
      p.fill(this.color);
      p.ellipse(this.x, this.y, circleRadius * 2, circleRadius * 2);
    }
  }

  p.setup = () => {
    p.createCanvas(800, 800);
    for (let i = 0; i < maxCircles; i++) {
      circles.push(new Circle(p.random(p.width), p.random(p.height)));
    }
    p.noStroke();
  };

  p.draw = () => {
    p.background(255);
    for (let circle of circles) {
      circle.update();
      circle.draw();
    }
  };
};
