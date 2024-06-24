"use client";
import React from 'react';
import Button from './ui/button';
import Slider from './ui/slider';
import { FaPlusCircle } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const SketchDisplay = ({
  sliders,
  onSliderChange,
  onParamChange,
  onRemoveSlider,
  getAvailableParams,
  onAddSlider,
  isFullscreen
}) => {
  return (
    <div>
      {!isFullscreen && (
        <div id="slider-container">
          <div className={sliders.length > 0 ? 'pb-5' : 'pb-0'}>
            {sliders.map((slider, index) => {
              const defaultValue = slider.defaultValue || 1;
              const paramValue = parseFloat(slider.value);
              const scaledValue = defaultValue * Math.pow(10, (paramValue - 50) / 50);
              return (
                <div key={index} className="flex items-center mb-2">
                  <div className="flex items-center mr-2 flex-grow min-w-[150px]">
                    <div className="value-box mr-2 px-2 py-1 bg-gray-900 bg-opacity-50 rounded text-white min-w-[70px] text-center">
                      {scaledValue.toFixed(2)}
                    </div>
                    <Slider
                      defaultValue={[slider.value]}
                      max={100}
                      step={1}
                      onValueChange={(value) => onSliderChange(index, { target: { value: value[0] } })}
                      className="h-4 rounded-full flex-grow"
                    >
                      <Slider.Track className="relative h-4 w-full grow overflow-hidden rounded-full bg-yellow-500">
                        <Slider.Range className="absolute h-full bg-blue-500" />
                      </Slider.Track>
                      <Slider.Thumb className="block h-6 w-6 rounded-full border-2 border-blue-500 bg-green-500 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" />
                    </Slider>
                  </div>
                  <div className="w-40 sm:w-40 md:w-50 items-center">
                    <Select onValueChange={(value) => onParamChange(index, { target: { value } })}>
                      <SelectTrigger className="w-full px-2 py-1 text-black bg-white border border-gray-300 rounded text-left">
                        <SelectValue placeholder={slider.param || "Select parameter"} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-200 text-black">
                        <SelectGroup>
                          <SelectLabel>Parameters</SelectLabel>
                          {getAvailableParams(index).map((param, i) => (
                            <SelectItem key={i} value={param} className={`${slider.param === param ? "bg-gray-500 text-white" : "hover:bg-gray-300"} cursor-pointer truncate`}>
                              {param}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="destructive" size="default" onClick={() => onRemoveSlider(index)} className="ml-2 px-2 py-1">
                    X
                  </Button>
                </div>
              );
            })}
          </div>
          <Button variant="default" size="default" onClick={onAddSlider} className="px-4 py-2 flex items-center">
            <FaPlusCircle className="mr-2" />
            <span className="hidden sm:inline">Add Slider</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SketchDisplay;