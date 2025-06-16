import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { Mic, MicOff, Bot, User } from "lucide-react";
import { FaMicrophone } from "react-icons/fa";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [pauseTimer, setPauseTimer] = useState(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage, time: new Date() }]);

    try {
      const res = await axios.post("http://localhost:5000/api/gemini", {
        message: userMessage,
      });

      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { role: "bot", text: botReply, time: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Error from Gemini API.", time: new Date() }]);
    }
  };

  useEffect(() => {
    if (!transcript || transcript.trim() === "") return;

    if (transcript !== lastTranscript) {
      setLastTranscript(transcript);
      if (pauseTimer) clearTimeout(pauseTimer);

      const timer = setTimeout(() => {
        handleSendMessage(transcript);
        resetTranscript();
        setLastTranscript("");
      }, 1500);

      setPauseTimer(timer);
    }
  }, [transcript]);

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    if (transcript) {
      handleSendMessage(transcript);
      resetTranscript();
      setLastTranscript("");
    }
  };

  return (
    <div className={!darkMode ? "dark h-screen flex flex-col" : "h-screen flex flex-col"}>
      {/* 🌙 Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-3 right-4 z-10 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded shadow"
      >
        {!darkMode ? "🌞" : "🌙"}
      </button>

      <header className="p-4 text-center shadow bg-white dark:bg-gray-800 dark:text-white text-2xl font-semibold border-b">
        Voice ChatBot 🎙️
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="mr-2 text-green-600 dark:text-green-300">
                <Bot size={24} />
              </div>
            )}
            <div
              className={`max-w-xs sm:max-w-md p-3 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-green-100 dark:bg-green-800 dark:text-white text-gray-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="block text-xs mt-1 text-gray-500 dark:text-gray-300 text-right">
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {msg.role === "user" && (
              <div className="ml-2 text-blue-500">
                <User size={24} />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </main>

     <div className="bg-white dark:bg-gray-800 p-4 border-t shadow flex items-center justify-between gap-4">
  {/* 🎤 Animated Mic when Listening */}
  {isListening ? (
    <div className="flex items-center gap-2">
      <FaMicrophone className="text-red-500 text-xl animate-pulse" />
      <span className="text-gray-700 dark:text-white text-sm">Listening...</span>
    </div>
  ) : (
    <button
      onClick={handleStart}
      disabled={isListening}
      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
    >
      <Mic size={20} />
      Start Listening
    </button>
  )}

  {/* 🛑 Stop Button */}
  <button
    onClick={handleStop}
    disabled={!isListening}
    className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 disabled:opacity-50"
  >
    <MicOff size={20} />
    Stop
  </button>
</div>


      <footer className="text-center py-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent">
        Built By Ankit Yadav 💙 using React + Tailwind
      </footer>
    </div>
  );
}

export default App;
