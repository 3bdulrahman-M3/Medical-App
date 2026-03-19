const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      senderId,
      receiverId,
      content,
    });

    await message.save();
    
    await message.populate('senderId', 'name role');
    await message.populate('receiverId', 'name role');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error sending message', 
      error: error.message 
    });
  }
};

// Get chat history with another user
exports.getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name role')
    .populate('receiverId', 'name role')
    .sort({ createdAt: 1 }); // Sort by time (oldest to newest)

    // Mark these messages as read (if current user is receiver)
    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching chat history', 
      error: error.message 
    });
  }
};

// Get Inbox (list of people messaged)
exports.getInbox = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Aggregation to find unique people messaged
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
    })
    .sort({ createdAt: -1 });

    const people = new Map();

    messages.forEach(msg => {
      const otherUser = msg.senderId.toString() === currentUserId 
        ? msg.receiverId.toString() 
        : msg.senderId.toString();

      if (!people.has(otherUser)) {
        people.set(otherUser, {
          userId: otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          isRead: msg.receiverId.toString() === currentUserId ? msg.isRead : true
        });
      }
    });

    const inboxList = Array.from(people.values());
    
    // Enrich with user names
    const enrichedList = await Promise.all(inboxList.map(async (item) => {
      const user = await User.findById(item.userId).select('name role email');
      return { ...item, user };
    }));

    res.json(enrichedList);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching inbox', 
      error: error.message 
    });
  }
};
