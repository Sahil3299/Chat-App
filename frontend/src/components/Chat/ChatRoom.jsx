import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import './ChatRoom.css';

const ChatRoom = ({ roomId }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    if (!socket || !roomId) return;

    // Join room
    socket.emit('join:room', { roomId });

    // Listen for room joined
    socket.on('room:joined', ({ messages: roomMessages }) => {
      setMessages(roomMessages);
    });

    // Listen for new messages
    socket.on('message:received', ({ message }) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user joined
    socket.on('user:joined', ({ username }) => {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        type: 'system',
        content: `${username} joined the room`,
        createdAt: new Date()
      }]);
    });

    // Listen for user left
    socket.on('user:left', ({ username }) => {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        type: 'system',
        content: `${username} left the room`,
        createdAt: new Date()
      }]);
    });

    // Listen for typing indicators
    socket.on('user:typing', ({ username }) => {
      setTypingUsers(prev => new Set([...prev, username]));
    });

    socket.on('user:stop-typing', ({ userId }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        // Remove by userId logic here
        return newSet;
      });
    });

    // Listen for online users
    socket.on('presence:online-users', ({ users }) => {
      setOnlineUsers(users);
    });

    // Get online users
    socket.emit('presence:get-online');

    // Cleanup
    return () => {
      socket.emit('leave:room', { roomId });
      socket.off('room:joined');
      socket.off('message:received');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('user:typing');
      socket.off('user:stop-typing');
      socket.off('presence:online-users');
    };
  }, [socket, roomId]);

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      socket.emit('message:send', {
        roomId,
        content: content.trim(),
        type: 'text'
      });
    }
  };

  const handleTyping = (isTyping) => {
    if (socket) {
      if (isTyping) {
        socket.emit('typing:start', { roomId });
      } else {
        socket.emit('typing:stop', { roomId });
      }
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-container">
        <div className="chat-main">
          <div className="chat-header">
            <h2>Chat Room</h2>
            <div className="room-info">
              <span className="online-count">
                {onlineUsers.length} online
              </span>
            </div>
          </div>
          
          <MessageList messages={messages} />
          
          {typingUsers.size > 0 && (
            <div className="typing-indicator">
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        </div>
        
        <UserList users={onlineUsers} />
      </div>
    </div>
  );
};

export default ChatRoom;
