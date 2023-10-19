const express = require('express');
const router = express.Router();

// Require controller modules
const userController = require('../controllers/userController');

// GET home page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET sign up page
router.get('/sign-up', userController.sign_up_get);

// POST sign up page
router.post('/sign-up', userController.sign_up_post);

module.exports = router;
