'use client'

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

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
          overflow: auto;
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
        }
        #help-modal-content {
          margin-top: 80px;
          padding-left: 30px;
          padding-right: 30px;
          padding-bottom: 30px;
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
      <div id="help-modal-overlay" className={`${isClosing ? 'hidden' : ''} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
        <div id="help-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''} bg-gray-300 text-black rounded-lg overflow-auto`}>
          <div id="help-modal-header" className="absolute top-0 left-0 right-0 h-15 bg-gray-400 flex items-center justify-center rounded-t-lg">
            <h2 className="text-white text-2xl">VISIONS</h2>
          </div>
          <button id="close-button" onClick={closeModalWithTransition} className="absolute top-4 right-5 text-black">
            <FaTimes />
          </button>
          <div id="help-modal-content" className="mt-20 px-8 pb-8">
            <h3 className="text-xl">AI-ASSISTED VISUAL SYNTHESIS</h3>
            <br />
            <p>
              Visions allows users to create generative art sketches using P5JS and artificial intelligence. It is designed to be accessible for people with no coding experience. Visions was created by Sam @ IImaginary. More information can be found here: <a href="https://github.com/sam-schorb/visions" className="text-blue-500">https://github.com/sam-schorb/visions</a>
            </p>
            <br />
            <div>
              <div className="text-xl">To get started:</div>
              <br />
              <ol className="pl-5 list-decimal">
                <li>Close this window</li>
                <li>Open the API window and input an API key</li>
                <li>Type whatever you&apos;d like to see into the input box, e.g. &quot;raining blue triangles&quot;</li>
                <li>Click generate</li>
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
                <li><strong>Configure</strong>: Launch the API modal using the &quot;API&quot; button</li>
                <li><strong>Integrate</strong>: Input your API credentials</li>
                <li><strong>Select</strong>: Choose your desired AI provider from the dropdown</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpModal;