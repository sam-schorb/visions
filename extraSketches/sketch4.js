// sketches/sketch4.js

window.sketch4 = (p) => {
  let brownDogX = 300;
  let brownDogY = 500;
  let brownDogSpeed = 2;

  let greyDogX = 500;
  let greyDogY = 500;
  let greyDogSpeed = -2;

  p.setup = () => {
    p.createCanvas(800, 800);
  };

  p.draw = () => {
    p.background(200);

    brownDogX += brownDogSpeed;
    greyDogX += greyDogSpeed;

    if (brownDogX > p.width + 50 || brownDogX < -50) {
      brownDogSpeed *= -1;
    }

    if (greyDogX > p.width + 50 || greyDogX < -50) {
      greyDogSpeed *= -1;
    }

    drawDog(brownDogX, brownDogY, [139, 69, 19], [255, 215, 0]);
    drawDog(greyDogX, greyDogY, [169, 169, 169], [255, 182, 193]);
  };

  function drawDog(xPos, yPos, bodyColor, hatColor) {
    let bodyX = xPos;
    let bodyY = yPos;
    let bodyWidth = 200;
    let bodyHeight = 100;

    let headX = bodyX + 150;
    let headY = bodyY - 50;
    let headSize = 75;

    let legWidth = 20;
    let legHeight = 70;
    let frontLegX = bodyX + 20;
    let backLegX = bodyX + 160;
    let legY = bodyY + bodyHeight;

    let tailX = bodyX - 30;
    let tailY = bodyY + 30;
    let tailWidth = 20;
    let tailHeight = 70;
    let tailAngle = p.PI / 4;

    let eyeSize = 10;
    let eyeLeftX = headX - 20;
    let eyeRightX = headX + 20;
    let eyeY = headY - 20;

    let noseX = headX;
    let noseY = headY;
    let noseSize = 10;

    let earWidth = 30;
    let earHeight = 50;
    let earLeftX = headX - 40;
    let earRightX = headX + 40;
    let earY = headY - 50;

    let tailSin = p.sin(p.frameCount * 0.1) * 15;

    p.fill(bodyColor);
    p.rect(bodyX, bodyY, bodyWidth, bodyHeight);

    p.ellipse(headX, headY, headSize, headSize);

    p.rect(frontLegX, legY, legWidth, legHeight);
    p.rect(backLegX, legY, legWidth, legHeight);

    p.push();
    p.translate(tailX, tailY);
    p.rotate(tailAngle + p.radians(tailSin));
    p.rect(0, 0, tailWidth, tailHeight);
    p.pop();

    p.fill(0);
    p.ellipse(eyeLeftX, eyeY, eyeSize, eyeSize);
    p.ellipse(eyeRightX, eyeY, eyeSize, eyeSize);

    p.fill(0);
    p.ellipse(noseX, noseY, noseSize, noseSize);
    
    p.fill(bodyColor);
    p.triangle(earLeftX, earY, earLeftX + earWidth, earY, earLeftX - 5, earY + earHeight);
    p.triangle(earRightX, earY, earRightX - earWidth, earY, earRightX + 5, earY + earHeight);

    if (hatColor) {
      let hatBaseX = headX;
      let hatBaseY = headY - headSize / 2 - 20;
      let hatHeight = 50;
      let hatWidth = 30;
      p.fill(hatColor);
      p.triangle(hatBaseX, hatBaseY - hatHeight / 2, hatBaseX - hatWidth / 2, hatBaseY + hatHeight / 2, hatBaseX + hatWidth / 2, hatBaseY + hatHeight / 2);
    }
  }
};