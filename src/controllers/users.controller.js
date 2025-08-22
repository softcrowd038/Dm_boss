import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import { validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (userId, mobile) => {
  return jwt.sign(
    { id: userId, mobile },
    process.env.JWT_SECRET || 'your_fallback_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.mobile);

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        wallet: user.wallet
      }
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { mobile, name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this mobile number already exists'
      });
    }

    // Check if email is already in use
    if (email) {
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Get the next serial number
    const lastUser = await User.findOne().sort({ sn: -1 });
    const nextSN = lastUser ? lastUser.sn + 1 : 1;

    // Create user
    const user = await User.create({
  sn: nextSN,
  mobile,
  name,
  email: email || null,
  password,
  pin: "",
  ip_address: null,  // Remove this line or change to empty string
  created_at: new Date().toISOString(),
  created_a: new Date(),
  verify: "0",
  status: "pending"
});

    // Generate verification code (simplified)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = verificationCode;
    await user.save();

    // In a real application, you would send the code via SMS/email here

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }


    const user = await User.findOne({ mobile }).select('+password +login_attempts +lock_until +status');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.lock_until && user.lock_until > Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed attempts'
      });
    }

    let isMatch = false;
    
   
    if (password) {
   
      if (!user.password || user.password === '' || user.password === null || user.password === undefined) {
        return res.status(401).json({
          success: false,
          message: 'Password login not enabled for this account'
        });
      }
      
      if (!password || password === '' || password === null || password === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid password'
        });
      }
      
      isMatch = await user.comparePassword(password);
    } 
  

    if (!isMatch) {
   
      user.login_attempts = (user.login_attempts || 0) + 1;
      
     
      if (user.login_attempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS || 5)) {
        user.lock_until = Date.now() + (parseInt(process.env.LOCK_TIME || 30) * 60 * 1000);
      }
      
      await user.save();
      
      
    }

   
    user.login_attempts = 0;
    user.lock_until = undefined;
    user.last_login = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};


// @desc    Verify user account
// @route   POST /api/v1/auth/verify
// @access  Private
export const verifyUser = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.verify === "1") {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    if (user.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Update user verification status
    user.verify = "1";
    user.status = "active";
    user.code = "0"; // Clear verification code
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};