const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display new message page on GET
exports.new_message_get = (req, res, next) => {
  if (req.user) {
    res.render('message-form', {
      title: 'New message',
      user: req.user,
    });
  } else {
    res.redirect('/');
  }
};

// Handle new message on POST
exports.new_message_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }),
  body('text', 'Message is required').trim().isLength({ min: 1 }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render('message-form', {
        title: 'New message',
        user: req.user,
        message: message,
        errors: errors.array(),
      });
    } else {
      message.timestamp = new Date();
      await message.save();
      res.redirect('/');
    }
  }),
];
