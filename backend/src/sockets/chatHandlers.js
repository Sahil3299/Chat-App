import Message from '../models/Message.js';
import Room from '../models/Room.js';
import logger from '../utils/logger.js';

export const setupChatHandlers = (io, socket) => {
  
  // Join a room
  socket.on('join:room', async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId);
      
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }
      
      // Check if user is participant
      if (!room.participants.includes(socket.userId)) {
        return socket.emit('error', { message: 'Not authorized to join this room' });
      }
      
      socket.join(roomId);
      
      // Notify others
      socket.to(roomId).emit('user:joined', {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date()
      });
      
      // Send room info to user
      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(50);
      
      socket.emit('room:joined', {
        roomId,
        messages: messages.reverse()
      });
      
      logger.info(`User ${socket.username} joined room ${roomId}`);
      
    } catch (error) {
      logger.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  // Leave a room
  socket.on('leave:room', ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user:left', {
      userId: socket.userId,
      username: socket.username,
      timestamp: new Date()
    });
    logger.info(`User ${socket.username} left room ${roomId}`);
  });
  
  // Send message
  socket.on('message:send', async (data) => {
    try {
      const { roomId, content, type = 'text' } = data;
      
      // Validate
      if (!content || !roomId) {
        return socket.emit('error', { message: 'Invalid message data' });
      }
      
      // Create message
      const message = await Message.create({
        room: roomId,
        sender: socket.userId,
        content,
        type
      });
      
      // Populate sender info
      await message.populate('sender', 'username avatar');
      
      // Update room's last message
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: message._id
      });
      
      // Emit to all users in room
      io.to(roomId).emit('message:received', {
        message: message.toObject(),
        timestamp: new Date()
      });
      
      logger.info(`Message sent in room ${roomId} by ${socket.username}`);
      
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Typing indicator
  socket.on('typing:start', ({ roomId }) => {
    socket.to(roomId).emit('user:typing', {
      userId: socket.userId,
      username: socket.username
    });
  });
  
  socket.on('typing:stop', ({ roomId }) => {
    socket.to(roomId).emit('user:stop-typing', {
      userId: socket.userId
    });
  });
  
  // Mark messages as read
  socket.on('messages:read', async ({ roomId, messageIds }) => {
    try {
      await Message.updateMany(
        { _id: { $in: messageIds }, room: roomId },
        { 
          $addToSet: { 
            readBy: { 
              user: socket.userId, 
              readAt: new Date() 
            } 
          } 
        }
      );
      
      socket.to(roomId).emit('messages:read', {
        userId: socket.userId,
        messageIds
      });
      
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  });
};
