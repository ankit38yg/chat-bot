import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { sendMessageToGemini } from '../api/geminiApi';

export function useVoiceChat() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });
  };

  const stopListening = async () => {
    SpeechRecognition.stopListening();
    if (transcript.trim() !== '') {
      setMessages((prev) => [...prev, { sender: 'user', text: transcript }]);
      setIsProcessing(true);
      const reply = await sendMessageToGemini(transcript);
      setMessages((prev) => [...prev, { sender: 'gemini', text: reply }]);
      setIsProcessing(false);
      resetTranscript();
    }
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition");
    }
  }, []);

  return {
    messages,
    startListening,
    stopListening,
    listening,
    isProcessing,
  };
}
