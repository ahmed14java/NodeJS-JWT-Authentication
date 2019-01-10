const express = require('express');
const router = express.Router();

const loginController = require('../controller/login');
const signupController = require('../controller/signUp');
const signUpVerify = require('./verifySignUp');


router.post('/signup' , [signUpVerify.checkDuplicateUserNameOrEmail , signUpVerify.checkRolesExisted] , signupController.signup);
router.post('/signin' , loginController.signin);

module.exports = router;