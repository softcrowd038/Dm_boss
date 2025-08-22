import crypto from 'crypto';
import OTP from '../models/OTP.js'; // You'll need to create an OTP model

// Generate OTP
export const generateOTP = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length - 1).toString();
};

// Store OTP in database
export const storeOTP = async (mobile, otp, expiresInMinutes = 10) => {
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  
  // Remove any existing OTP for this mobile
  await OTP.deleteMany({ mobile });
  
  // Store new OTP
  const otpRecord = new OTP({
    mobile,
    otp,
    expiresAt
  });
  
  return await otpRecord.save();
};

// Verify OTP
export const verifyOTP = async (mobile, otp) => {
  const otpRecord = await OTP.findOne({
    mobile,
    otp,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpRecord) {
    return false;
  }
  
  // Delete OTP after verification
  await OTP.deleteOne({ _id: otpRecord._id });
  
  return true;
};