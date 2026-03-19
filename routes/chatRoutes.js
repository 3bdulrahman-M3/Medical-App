const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Chat Routes
// Send message
router.post('/', authenticate, chatController.sendMessage);

// Get chat history with another user
router.get('/history/:otherUserId', authenticate, chatController.getChatHistory);

// Get inbox/conversation list
router.get('/inbox', authenticate, chatController.getInbox);

module.exports = router;
