import Joi from "joi";

export const adminLoginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required()
  })
});

export const adminVerifyOtpSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    sessionToken: Joi.string().trim().required(),
    otp: Joi.string().trim()
      .length(parseInt(process.env.OTP_DIGITS || "4", 10))
      .required()
  })
});

export const adminResendOtpSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    sessionToken: Joi.string().trim().required()
  })
});
