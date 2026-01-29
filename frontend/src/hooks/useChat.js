import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useChat = (roomId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join:room', { roomId });

    socket.on('room:joined', ({ messages: roomMessages }) => {
      setMessages(roomMessages);
      setLoading(false);
    });

    socket.on('message:received', ({ message }) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.emit('leave:room', { roomId });
      socket.off('room:joined');
      socket.off('message:received');
    };
  }, [socket, roomId]);

  const sendMessage = useCallback((content) => {
    if (socket && content.trim()) {
      socket.emit('message:send', {
        roomId,
        content: content.trim()
      });
    }
  }, [socket, roomId]);

  return { messages, loading, sendMessage };
};
