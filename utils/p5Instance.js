'use client';

import p5 from 'p5';

let p5Instance = null;

export const initializeP5Instance = (sketchFunction) => {
  if (p5Instance) {
    p5Instance.remove();
  }
  p5Instance = new p5(sketchFunction);
};

export const getP5Instance = () => p5Instance;
