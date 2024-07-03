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
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    return data.response;
  } catch (error) {
    console.error('Error during submission:', error);
    throw error;
  }
};