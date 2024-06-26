export const submitToAPI = async (apiEndpoint, inputValue, apiKey) => {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue, apiKey: apiKey }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error during submission:', error);
    throw error;
  }
};
