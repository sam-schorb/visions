'use client'

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Input from './ui/input';
import Button from './ui/button';

const ShareModal = ({ isOpen, onClose, onShare, currentNanoId, modalSketchCode, currentSnapshot }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'share-modal-overlay') {
        closeModalWithTransition();
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const closeModalWithTransition = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 1000);
  };


  const handleShare = async () => {
    setIsSharing(true);
    setError('');
    try {
      const encodedSketch = btoa(encodeURIComponent(modalSketchCode));
      
      // Save the sketch to MongoDB
      const saveResponse = await fetch('/api/saveSketch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: currentNanoId, encodedCode: encodedSketch }),
      });
  
      if (!saveResponse.ok) {
        throw new Error('Failed to save sketch');
      }
  
      const url = `${window.location.origin}/?sketch=${currentNanoId}`;
      const tweetText = `by ${userInput}`;
  
      // Post tweet with image
      const response = await fetch('/api/postTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: tweetText,
          url: url,
          imageData: currentSnapshot
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post tweet');
      }
  
      onShare(`${tweetText} ${url}`);
      closeModalWithTransition();
    } catch (error) {
      console.error('Error sharing sketch:', error);
      setError(`Failed to share sketch: ${error.message}`);
    } finally {
      setIsSharing(false);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value.slice(0, 60);
    setUserInput(input);
    setCharCount(input.length);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style jsx>{`
        @keyframes modalOpenAnimation {
          from {
            width: 100%;
            height: 0;
            background: rgba(0, 0, 0, 0);
            border: 0px;
          }
          to {
            width: min(90%, 800px);
            height: 80%;
            background: rgba(211, 211, 211, 1);
            border: 1px solid white;
          }
        }
        #share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 1s;
          opacity: 1;
        }
        #share-modal-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #share-modal {
          position: relative;
          width: min(90%, 800px);
          height: 80%;
          background-color: #D3D3D3;
          overflow: hidden;
          color: black;
          border-radius: 10px;
          transition: width 1s, height 1s, background 1s, border 1s;
        }
        #share-modal.opening {
          animation: modalOpenAnimation 1s forwards;
        }
        #share-modal.hidden {
          width: 100%;
          height: 0;
          background: rgba(211, 211, 211, 0);
          border: 0px;
        }
        #share-modal-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #A9A9A9;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          z-index: 10;
        }
        #share-modal-content {
          margin-top: 60px;
          padding: 30px;
          overflow-y: auto;
          height: calc(100% - 60px);
        }
        #close-button {
          position: absolute;
          top: 17px;
          right: 20px;
          background: none;
          color: black;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
      `}</style>
      <div id="share-modal-overlay" className={`${isClosing ? 'hidden' : ''} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
        <div id="share-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''} bg-gray-300 text-black rounded-lg relative`}>
          <div id="share-modal-header" className="absolute top-0 left-0 right-0 h-15 bg-gray-400 flex items-center justify-center rounded-t-lg">
            <h2 className="text-white text-2xl">Visions Gallery</h2>
            <button id="close-button" onClick={closeModalWithTransition} className="absolute top-4 right-5 text-black">
              <FaTimes />
            </button>
          </div>
          <div id="share-modal-content" className="overflow-y-auto mt-16">
          <p className="mb-4">
              🎨 Showcase your creativity by adding your sketch to the Visions Gallery at{' '}
              <a href="https://x.com/VisionsGallery_" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                x.com/VisionsGallery_
              </a>
            </p>
            <p className="mb-4">
              👤 Please provide your name or social media handle below.
            </p>
            <p className="mb-4">
              🚀 Once you&apos;re ready, click &apos;Share&apos; to publish your artwork.
            </p>
            <p className="mb-4 text-red-500">
              ⚠️ Note: This action cannot be undone. Make sure you&apos;re ready to share before proceeding.
            </p>
            {error && <p className="mb-4 text-red-500">❌ {error}</p>}
            <p className="mb-6">
              🙏 Thank you for sharing your work with the Visions community!
            </p>
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Your name or description"
                value={userInput}
                onChange={handleInputChange}
                className="mb-1"
                maxLength={60}
              />
              <p className={`text-sm ${charCount > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/60 characters
              </p>
              {charCount > 60 && (
                <p className="text-red-500 text-sm">Character limit (60) exceeded</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button onClick={closeModalWithTransition} variant="outline" disabled={isSharing}>
                Cancel
              </Button>
              <Button onClick={handleShare} variant="default" disabled={isSharing || !userInput.trim() || charCount > 60}>
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;