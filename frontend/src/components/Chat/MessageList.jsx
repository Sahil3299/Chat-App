import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

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
    <div className="space-y-3">
      {messages.map((message) => {
        if (message.type === 'system') {
          return (
            <div key={message._id} className="flex justify-center py-2">
              <span className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                {message.content}
              </span>
            </div>
          );
        }

        const senderId = message.sender?._id || message.sender;
        const isOwnMessage = user && String(senderId) === String(user._id);

        return (
          <div
            key={message._id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} gap-2`}
          >
            {!isOwnMessage && (
              <img
                src={
                  message.sender?.avatar ||
                  `https://ui-avatars.com/api/?name=${message.sender?.username || 'User'}`
                }
                alt={message.sender?.username || 'User'}
                className="w-8 h-8 rounded-full shrink-0"
              />
            )}

            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              {!isOwnMessage && (
                <p className="text-xs text-zinc-400 px-2 mb-1">
                  {message.sender?.username || 'Unknown'}
                </p>
              )}

              <div
                className={`message-bubble ${
                  isOwnMessage
                    ? 'message-bubble-sent'
                    : 'message-bubble-received'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  isOwnMessage ? 'text-violet-200' : 'text-zinc-400'
                }`}>
                  {formatTime(message.createdAt)}
                </span>
              </div>

              {message.readBy && message.readBy.length > 0 && isOwnMessage && (
                <div className="text-xs text-zinc-500 mt-1">
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
