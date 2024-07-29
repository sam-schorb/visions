'use client'

import React, { useState, useEffect } from 'react';
import { FaTimes, FaKey, FaMagic } from 'react-icons/fa';
import Link from 'next/link';

const HelpModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'help-modal-overlay') {
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
        #help-modal-overlay {
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
        #help-modal-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #help-modal {
          position: relative;
          width: min(90%, 800px);
          height: 80%;
          background-color: #D3D3D3;
          overflow: hidden;
          color: black;
          border-radius: 10px;
          transition: width 1s, height 1s, background 1s, border 1s;
        }
        #help-modal.opening {
          animation: modalOpenAnimation 1s forwards;
        }
        #help-modal.hidden {
          width: 100%;
          height: 0;
          background: rgba(211, 211, 211, 0);
          border: 0px;
        }
        #help-modal-header {
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
        #help-modal-content {
          margin-top: 60px;
          padding-left: 30px;
          padding-right: 30px;
          padding-bottom: 30px;
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
        .logo-svg {
          filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(106%) contrast(101%);
          transition: filter 0.3s;
        }
        .logo-svg:hover {
          filter: invert(50%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(83%) contrast(101%);
        }
      `}</style>
      <div id="help-modal-overlay" className={`${isClosing ? 'hidden' : ''} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
        <div id="help-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''} bg-gray-300 text-black rounded-lg relative`}>
          <div id="help-modal-header" className="absolute top-0 left-0 right-0 h-15 bg-gray-400 flex items-center justify-center rounded-t-lg">
            <Link href="https://www.iimaginary.com/" target="_blank" rel="noopener noreferrer" className="absolute left-4">
              <div className="w-10 h-10 relative">
                <img
                  src="/cloudLogoSVG.svg"
                  alt="iImaginary Cloud Logo"
                  className="logo-svg"
                />
              </div>
            </Link>
            <h2 className="text-white text-2xl">VISIONS</h2>
            <button id="close-button" onClick={closeModalWithTransition} className="absolute top-4 right-5 text-black">
              <FaTimes />
            </button>
          </div>
          <div id="help-modal-content" className="overflow-y-auto mt-16">
            <br />
            <h3 className="text-xl">AI-ASSISTED VISUAL SYNTHESIS</h3>
            <br />
            <p>
              Visions allows users to create generative art sketches using artificial intelligence. It is designed to be accessible for people with no coding experience. Visions was created by Sam @ IImaginary. More information can be found here: <a href="https://github.com/sam-schorb/visions" className="text-blue-500">https://github.com/sam-schorb/visions</a>
            </p>
            <br />
            <div>
              <div className="text-xl">To get started:</div>
              <br />
              <ol className="pl-5 list-decimal">
                <li>Close this window</li>
                <li>Type whatever you&apos;d like to see into the input box, e.g. &quot;raining blue triangles&quot;</li>
                <li>Click generate (<FaMagic className="inline-block mx-1" />)</li>
                <li>Play with some sliders</li>
              </ol>
            </div>
            <br />
            <div>
              <div className="text-xl">Generating a New Sketch:</div>
              <br />
              <ol className="pl-5 list-decimal">
                <li><strong>Create</strong>: Click the &quot;New&quot; button to spawn a random sketch</li>
                <li><strong>Modify</strong>: Enter a text description and hit &quot;Generate&quot; to apply AI-powered changes</li>
              </ol>
            </div>
            <br />
            <div>
              <div className="text-xl">Adjusting Parameters:</div>
              <br />
              <ul className="pl-5 list-disc">
                <li><strong>Expand</strong>: Click &quot;Add Slider&quot; to introduce new parameter controls</li>
                <li><strong>Refine</strong>: Drag sliders to fine-tune sketch attributes in real-time</li>
              </ul>
            </div>
            <br />
            <div>
              <div className="text-xl">Code Editing:</div>
              <br />
              <ol className="pl-5 list-decimal">
                <li><strong>Access</strong>: Open the code editor via the &quot;Code&quot; button</li>
                <li><strong>Modify</strong>: Make direct changes to the P5JS code</li>
                <li><strong>Apply</strong>: Click &quot;Save&quot; to see your modifications in action</li>
              </ol>
            </div>
            <br />
            <div>
              <div className="text-xl">API Management:</div>
              <br />
              <ol className="pl-5 list-decimal">
                <li>Open the API window (<FaKey className="inline-block mx-1" />) and input an API key</li>
                <li><strong>Select</strong>: Choose your desired AI provider from the dropdown</li>
                <li><strong>Close</strong>: Close the API window and generate a new sketch using your selected provider</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpModal;
