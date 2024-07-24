'use client'

import React, { useState, useEffect } from 'react';
import Button from './ui/button';
import Textarea from './ui/textareagrow';
import { FaPlus, FaCode, FaRedo, FaUpload, FaQuestion, FaKey, FaMagic } from 'react-icons/fa';
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
    if (inputValue.trim()) {
      onSubmit(e, inputValue);
      setInputValue('');
      setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
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
        <Button variant="default" size="default" onClick={onResetSketch} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaRedo />
          <span className="hidden md:inline">Reset</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleCodeModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaCode />
          <span className="hidden md:inline">Code</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleAPIModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaKey />
          <span className="hidden md:inline">API</span>
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={getEncodedSketchUrl}
          className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0"
        >
          <FaUpload />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button variant="default" size="default" onClick={onToggleHelpModal} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaQuestion />
          <span className="hidden md:inline">Help</span>
        </Button>
      </div>
      <form onSubmit={handleFormSubmit} className="flex pb-10 w-full">
        <div className="flex-grow flex items-start">
          {!isLoading ? (
            <>
              <Textarea
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-black text-gray-300 rounded-md mr-2"
              />
              <Button type="submit" className="flex-shrink-0 flex items-center mt-0.5 space-x-2">
                <FaMagic />
                <span className="hidden md:inline">Generate</span>
              </Button>
            </>
          ) : (
            <div className="flex justify-center items-center h-10 w-full">
              <HashLoader color="#ffffff" loading={isLoading} size={40} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SketchControls;