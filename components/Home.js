'use client';
import Head from 'next/head';
import { useRef, useState, useEffect } from 'react';
import p5 from 'p5';
import { extractParameters, generateSliderLinkageCode, generateCanvasSize } from '../utils/extractParameters';
import { INITIAL_SLIDER_VALUE, extractSketchCode } from '../utils/sketchUtils';
import { submitToAPI } from '../utils/submitToAPI';

import Canvas from '../components/Canvas';
import SketchControls from '../components/SketchControls';
import SketchDisplay from '../components/SketchDisplay';
import CodeModal from '../components/CodeModal';
import HelpModal from '../components/HelpModal';
import APIModal from '../components/APIModal';
import Notification from '../components/Notification';

export default function Home() {
  const sketchRef = useRef();
  const p5Ref = useRef();
  const [inputValue, setInputValue] = useState('');
  const [sketch, setSketch] = useState('');
  const [sliders, setSliders] = useState([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(true);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [modalSketchCode, setModalSketchCode] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [paramNames, setParamNames] = useState([]);
  const [paramDefaults, setParamDefaults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadNewSketch, setLoadNewSketch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState('gpt-4o');
  const [selectedAPIKey, setSelectedAPIKey] = useState('');
  const [notification, setNotification] = useState({ isVisible: false, message: '' });
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);

  const componentRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        const { width, height } = componentRef.current.getBoundingClientRect();
        sizeRef.current = { width, height };

        if (isFullscreen) {
          setFrameWidth(width || 0);
          setFrameHeight(height || 0);
        } else {
          const smallerDimension = Math.min(width || 0, height || 0);
          setFrameWidth(smallerDimension);
          setFrameHeight(smallerDimension);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isFullscreen]);

  const showNotification = (message) => {
    setNotification({ isVisible: true, message });
  };

  const closeNotification = () => {
    setNotification({ isVisible: false, message: '' });
  };

  useEffect(() => {
    if (p5Ref.current) {
      p5Ref.current.resizeCanvas(frameWidth, frameHeight);
    }
  }, [frameWidth, frameHeight]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (loadNewSketch) {
      // Get the current sketch number
      const currentSketchNumber = sketch.match(/sketch(\d+)/)?.[1];
      
      let sketchNumber;
      do {
        sketchNumber = Math.floor(Math.random() * 5) + 1;
      } while (sketchNumber.toString() === currentSketchNumber);
  
      import(`../sketches/sketch${sketchNumber}.js`)
        .then(module => {
          const sketchCode = module.default;
          // Execute the sketch code to define the global function
          const script = document.createElement('script');
          script.textContent = sketchCode;
          document.head.appendChild(script);
          document.head.removeChild(script);
          
          // Now we can access the sketch function from the window object
          const sketchFunction = window[`sketch${sketchNumber}`];
          const wrappedSketchCode = `${sketchFunction.toString()}`;
          
          setModalSketchCode(wrappedSketchCode);
          loadSketch(wrappedSketchCode);
          setLoadNewSketch(false);
        })
        .catch(error => {
          console.error('Error loading new sketch:', error);
          showNotification('Error loading new sketch.');
        });
    }
  }, [loadNewSketch, sketch]);

  useEffect(() => {
    if (!sketch) {
      setLoadNewSketch(true);
    }
  }, [sketch]);

  useEffect(() => {
    let p5Instance;

    if (sketch) {
      if (p5Ref.current) {
        p5Ref.current.remove();
      }

      const generatedSketch = new Function('p', `return ${sketch}`);
      p5Instance = new p5(generatedSketch(), sketchRef.current);
      p5Ref.current = p5Instance;
    }

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [sketch, renderKey]);

  useEffect(() => {
    if (paramNames.length > 0) {
      const updatedSliders = paramNames.map(param => ({
        value: 50,
        param,
        defaultValue: paramDefaults[param] || 1
      }));
      setSliders(updatedSliders);
    }
  }, [paramNames, paramDefaults]);

  useEffect(() => {
    if (p5Ref.current && p5Ref.current.setParamsFromSliders) {
      const params = sliders.reduce((acc, item) => {
        if (item.param) {
          const defaultValue = paramDefaults[item.param] || 1;
          acc[item.param] = defaultValue * Math.pow(10, (item.value - 50) / 50);
        }
        return acc;
      }, {});
  
      p5Ref.current.setParamsFromSliders(params);
    }
  }, [sliders, paramDefaults]);

  const takeSnapshot = () => {
    if (p5Ref.current) {
      p5Ref.current.loadImage(p5Ref.current.canvas.toDataURL(), (img) => {
        img.save('snapshot', 'png');
      });
    }
  };

  const handleSubmit = async (event, inputValue) => {
    event.preventDefault();
    setIsLoading(true);
    setModalSketchCode('');
  
    let apiEndpoint, apiKey;
  
    if (!selectedAPIKey || !selectedAPIKey.apiKey) {
      // If no API key is selected, use the Gemini API
      apiEndpoint = '/api/askGemini';
      apiKey = null; // We'll use the environment variable in the API route
    } else {
      apiEndpoint = selectedAPIKey.provider === 'OpenAI' ? '/api/askOpenAI' : '/api/askGemini';
      apiKey = selectedAPIKey.apiKey;
    }
  
    const message = inputValue.trim() === '' ? 'improve the sketch in some way, if no sketch is present then make a simple sketch' : inputValue;
  
    try {
      const response = await submitToAPI(apiEndpoint, message, apiKey);
      let sketchCode = extractSketchCode(response);
      setModalSketchCode(sketchCode);
      loadSketch(sketchCode);
    } catch (error) {
      console.error('Error during submission:', error);
      if (error.message.includes('Too many requests')) {
        showNotification('Too many requests, Try again later.');
      } else if (error.message.includes('invalid_api_key')) {
        showNotification('Incorrect API key');
      } else {
        showNotification(`API Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSketch = (sketchCode) => {
    try {
      // Remove the wrapper function before processing      
      const { parameterNames, parameterNamesAndValues } = extractParameters(sketchCode);
  
      const {
        sliderInitializationCode,
        setParamsFromSlidersCode,
        setSingleParamCode,
        setParamsCode
      } = generateSliderLinkageCode(parameterNames);
  
      let modifiedSketchCode = sketchCode.replace(
        /p\.setup\s*=\s*\(\)\s*=>\s*{/,
        (match) => `${match}\n${sliderInitializationCode}`
      );
  
      modifiedSketchCode = modifiedSketchCode.replace(
        /p\.createCanvas\s*\(\s*[^,]+,\s*[^)]+\s*\)\s*;/,
        generateCanvasSize(frameWidth, frameHeight, sketchCode)
      );
  
      modifiedSketchCode = modifiedSketchCode.replace(
        /p\.setup\s*=\s*\(\)\s*=>\s*{[^]*?}\s*;\s*/,
        (match) => `${match}\n${setParamsFromSlidersCode}`
      );
  
      // Add setSingleParamCode and setParamsCode at the end of the sketch function
      modifiedSketchCode = modifiedSketchCode.replace(
        /(\s*}\s*;?\s*)$/,
        `\n${setSingleParamCode}\n\n${setParamsCode}\n$1`
      );
  
      const parameterDefaults = {};
      parameterNamesAndValues.forEach(([name, value]) => {
        parameterDefaults[name] = value;
      });
  
      setParamDefaults(parameterDefaults);
      setParamNames(parameterNames);

      // When setting the sketch, wrap it again
      setSketch(`${modifiedSketchCode}`);
  
      if (p5Ref.current) {
        const params = {};
        parameterNames.forEach((name) => {
          params[name] = parameterDefaults[name];
        });
        p5Ref.current.setParams(params);
      }
    } catch (error) {
      console.error('Error during sketch loading:', error);
      showNotification('Error loading the sketch.');
    }
  };
  
  const loadEditedSketch = (editedSketchCode) => {
    try {
      const sketchCode = editedSketchCode;
      setModalSketchCode(editedSketchCode); // Update the modal sketch code with the edited code
      loadSketch(sketchCode);
    } catch (error) {
      console.error('Error loading edited sketch:', error);
      showNotification('Error loading the edited sketch.');
    }
  };

  const handleSliderChange = (index, event) => {
    const updatedSliders = [...sliders];
    updatedSliders[index].value = event.target.value;
    setSliders(updatedSliders);
  
    if (p5Ref.current && p5Ref.current.setSingleParam) {
      const paramName = updatedSliders[index].param;
      const paramValue = parseFloat(event.target.value);
      if (paramName) {
        const defaultValue = paramDefaults[paramName];
        const scaledValue = defaultValue * Math.pow(10, (paramValue - 50) / 50);
        p5Ref.current.setSingleParam(paramName, scaledValue);
      }
    }
  };
  
  const handleParamChange = (index, event) => {
    const updatedSliders = [...sliders];
    updatedSliders[index].param = event.target.value;
    updatedSliders[index].defaultValue = paramDefaults[event.target.value] || 1;
    updatedSliders[index].value = 50;
    setSliders(updatedSliders);
  };

  const MAX_SLIDERS = 10;

  const addSlider = () => {
    if (sliders.length < MAX_SLIDERS) {
      setSliders([...sliders, { value: INITIAL_SLIDER_VALUE, param: '', defaultValue: 1 }]);
      setRenderKey(prevKey => prevKey + 1);
    }
  };

  const removeSlider = (index) => {
    setSliders(sliders.filter((_, i) => i !== index));
    setRenderKey(prevKey => prevKey + 1);
  };

  const toggleCodeModal = () => {
    setIsCodeModalOpen(!isCodeModalOpen);
  };

  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  };

  const handleToggleAPIModal = () => {
    setIsAPIModalOpen(!isAPIModalOpen);
  };

  const resetSketch = () => {
    setRenderKey(prevKey => prevKey + 1);
    if (paramNames.length > 0) {
      const updatedSliders = paramNames.map(param => ({
        value: 50,
        param,
        defaultValue: paramDefaults[param] || 1
      }));
      setSliders(updatedSliders);
    }
  };

  const getAvailableParams = (index) => {
    const selectedParams = sliders.map(item => item.param);
    return paramNames.filter(name => !selectedParams.includes(name) || sliders[index].param === name);
  };

  return (
    <div>
      <Head>
        <title>p5.js with Next.js</title>
        <meta name="description" content="Render p5.js sketches in a Next.js app" />
      </Head>
      <main ref={componentRef} className="flex flex-col w-full items-center lg:flex-row lg:items-start h-screen">
        <div className="flex justify-center">
          <Canvas
            sketchRef={sketchRef}
            renderKey={renderKey}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            frameWidth={frameWidth}
            frameHeight={frameHeight}
          />
        </div>
        {!isFullscreen && (
          <div className="md:p-10 p-4 w-full lg:w-auto">
            <SketchControls
              onSubmit={handleSubmit}
              inputValue={inputValue}
              onInputChange={(e) => setInputValue(e.target.value)}
              selectedAPI={selectedAPI}
              onAPIChange={(e) => setSelectedAPI(e.target.value)}
              onSnapshot={takeSnapshot}
              onToggleCodeModal={toggleCodeModal}
              onToggleHelpModal={toggleHelpModal}
              onToggleAPIModal={handleToggleAPIModal}
              onResetSketch={resetSketch}
              isLoading={isLoading}
              onNewSketch={() => setLoadNewSketch(true)}
            />
            <div>
              <SketchDisplay
                sliders={sliders}
                onSliderChange={handleSliderChange}
                onParamChange={handleParamChange}
                onRemoveSlider={removeSlider}
                getAvailableParams={getAvailableParams}
                onAddSlider={addSlider}
              />
            </div>
          </div>
        )}
      </main>
      <CodeModal 
        isOpen={isCodeModalOpen} 
        onClose={toggleCodeModal} 
        displayedCode={modalSketchCode} 
        onSave={loadEditedSketch}
      />
      <HelpModal isOpen={isHelpModalOpen} onClose={toggleHelpModal} />
      <APIModal
        isOpen={isAPIModalOpen}
        onClose={handleToggleAPIModal}
        onSelectAPIKey={setSelectedAPIKey}
        selectedAPI={selectedAPI}
        onAPIChange={setSelectedAPI}
      />
      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
}
