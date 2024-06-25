'use client'

import React, { useState, useEffect } from 'react';
import Textarea from './ui/textarea';
import Button from './ui/button';
import { FaCopy, FaEdit, FaSave, FaTimes, FaBan } from 'react-icons/fa';

const CodeModal = ({ isOpen, onClose, displayedCode, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState(displayedCode);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setEditedCode(displayedCode);
  }, [displayedCode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'code-modal-overlay') {
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
        #code-modal-overlay {
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
        #code-modal-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #code-modal {
          position: relative;
          width: min(90%, 800px);
          height: 80%;
          background-color: #D3D3D3;
          color: black;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          transition: width 1s, height 1s, background 1s, border 1s;
        }
        #code-modal.opening {
          animation: modalOpenAnimation 1s forwards;
        }
        #code-modal.hidden {
          width: 100%;
          height: 0;
          background: rgba(211, 211, 211, 0);
          border: 0px;
        }
        .modal-header, .modal-footer {
          height: 60px;
          background-color: #A9A9A9;
        }
        .modal-header {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        .modal-footer {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .modal-content {
          flex: 1;
          overflow: auto;
          padding: 30px;
          max-width: 100%;
        }
      `}</style>

      <div id="code-modal-overlay" className={isClosing ? 'hidden' : ''}>
        <div id="code-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''}`}>
          <div className="modal-header flex items-center justify-center relative">
            <h2 className="text-white text-2xl">Code Viewer</h2>
            <button
              onClick={closeModalWithTransition}
              className="absolute top-[17px] right-5 bg-transparent text-black border-none cursor-pointer text-base"
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-content">
            {editMode ? (
              <Textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                className="w-full h-[calc(100%)] text-black font-mono p-2.5 box-border whitespace-pre overflow-x-auto"
              />
            ) : (
              <pre className="whitespace-pre overflow-x-auto text-black m-0 p-0">
                {displayedCode}
              </pre>
            )}
          </div>
          <div className={`modal-footer flex items-center justify-between px-8 ${editMode ? 'bg-[#D3D3D3]' : ''}`}>
            <Button
              onClick={handleCopy}
              className="bg-blue-500 text-white border-none rounded p-1.5 cursor-pointer flex items-center"
            >
              <FaCopy className="mr-1.5" /> Copy
            </Button>
            {editMode ? (
              <div className="flex gap-2.5">
                <Button
                  onClick={handleSave}
                  className="bg-green-500 text-white border-none rounded p-1.5 cursor-pointer flex items-center"
                >
                  <FaSave className="mr-1.5" /> Save
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white border-none rounded p-1.5 cursor-pointer flex items-center"
                >
                  <FaBan className="mr-1.5" /> Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEdit}
                className="bg-green-500 text-white border-none rounded p-1.5 cursor-pointer flex items-center"
              >
                <FaEdit className="mr-1.5" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeModal;