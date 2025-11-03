const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('@/config/config');
const { User } = require('@/models/index');

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { name, email, username, phone, password } = req.body;

    // if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email or username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    const newUser = await User.create({
      name,
      email,
      username,
      phone,
      password: hashedPassword
    });

    if (!newUser) {
      return res.status(500).json({
        message: 'Failed to register user'
      });
    }

    res.status(201).json({
      message: 'User registered successfully'
    });
  });

  static login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid username/email or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid username/email or password'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone
      }
    });
  });
}

module.exports = AuthController;
