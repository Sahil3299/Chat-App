import User from '../models/User.js';
import logger from '../utils/logger.js';

export const setupPresenceHandlers = (io, socket) => {
  
  // User comes online
  socket.on('presence:online', async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status: 'online',
        socketId: socket.id,
        lastSeen: new Date()
      });
      
      // Broadcast to all connected clients
      io.emit('user:status-change', {
        userId: socket.userId,
        status: 'online',
        timestamp: new Date()
      });
      
      logger.info(`User ${socket.username} is now online`);
      
    } catch (error) {
      logger.error('Error updating user presence:', error);
    }
  });
  
  // User goes away
  socket.on('presence:away', async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status: 'away'
      });
      
      io.emit('user:status-change', {
        userId: socket.userId,
        status: 'away',
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error updating user status:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        socketId: null,
        lastSeen: new Date()
      });
      
      io.emit('user:status-change', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error handling disconnect:', error);
    }
  });
  
  // Get online users
  socket.on('presence:get-online', async () => {
    try {
      const onlineUsers = await User.find(
        { status: { $in: ['online', 'away'] } },
        'username avatar status lastSeen'
      );
      
      socket.emit('presence:online-users', { users: onlineUsers });
      
    } catch (error) {
      logger.error('Error fetching online users:', error);
    }
  });
};
