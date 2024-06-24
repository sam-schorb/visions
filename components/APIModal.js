'use client'

import React, { useEffect, useState } from 'react';
import Button from './ui/button';
import Input from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radiogroup";
import { FaPlus } from 'react-icons/fa';
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

  useEffect(() => {
    const selectedAPI = rows[selectedRowIndex];
    if (selectedAPI) {
      console.log('Selected API:', selectedAPI);
    }
  }, [rows, selectedRowIndex]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="api-modal-overlay"
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
          <h2 style={{ color: 'white', fontSize: '24px' }}>API</h2>
        </div>
        <div style={{ marginTop: '80px', paddingLeft: '30px' }}>
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
            X
          </button>
          <h3 style={{ paddingBottom: '20px' }}>Input API keys and select a provider</h3>
          <RadioGroup value={selectedRowIndex.toString()} onValueChange={(value) => handleSelectRow(parseInt(value))}>
            {rows.map((row, index) => (
              <div key={index} style={{ paddingBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  style={{ marginRight: '10px' }}
                />
                <Input
                  type="text"
                  placeholder="Enter your API key"
                  value={row.apiKey}
                  onChange={(e) => handleAPIKeyChange(index, e.target.value)}
                  style={{ marginRight: '10px', width: '300px' }}
                />
                <Select onValueChange={(value) => handleProviderChange(index, value)}>
                  <SelectTrigger className="w-[200px] px-2 py-1 text-black bg-white border border-gray-300 rounded text-left">
                    <SelectValue placeholder={row.provider || "Select Provider"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black" style={{ width: '200px' }}>
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
                <button
                  onClick={() => handleRemoveRow(index)}
                  style={{
                    marginLeft: '10px',
                    background: 'none',
                    color: 'black',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  X
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
  );
};

export default APIModal;
