const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Display sign up page on GET
exports.sign_up_get = (req, res, next) => {
  res.render('sign-up-form', {
    title: 'Sign up',
    user: req.user,
  });
};

// Handle sign up on POST
exports.sign_up_post = [
  body('first_name', 'First name is required').trim().isLength({ min: 1 }),
  body('last_name', 'Last name is required').trim().isLength({ min: 1 }),
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email address is required')
    .bail()
    .isEmail()
    .withMessage('Please enter valid email address')
    .custom(
      asyncHandler(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('Email address already in use');
        } else {
          return true;
        }
      }),
    ),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least 8 characters and include the following: 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    ),
  body('password_confirmation')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password confirmation is required')
    .bail()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Password does not match'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Sign up',
        user: user,
        password_conf: req.body.password_confirmation,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(
        req.body.password,
        10,
        asyncHandler(async (err, hashedPassword) => {
          user.password = hashedPassword;
          await user.save();
          res.redirect('/');
        }),
      );
    }
  }),
];

exports.become_member_get = (req, res, next) => {
  if (req.user) {
    res.render('member-form', {
      title: 'Become a member',
    });
  } else {
    res.redirect('/');
  }
};

exports.become_member_post = [
  body('member_password')
    .custom((value, { req }) => {
      return value === process.env.member_pw;
    })
    .withMessage('Incorrect password'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('member-form', {
        title: 'Become a member',
        member_pass: req.body.member_password,
        errors: errors.array(),
      });
    } else {
      const user = req.user;
      user.member_status = true;
      await user.save();
      res.redirect('/');
    }
  }),
];
