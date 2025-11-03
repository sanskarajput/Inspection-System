const express = require('express');
const { body } = require('express-validator');

const { validateRequest } = require('@/middlewares/validateRequest');
const { AuthController } = require('@/controllers/index');

const authApis = express.Router();

authApis.post(
  '/register',
  [
    // name
    body('name').notEmpty().withMessage('Name is required'),
    // email
    body('email').isEmail().withMessage('Valid email is required'),
    // username
    body('username').notEmpty().withMessage('Userame is required'),
    // phone
    body('phone').notEmpty().withMessage('Phone number is required'),
    // password
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validateRequest
  ],
  AuthController.register
);

authApis.post(
  '/login',
  [
    // username or email
    body('identifier').notEmpty().withMessage('Username or email is required'),
    // password
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
  ],
  AuthController.login
);

module.exports = authApis;
