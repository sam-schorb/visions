'use client';

import React from 'react';
import Button from './ui/button'; 
import { FaExpand, FaCompress } from 'react-icons/fa';

const Canvas = ({ sketchRef, renderKey, isFullscreen, onToggleFullscreen, frameWidth, frameHeight }) => {
  return (
    <div>
      <div ref={sketchRef}></div>
      <div id="sketch-container" key={renderKey}></div>
      <Button
        onClick={onToggleFullscreen}
        variant="default"
        size="default"
        className="absolute flex items-center"
        style={{
          top: `${frameHeight - 50}px`,
          left: `${frameWidth - 140}px`,
          width: '130px',
        }}
      >
        {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      </Button>
    </div>
  );
};

export default Canvas;
