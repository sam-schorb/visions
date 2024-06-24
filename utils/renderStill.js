// utils/renderStill.js

const renderStill = (canvas) => {
    const imgData = canvas.canvas.toDataURL('image/png');
  
    fetch('/api/saveImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imgData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  export default renderStill;
  