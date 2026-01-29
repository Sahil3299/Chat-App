import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { setupChatHandlers } from '../sockets/chatHandlers.js';
import { setupPresenceHandlers } from '../sockets/presenceHandlers.js';
import logger from '../utils/logger.js';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    logger.info(`✅ User connected: ${socket.username} (${socket.id})`);
    
    // Setup event handlers
    setupChatHandlers(io, socket);
    setupPresenceHandlers(io, socket);
    
    // Disconnect handling
    socket.on('disconnect', (reason) => {
      logger.info(`❌ User disconnected: ${socket.username} - Reason: ${reason}`);
    });
  });

  return io;
};
