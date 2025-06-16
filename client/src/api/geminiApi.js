const API_URL = 'https://chat-bot-2-k9b1.onrender.com/api/gemini';

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
