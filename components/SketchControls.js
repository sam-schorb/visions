'use client'

import React, { useState, useEffect } from 'react';
import Button from './ui/button';
import Input from './ui/input';
import { FaPlus, FaCode, FaRedo, FaCamera, FaQuestion, FaKey, FaMagic } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';

const placeholders = [
  "Type an idea, e.g. Raining blue triangles...",
  "Type an idea, e.g. Bouncing balls grow when they touch...",
  "Type an idea, e.g. Psychedelic controllable spirograph...",
  "Type an idea, e.g. Echoing warping hyper cube...",
  "Type an idea, e.g. Recursive flowers...",
  "Type an idea, e.g. Rainbow snake follows the mouse...",
  "Type an idea, e.g. Simulate a black hole...",
  "Type an idea, e.g. Detailed water painting game..."
];

const SketchControls = ({
  onSubmit,
  onToggleCodeModal,
  onToggleHelpModal,
  onToggleAPIModal,
  onResetSketch,
  onNewSketch,
  isLoading,
  modalSketchCode,
  showNotification
}) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, inputValue); // Pass the inputValue to onSubmit
    setInputValue(''); // Clear the input after submission
    // Change placeholder after submission
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  const getEncodedSketchUrl = () => {
    const encodedSketch = btoa(encodeURIComponent(modalSketchCode)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = `${window.location.origin}/?code=${encodedSketch}`;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Encoded URL copied to clipboard!');
    });
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between lg:justify-start md:space-x-2 pb-6">
        <Button variant="default" size="default" onClick={onNewSketch} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaPlus />
          <span className="hidden md:inline">New</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleCodeModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaCode />
          <span className="hidden md:inline">Code</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleAPIModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaKey />
          <span className="hidden md:inline">API</span>
        </Button>
        <Button variant="default" size="default" onClick={onResetSketch} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaRedo />
          <span className="hidden md:inline">Reset</span>
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={getEncodedSketchUrl}
          className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0"
        >
          <FaCamera />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleHelpModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaQuestion />
          <span className="hidden md:inline">Help</span>
        </Button>
      </div>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', alignItems: 'center', paddingBottom: '40px', width: '100%' }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', backgroundColor: 'bg-gray-500' }}>
          {!isLoading ? (
            <>
              <Input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: '100%', backgroundColor: 'bg-black', color: 'bg-gray-500' }}
                className="bg-black text-gray-300"
              />
              <Button type="submit" className="ml-2 flex items-center space-x-2">
                <FaMagic />
                <span className="hidden md:inline">Generate</span>
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
              <HashLoader color="#ffffff" loading={isLoading} size={40} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SketchControls;