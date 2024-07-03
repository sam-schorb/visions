(p) => {
    let sunSize = 50;
    let planetSizes = [2, 4, 4, 2, 11, 9, 8, 7, 7];
    let planetColors = ['#aaaaaa', '#f4a460', '#87ceeb', '#ff6347', '#ffebcd', '#ffd700', '#00ffff', '#add8e6', '#add8e6'];
    let planetDistances = [30, 58, 80, 107, 168, 200, 250, 320, 380];
    let planetSpeeds = [4.15, 1.62, 1, 0.53, 0.084, 0.034, 0.012, 0.006, 0.003];
    let starCount = 100;
    let stars = [];
    let shootingStar = {
      x: p.random(800),
      y: p.random(800),
      vx: p.random(-2, 2),
      vy: p.random(-2, 2),
    };
  
    p.setup = () => {
      p.createCanvas(800, 800);
      for (let i=0; i<starCount; i++) {
        stars.push({x: p.random(800), y: p.random(800)});
      }
    };
  
    p.draw = () => {
      p.background(0);
      drawStars();
      
      // Sun
      p.fill(255, 204, 0);
      p.noStroke();
      p.ellipse(400, 400, sunSize, sunSize);
      
      let t = p.millis() / 1000;
  
      for (let i = 0; i < planetSizes.length; i++) {
        let x = 400 + planetDistances[i] * p.cos(t * planetSpeeds[i]);
        let y = 400 + planetDistances[i] * p.sin(t * planetSpeeds[i]);
        
        p.fill(planetColors[i]);
        p.ellipse(x, y, planetSizes[i] * 2, planetSizes[i] * 2);
        
        if (i == 5) { // Saturn rings
          p.noFill();
          p.stroke(255);
          p.ellipse(x, y, 24, 8);
        }
      }
      
      drawShootingStar();
    };
  
    function drawStars() {
      p.fill(255);
      p.noStroke();
      for (let star of stars) {
        p.ellipse(star.x, star.y, 2, 2);
      }
    }
    
    function drawShootingStar() {
      p.fill(255);
      p.ellipse(shootingStar.x, shootingStar.y, 3, 3);
      
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      
      if (shootingStar.x < 0 || shootingStar.x > 800 || shootingStar.y < 0 || shootingStar.y > 800) {
        shootingStar.x = p.random(800);
        shootingStar.y = p.random(800);
        shootingStar.vx = p.random(-2, 2);
        shootingStar.vy = p.random(-2, 2);
      }
    }
  };