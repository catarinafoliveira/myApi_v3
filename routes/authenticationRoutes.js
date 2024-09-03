const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/authenticationController');

router.post('/register',AuthenticationController.register);
router.post('/login',AuthenticationController.login);

module.exports = router;