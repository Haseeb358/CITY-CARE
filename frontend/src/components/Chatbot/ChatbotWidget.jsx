import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Quick question about CityCare or want to check a complaint status? I'm here to help!", isModel: true }
  ]);
  const [apiHistory, setApiHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (isLoading || !inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { text: userText, isModel: false }]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/chatbot`;

      const response = await axios.post(endpoint, {
        message: userText,
        history: apiHistory
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (response.data.success) {
        setMessages(prev => [...prev, { text: response.data.reply, isModel: true }]);
        setApiHistory(response.data.updatedHistory);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I ran into an error processing that.", isModel: true }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "Error connecting to the server.", isModel: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[30rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-200 dark:border-gray-800 transition-all duration-300 transform scale-100">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
              <span className="font-bold text-lg tracking-wide">CityCare AI</span>
            </div>
            <button onClick={toggleChat} className="text-blue-100 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isModel ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm
                  ${msg.isModel 
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              readOnly={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-md"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm shadow-sm" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 ${isOpen ? 'scale-0 opacity-0 relative h-0 w-0 overflow-hidden' : ''}`}
      >
        <FontAwesomeIcon icon={faCommentDots} className="text-2xl" />
      </button>
    </div>
  );
}
