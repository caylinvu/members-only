const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const User = require('./models/user');
const indexRouter = require('./routes/index');

// mongoose connection setup
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Email does not exist, please try again' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password, please try again' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Display log in page on GET
app.get('/log-in', (req, res, next) => {
  if (!req.user) {
    res.render('log-in-form', {
      title: 'Log in',
    });
  } else {
    res.redirect('/');
  }
});

// Handle log in on POST
app.post(
  '/log-in',
  body('username')
    .isLength({ min: 1 })
    .withMessage('Email address is required')
    .bail()
    .isEmail()
    .withMessage('Please enter valid email address')
    .bail()
    .custom(
      asyncHandler(async (value) => {
        const user = await User.findOne({ email: value });
        if (!user) {
          throw new Error('Email address does not exist');
        } else {
          return true;
        }
      }),
    ),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .bail()
    .custom(
      asyncHandler(async (value, { req }) => {
        const user = await User.findOne({ email: req.body.username });
        if (!user) {
          return true;
        }
        const match = await bcrypt.compare(value, user.password);
        if (!match) {
          throw new Error('Incorrect password');
        } else {
          return true;
        }
      }),
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('log-in-form', {
        title: 'Log in',
        username: req.body.username,
        password: req.body.password,
        errors: errors.array(),
      });
    } else {
      next();
    }
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  }),
);

// Handle log out on GET
app.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// maybe go back later and add front end validation so that invalid input borders can change while typing
