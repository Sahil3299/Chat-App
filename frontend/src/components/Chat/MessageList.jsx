import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import './MessageList.css';

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className="message-list">
      {messages.map((message) => {
        if (message.type === 'system') {
          return (
            <div key={message._id} className="system-message">
              <span>{message.content}</span>
            </div>
          );
        }

        const senderId = message.sender?._id || message.sender;
        const isOwnMessage = user && String(senderId) === String(user._id);

        return (
          <div
            key={message._id}
            className={`message ${isOwnMessage ? 'message-own' : 'message-other'}`}
          >
            {!isOwnMessage && (
              <img
                src={message.sender?.avatar || `https://ui-avatars.com/api/?name=${message.sender?.username || 'User'}`}
                alt={message.sender?.username || 'User'}
                className="message-avatar"
              />
            )}
            
            <div className="message-content">
              {!isOwnMessage && (
                <div className="message-sender">
                  {message.sender?.username || 'Unknown'}
                </div>
              )}
              
              <div className="message-bubble">
                <p>{message.content}</p>
                <span className="message-time">
                  {formatTime(message.createdAt)}
                </span>
              </div>
              
              {message.readBy && message.readBy.length > 0 && isOwnMessage && (
                <div className="message-read-receipt">
                  ✓✓ Read by {message.readBy.length}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
