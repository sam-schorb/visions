'use client'

import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const HelpModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'help-modal-overlay') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="help-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '50%',
          height: '50%',
          backgroundColor: '#D3D3D3',
          overflow: 'auto',
          color: 'black',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: '#A9A9A9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <h2 style={{ color: 'white', fontSize: '24px' }}>VISIONS</h2>
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '17px',
            right: '20px',
            background: 'none',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <FaTimes />
        </button>
        <div style={{ marginTop: '80px', paddingLeft: '30px', paddingRight: '30px' }}>
          <h3 style={{ fontSize: '20px' }}>AI-ASSISTED VISUAL SYNTHESIS</h3>
          <br />
          <p style={{ fontSize: '16px' }}>########</p>
          <br />
          <p>
            Visions allows users to create generative art sketches using P5JS and artificial intelligence. It is designed to be accessible for people with no coding experience.
          </p>
          <br />
          <div>
            <div style={{ fontSize: '20px' }}>Generating Visions:</div>
            <br />
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> Users can modify the current sketch by providing a text description of the desired changes.</li>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> The user&apos;s input is sent to an AI model, which generates an updated version of the sketch code based on the user&apos;s instructions.</li>
            </ul>
          </div>
          <br />
          <div>
            <div style={{ fontSize: '20px' }}>Parameter Adjustment:</div>
            <br />
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> Visions generates sliders which adjust parameters of the sketch in real-time.</li>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> These parameters can include variables like color, size or speed, which influence the visual output.</li>
            </ul>
          </div>
          <br />
          <div>
            <div style={{ fontSize: '20px' }}>Code Editing:</div>
            <br />
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> For users with coding knowledge or those interested in learning, Visions provides a code editor modal.</li>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> The code editor displays the underlying code of the current sketch, so you can experiment with the code in real-time.</li>
            </ul>
          </div>
          <br />
          <div>
            <div style={{ fontSize: '20px' }}>API Integration:</div>
            <br />
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> Visions uses AI APIs, including GPT-4o and Google Gemini, to power the AI-assisted sketch generation.</li>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> Select your API provider from the available options.</li>
              <li style={{ listStyleType: 'none' }}><span style={{ marginLeft: '-10px' }}>*</span> At present, you will need to provide your own API key to use the AI-powered features of Visions.</li>
            </ul>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default HelpModal;