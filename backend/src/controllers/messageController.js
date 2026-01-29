import Message from '../models/Message.js';
import Room from '../models/Room.js';

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      messages: messages.reverse(),
      total: await Message.countDocuments({ room: roomId })
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch messages', 
      error: error.message 
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete message', 
      error: error.message 
    });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();

    await message.save();

    res.json({ message: 'Message updated successfully', data: message });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update message', 
      error: error.message 
    });
  }
};
