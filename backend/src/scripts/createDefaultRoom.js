import mongoose from 'mongoose';
import Room from '../models/Room.js';
import { connectDB } from '../config/database.js';

const createDefaultRoom = async () => {
  try {
    await connectDB();

    const defaultRoomId = '507f1f77bcf86cd799439011';

    const existingRoom = await Room.findById(defaultRoomId);
    if (existingRoom) {
      console.log('Default room already exists');
      return;
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
    console.log('Default room created successfully');

  } catch (error) {
    console.error('Error creating default room:', error);
  } finally {
    mongoose.connection.close();
  }
};

createDefaultRoom();
