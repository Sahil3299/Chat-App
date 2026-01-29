import Message from '../models/Message.js';
import Room from '../models/Room.js';

class MessageService {
  async createMessage(data) {
    try {
      const message = await Message.create(data);
      await message.populate('sender', 'username avatar');
      
      // Update room's last message
      await Room.findByIdAndUpdate(data.room, {
        lastMessage: message._id
      });

      return message;
    } catch (error) {
      throw new Error('Failed to create message: ' + error.message);
    }
  }

  async getMessagesByRoom(roomId, options = {}) {
    try {
      const { limit = 50, skip = 0 } = options;

      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return messages.reverse();
    } catch (error) {
      throw new Error('Failed to fetch messages: ' + error.message);
    }
  }

  async markAsRead(messageIds, userId) {
    try {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { 
          $addToSet: { 
            readBy: { user: userId, readAt: new Date() } 
          } 
        }
      );
    } catch (error) {
      throw new Error('Failed to mark messages as read: ' + error.message);
    }
  }
}

export default new MessageService();
