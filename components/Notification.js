'use client'

import React, { useEffect, useState } from 'react';

const Notification = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50%',
        height: '40px',
        backgroundColor: '#2D3748',
        color: 'white',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 3px -1px rgba(0,0,0,0.1), 0 1px 0 0 rgba(25,28,33,0.02), 0 0 0 1px rgba(25,28,33,0.08)',
        zIndex: 1000,
      }}
    >
      <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        <span style={{ fontSize: '16px' }}>{message}</span>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'none',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Notification;
