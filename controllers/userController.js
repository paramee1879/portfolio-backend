// controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register new user
export const register = async (req, res, next) => {
  try {
    console.log('=== REGISTER CALLED ===');
    console.log('Body:', req.body);
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    console.log('Checking if user exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('User created successfully:', user._id);
    
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };
    
    console.log('Sending response...');
    res.status(201).json(response);
    console.log('Response sent successfully');
  } catch (error) {
    console.error('=== ERROR IN REGISTER ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/users/login
// @desc    Login user
export const login = async (req, res, next) => {
  try {
    console.log('=== LOGIN CALLED ===');
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('=== ERROR IN LOGIN ===');
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/profile
// @desc    Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/users/profile
// @desc    Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.title = req.body.title || user.title;
      user.avatar = req.body.avatar || user.avatar;
      user.social = req.body.social || user.social;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        title: updatedUser.title,
        avatar: updatedUser.avatar,
        social: updatedUser.social,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};