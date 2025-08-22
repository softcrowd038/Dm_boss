import bcrypt from "bcryptjs";

export function generateOtp(digits = 4) {
  const n = 10 ** (digits - 1);
  return String(Math.floor(n + Math.random() * (9 * n)));
}
export async function hashOtp(otp) { return bcrypt.hash(otp, 10); }
export async function verifyOtp(otp, hash) { return bcrypt.compare(otp, hash); }
