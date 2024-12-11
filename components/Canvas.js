'use client';

import React, { useEffect, useState } from 'react';
import Button from './ui/button'; 
import { FaExpand, FaCompress } from 'react-icons/fa';

const Canvas = ({ sketchRef, renderKey, isFullscreen, onToggleFullscreen, frameWidth, frameHeight }) => {
  const [isP5Loaded, setIsP5Loaded] = useState(false);

  useEffect(() => {
    const checkP5Loaded = () => {
      if (sketchRef.current && sketchRef.current.children.length > 0) {
        setIsP5Loaded(true);
      } else {
        setTimeout(checkP5Loaded, 100); // Check again after 100ms
      }
    };

    checkP5Loaded();

    return () => {
      setIsP5Loaded(false);
    };
  }, [renderKey]);

  return (
    <div style={{ position: 'relative', width: frameWidth, height: frameHeight }}>
      {!isP5Loaded && (
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            color: '#666'
          }}
        >
          Loading Sketch...
        </div>
      )}
      <div 
        ref={sketchRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          visibility: isP5Loaded ? 'visible' : 'hidden'
        }}
      ></div>
      <Button
        onClick={onToggleFullscreen}
        variant="default"
        size="default"
        className="absolute flex items-center"
        style={{
          bottom: '10px',
          right: '10px',
          width: '130px',
          zIndex: 10
        }}
      >
        {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      </Button>
    </div>
  );
};

export default Canvas;