'use client'

import React from 'react';
import Button from './ui/button';
import Input from './ui/input';
import { FaPlus, FaCode, FaRedo, FaCamera, FaQuestion, FaKey, FaMagic } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';

const SketchControls = ({
  onSubmit,
  inputValue,
  onInputChange,
  onSnapshot,
  onToggleCodeModal,
  onToggleHelpModal,
  onToggleAPIModal,
  onResetSketch,
  onNewSketch,
  isLoading,
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between lg:justify-start md:space-x-2 pb-10">
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
        <Button variant="default" size="default" onClick={onSnapshot} className="flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
          <FaCamera />
          <span className="hidden md:inline">Photo</span>
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
                placeholder="Enter text"
                value={inputValue}
                onChange={onInputChange}
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
