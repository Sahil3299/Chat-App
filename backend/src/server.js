import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import { initializeSocket } from './config/socket.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import Room from './models/Room.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://chat-app-blue-ten-38.vercel.app/',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create default room (optional - room is auto-created on server start)
app.post('/create-default-room', async (req, res) => {
  try {
    const defaultRoomId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    const existingRoom = await Room.findById(defaultRoomId);
    if (existingRoom) {
      return res.json({ message: 'Default room already exists' });
    }
    const room = new Room({
      _id: defaultRoomId,
      name: 'General Chat',
      type: 'public',
      participants: [],
      admin: null,
      isActive: true
    });
    await room.save();
    res.json({ message: 'Default room created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use(errorHandler);

// Database connection
await connectDB();

// Create default room if it doesn't exist
const defaultRoomId = '507f1f77bcf86cd799439011';
const existingRoom = await Room.findById(defaultRoomId);
if (!existingRoom) {
  const room = new Room({
    _id: defaultRoomId,
    name: 'General Chat',
    type: 'public',
    participants: [],
    admin: null,
    isActive: true
  });
  await room.save();
  logger.info('Default room created');
}

// Initialize Socket.IO
const io = initializeSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 Socket.IO initialized`);
});

export { io };
