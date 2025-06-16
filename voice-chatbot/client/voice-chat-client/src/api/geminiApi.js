const API_URL = 'http://localhost:5000/api/gemini';

export const sendMessageToGemini = async (userMessage) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "Sorry, something went wrong.";
  }
};
