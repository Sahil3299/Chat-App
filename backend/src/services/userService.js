import User from '../models/User.js';

class UserService {
  async updateUserStatus(userId, status, socketId = null) {
    try {
      const updateData = {
        status,
        lastSeen: new Date()
      };

      if (socketId !== null) {
        updateData.socketId = socketId;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );

      return user;
    } catch (error) {
      throw new Error('Failed to update user status: ' + error.message);
    }
  }

  async getOnlineUsers() {
    try {
      const users = await User.find(
        { status: { $in: ['online', 'away'] } },
        'username avatar status lastSeen'
      ).sort({ username: 1 });

      return users;
    } catch (error) {
      throw new Error('Failed to fetch online users: ' + error.message);
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user: ' + error.message);
    }
  }
}

export default new UserService();
