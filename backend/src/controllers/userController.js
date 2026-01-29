import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      'username email avatar status lastSeen'
    ).sort({ username: 1 });

    res.json({ users });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
};

export const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find(
      { status: { $in: ['online', 'away'] } },
      'username avatar status lastSeen'
    );

    res.json({ users });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch online users', 
      error: error.message 
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(
      userId,
      'username email avatar status lastSeen createdAt'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch user profile', 
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, avatar } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ 
      message: 'Profile updated successfully', 
      user 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};
