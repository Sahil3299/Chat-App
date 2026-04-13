import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage('');

      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => {
          handleInputChange(e);
          handleInputResize();
        }}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        rows="1"
        className="flex-1 bg-zinc-800 text-zinc-100 rounded-xl px-4 py-2 border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors text-sm placeholder-zinc-500 resize-none max-h-32"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
          message.trim()
            ? 'bg-violet-600 hover:bg-violet-500 text-white'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MessageInput;
