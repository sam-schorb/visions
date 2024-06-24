'use client'

import React, { useState, useEffect } from 'react';
import Textarea from './ui/textarea';
import Button from './ui/button';
import { FaCopy, FaEdit, FaSave, FaTimes, FaBan } from 'react-icons/fa';

const CodeModal = ({ isOpen, onClose, displayedCode, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState(displayedCode);

  useEffect(() => {
    setEditedCode(displayedCode);
  }, [displayedCode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'code-modal-overlay') {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(editMode ? editedCode : displayedCode).then(() => {
      alert('Code copied to clipboard');
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedCode(displayedCode);
  };

  const handleSave = () => {
    setEditMode(false);
    onSave(editedCode);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="code-modal-overlay"
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
          height: 'calc(50% + 60px)',
          backgroundColor: '#D3D3D3',
          color: 'black',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '60px',
            backgroundColor: '#A9A9A9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <h2 style={{ color: 'white', fontSize: '24px' }}>Code Viewer</h2>
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
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '30px' }}>
          {editMode ? (
            <Textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              style={{
                width: '100%',
                height: 'calc(105%)',
                color: 'black',
                fontFamily: 'monospace',
                padding: '10px',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'black' }}>
              {displayedCode}
            </pre>
          )}
        </div>
        {!editMode && (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              backgroundColor: '#A9A9A9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '30px',
              paddingRight: '30px',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
          >
            <Button
              onClick={handleCopy}
              style={{
                background: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaCopy style={{ marginRight: '5px' }} /> Copy
            </Button>
            <Button
              onClick={handleEdit}
              style={{
                background: 'green',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaEdit style={{ marginRight: '5px' }} /> Edit
            </Button>
          </div>
        )}
        {editMode && (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              backgroundColor: '#D3D3D3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '30px',
              paddingRight: '30px',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
          >
            <Button
              onClick={handleCopy}
              style={{
                background: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaCopy style={{ marginRight: '5px' }} /> Copy
            </Button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                onClick={handleSave}
                style={{
                  background: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaSave style={{ marginRight: '5px' }} /> Save
              </Button>
              <Button
                onClick={handleCancel}
                style={{
                  background: 'gray',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaBan style={{ marginRight: '5px' }} /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeModal;
