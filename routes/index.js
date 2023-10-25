const express = require('express');
const router = express.Router();

// Require controller modules
const userController = require('../controllers/userController');

// GET home page
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index', {
    title: "Member's Only",
    user: req.user,
  });
});

// GET sign up page
router.get('/sign-up', userController.sign_up_get);

// POST sign up page
router.post('/sign-up', userController.sign_up_post);

// GET log in page
router.post('/log-in', userController.log_in_get);

// POST log in page
router.post('/log-in', userController.log_in_post);

// GET become member page
router.get('/become-member', userController.become_member_get);

// POST become member page
router.post('/become-member', userController.become_member_post);

module.exports = router;
