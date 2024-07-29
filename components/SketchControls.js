'use client'

import React, { useState, useEffect } from 'react';
import Button from './ui/button';
import Textarea from './ui/textareagrow';
import { FaPlus, FaCode, FaRedo, FaUpload, FaQuestion, FaKey, FaMagic, FaCopy } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';
import { nanoid } from 'nanoid';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown';

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
  onToggleShareModal, 
  onResetSketch,
  onNewSketch,
  isLoading,
  modalSketchCode,
  showNotification,
  onNanoIdChange,
  onTakeSnapshot,

}) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [currentNanoId, setCurrentNanoId] = useState(null);

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

  const getEncodedSketchUrl = async () => {
    try {
      const encodedSketch = btoa(encodeURIComponent(modalSketchCode));
  
      // Save the sketch to MongoDB
      const response = await fetch('/api/saveSketch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: currentNanoId, encodedCode: encodedSketch }),
      });
  
      if (response.ok) {
        const url = `${window.location.origin}/?sketch=${currentNanoId}`;
        navigator.clipboard.writeText(url).then(() => {
          showNotification('Sketch URL copied to clipboard!');
        });
      } else {
        showNotification('Failed to save sketch');
      }
    } catch (error) {
      console.error('Error saving sketch:', error);
      showNotification('Error saving sketch');
    }
  };

  const handlePublish = () => {
    onToggleShareModal(); // Use the prop function to open the ShareModal
  };

  const handleShareMenuOpen = () => {
    const newNanoId = nanoid(10);
    setCurrentNanoId(newNanoId);
    onNanoIdChange(newNanoId);
    onTakeSnapshot(); // Call the takeSnapshot function
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
        <DropdownMenu onOpenChange={(open) => {
          if (open) handleShareMenuOpen();
        }}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="default"
              className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0"
            >
              <FaUpload />
              <span className="hidden md:inline">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black border border-gray-300 rounded shadow-md">
            <DropdownMenuItem onClick={getEncodedSketchUrl} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-200 cursor-pointer">
              <FaCopy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={handlePublish} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-200 cursor-pointer">
              <FaUpload className="w-4 h-4" />
              <span>Publish to Twitter/X</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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