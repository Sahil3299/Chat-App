import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RightPanel from './RightPanel';

const ChatRoom = ({ roomId }) => {
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join:room', { roomId });

    socket.on('room:joined', ({ messages: roomMessages }) => {
      setMessages(roomMessages);
    });

    socket.on('message:received', ({ message }) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user:joined', ({ username }) => {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        type: 'system',
        content: `${username} joined the room`,
        createdAt: new Date()
      }]);
    });

    socket.on('user:left', ({ username }) => {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        type: 'system',
        content: `${username} left the room`,
        createdAt: new Date()
      }]);
    });

    socket.on('user:typing', ({ username }) => {
      setTypingUsers(prev => new Set([...prev, username]));
    });

    socket.on('user:stop-typing', ({ username }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (username) newSet.delete(username);
        return newSet;
      });
    });

    socket.on('presence:online-users', ({ users }) => {
      setOnlineUsers(users);
    });

    socket.on('user:status-change', ({ userId, status }) => {
      setOnlineUsers(prev => {
        if (status === 'offline') {
          return prev.filter(user => user._id !== userId);
        } else {
          const existingUser = prev.find(user => user._id === userId);
          if (existingUser) {
            return prev.map(user =>
              user._id === userId ? { ...user, status } : user
            );
          } else if (status === 'online' || status === 'away') {
            return prev;
          }
          return prev;
        }
      });
    });

    socket.emit('presence:get-online');

    return () => {
      socket.emit('leave:room', { roomId });
      socket.off('room:joined');
      socket.off('message:received');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('user:typing');
      socket.off('user:stop-typing');
      socket.off('presence:online-users');
      socket.off('user:status-change');
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

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <Sidebar
        users={onlineUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        user={user}
        onLogout={handleLogout}
      />

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-zinc-950 border-l border-zinc-800">
        {/* Chat Header */}
        <div className="h-16 border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-500"></div>
            </div>
            <div>
              <h2 className="text-white font-semibold">Chat Room</h2>
              <p className="text-zinc-400 text-xs">{onlineUsers.length} online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-zinc-400">Connected</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <MessageList messages={messages} />
        </div>

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="px-4 py-2 text-xs text-zinc-400">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-zinc-800 bg-zinc-900/50 p-3">
          <MessageInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <RightPanel
        users={selectedUser ? [selectedUser] : onlineUsers}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default ChatRoom;
