const express = require('express');
const router = express.Router();

// Require controller modules
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

// GET home page
router.get('/', messageController.index);

// GET sign up page
router.get('/sign-up', userController.sign_up_get);

// POST sign up page
router.post('/sign-up', userController.sign_up_post);

// // GET log in page
// router.get('/log-in', userController.log_in_get);

// // POST log in page
// router.post('/log-in', userController.log_in_post);

// GET become member page
router.get('/become-member', userController.become_member_get);

// POST become member page
router.post('/become-member', userController.become_member_post);

// GET new message page
router.get('/new-message', messageController.new_message_get);

// POST new message page
router.post('/new-message', messageController.new_message_post);

module.exports = router;
