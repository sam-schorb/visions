'use client'

import React, { useEffect, useState } from 'react';
import Button from './ui/button';
import Input from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radiogroup";
import { FaPlus, FaTimes } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const APIModal = ({ isOpen, onClose, onSelectAPIKey, selectedAPI, onAPIChange }) => {
  const [rows, setRows] = useState([{ apiKey: '', provider: '', selected: true }]);
  const [availableProviders, setAvailableProviders] = useState(['OpenAI', 'Gemini']);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (rows.length === 1) {
      setSelectedRowIndex(0);
    }
  }, [rows]);

  useEffect(() => {
    const selectedAPI = rows[selectedRowIndex];
    if (selectedAPI) {
      onSelectAPIKey(selectedAPI);
    }
  }, [rows, selectedRowIndex, onSelectAPIKey]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'api-modal-overlay') {
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

  const handleAddRow = () => {
    if (rows.length < 5) {
      const newRow = { apiKey: '', provider: '', selected: false };
      setRows([...rows, newRow]);
    }
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    if (selectedRowIndex === index) {
      setSelectedRowIndex(0);
    } else if (selectedRowIndex > index) {
      setSelectedRowIndex(selectedRowIndex - 1);
    }
  };

  const handleAPIKeyChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].apiKey = value;
    setRows(updatedRows);
  };

  const handleProviderChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].provider = value;
    setRows(updatedRows);

    const updatedProviders = availableProviders.filter((provider) => provider !== value);
    setAvailableProviders(updatedProviders);

    onAPIChange(value);
  };

  const handleSelectRow = (index) => {
    setSelectedRowIndex(index);
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
        #api-modal-overlay {
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
        #api-modal-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #api-modal {
          position: relative;
          width: min(90%, 800px);
          height: 80%;
          background-color: #D3D3D3;
          overflow: auto;
          color: black;
          border-radius: 10px;
          transition: width 1s, height 1s, background 1s, border 1s;
        }
        #api-modal.opening {
          animation: modalOpenAnimation 1s forwards;
        }
        #api-modal.hidden {
          width: 100%;
          height: 0;
          background: rgba(211, 211, 211, 0);
          border: 0px;
        }
        .modal-header {
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
        .modal-content {
          margin-top: 80px;
          padding-left: 30px;
          padding-right: 30px;
          padding-bottom: 30px;
        }
        .input-select-container {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }
        .api-input {
          flex-grow: 1;
          min-width: 0;
        }
        .provider-select {
          width: 200px;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .input-select-container {
            flex-direction: column;
            align-items: stretch;
          }
          .provider-select {
            width: 100%;
          }
        }
      `}</style>

      <div id="api-modal-overlay" className={isClosing ? 'hidden' : ''}>
        <div id="api-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''}`}>
          <div className="modal-header">
            <h2 className="text-white text-2xl">API</h2>
            <button
              onClick={closeModalWithTransition}
              className="absolute top-[17px] right-5 bg-transparent text-black border-none cursor-pointer text-base"
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-content">
            <h3 className="pb-5">Input API keys and select a provider</h3>
            <RadioGroup value={selectedRowIndex.toString()} onValueChange={(value) => handleSelectRow(parseInt(value))}>
              {rows.map((row, index) => (
                <div key={index} className="pb-5 flex items-center">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mr-2.5"
                  />
                  <div className="input-select-container">
                    <Input
                      type="text"
                      placeholder="Enter your API key"
                      value={row.apiKey}
                      onChange={(e) => handleAPIKeyChange(index, e.target.value)}
                      className="api-input"
                    />
                    <Select
                      onValueChange={(value) => handleProviderChange(index, value)}
                      value={row.provider} // Set the selected value here
                      className="provider-select"
                    >
                      <SelectTrigger className="px-2 py-1 text-black bg-white border border-gray-300 rounded text-left">
                        <SelectValue>{row.provider || "Select Provider"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectGroup>
                          <SelectLabel>Providers</SelectLabel>
                          {availableProviders.map((provider) => (
                            <SelectItem key={provider} value={provider} className="hover:bg-gray-200">
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="ml-2.5 bg-transparent text-black border-none cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </RadioGroup>
            <Button variant="default" size="default" onClick={handleAddRow} disabled={rows.length >= 5}>
              <FaPlus className="mr-2" /> Add
              </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default APIModal;