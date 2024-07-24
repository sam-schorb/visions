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
import Link from 'next/link';

const APIModal = ({ isOpen, onClose, onSelectAPIKey, selectedAPI, onAPIChange }) => {
  const [rows, setRows] = useState([{ apiKey: '', provider: '', selected: true }]);
  const [availableProviders, setAvailableProviders] = useState(['OpenAI', 'Gemini']);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetch('/api/storeApiKey')
      .then(response => response.json())
      .then(data => {
        if (data.OpenAI || data.Gemini) {
          const loadedRows = Object.entries(data).map(([provider, apiKey]) => ({
            apiKey,
            provider,
            selected: false
          }));
          loadedRows[0].selected = true;
          setRows(loadedRows);
        }
      })
      .catch(error => console.error('Error loading API keys:', error));
  }, []);

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

  useEffect(() => {
    const currentRow = rows[selectedRowIndex];
    if (currentRow && currentRow.apiKey && currentRow.provider) {
      // Store the API key and provider on the server when both are set
      fetch('/api/storeApiKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: currentRow.apiKey, provider: currentRow.provider })
      }).catch(error => console.error('Error storing API key and provider:', error));
    }
  }, [rows, selectedRowIndex]);

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
    const rowToDelete = rows[index];

    // Delete the API key and provider from the server
    if (rowToDelete.apiKey && rowToDelete.provider) {
      fetch('/api/storeApiKey', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: rowToDelete.provider })
      }).catch(error => console.error('Error deleting API key and provider:', error));
    }

    const updatedRows = rows.filter((_, i) => i !== index);

    if (updatedRows.length === 0) {
      // No rows left, set the state to an empty API key and provider
      setRows([{ apiKey: '', provider: '', selected: true }]);
      setSelectedRowIndex(0);
      onSelectAPIKey({ apiKey: '', provider: '' });
    } else {
      setRows(updatedRows);
      setSelectedRowIndex(updatedRows.length - 1); // Select the last available row
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
        .logo-svg {
          filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(106%) contrast(101%);
          transition: filter 0.3s;
        }
        .logo-svg:hover {
          filter: invert(50%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(83%) contrast(101%);
        }
      `}</style>

      <div id="api-modal-overlay" className={isClosing ? 'hidden' : ''}>
        <div id="api-modal" className={`${isOpen ? 'opening' : ''} ${isClosing ? 'hidden' : ''}`}>
          <div className="modal-header">
            <Link href="https://www.iimaginary.com/" target="_blank" rel="noopener noreferrer" className="absolute left-4">
              <div className="w-10 h-10 relative">
                <img
                  src="/cloudLogoSVG.svg"
                  alt="iImaginary Cloud Logo"
                  className="logo-svg"
                />
              </div>
            </Link>
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
                      value={row.provider}
                    >
                      <SelectTrigger className="px-2 py-1 text-black bg-white border border-gray-300 rounded text-left">
                        <SelectValue placeholder="Providers" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectGroup>
                          <SelectLabel>Providers</SelectLabel>
                          <div className="provider-divider" />
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
