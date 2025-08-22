import User from '../models/users.model.js';
import { validationResult } from 'express-validator';

// @desc    Update user details
// @route   PUT /api/v1/user/update
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/user/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change PIN
// @route   PUT /api/v1/user/change-pin
// @access  Private
export const changePin = async (req, res, next) => {
  try {
    const { currentPin, newPin } = req.body;

    if (!currentPin || !newPin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new PIN'
      });
    }

    if (newPin.length < 4 || newPin.length > 6) {
      return res.status(400).json({
        success: false,
        message: 'New PIN must be between 4-6 digits'
      });
    }

    const user = await User.findById(req.user.id).select('+pin');

    // Check current PIN
    if (user.pin !== currentPin) {
      return res.status(401).json({
        success: false,
        message: 'Current PIN is incorrect'
      });
    }

    user.pin = newPin;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'PIN updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/user/delete
// @access  Private
export const deleteUser = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Soft delete by changing status
    user.status = 'deleted';
    user.session = '';
    await user.save();

    // Alternatively, hard delete:
    // await User.findByIdAndDelete(req.user.id);

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - request reset
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.status(200).json({
        success: true,
        message: 'If your mobile number is registered, you will receive a reset code'
      });
    }

    // Generate reset token (6-digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = resetToken;
    user.codeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // In production, send the code via SMS
    console.log(`Password reset code for ${mobile}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Reset code sent to your mobile'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with code
// @route   PUT /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { mobile, code, newPassword } = req.body;

    if (!mobile || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mobile, code and new password are required'
      });
    }

    const user = await User.findOne({
      mobile,
      code,
      codeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Set new password
    user.password = newPassword;
    user.code = undefined;
    user.codeExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};