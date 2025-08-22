import { body } from 'express-validator';

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    { body: req.body, params: req.params, query: req.query },
    { abortEarly: false, allowUnknown: true }
  );
  if (error) {
    return res.status(400).json({ success: false, message: "Validation error", details: error.details });
  }
  req.body = value.body || req.body;
  req.params = value.params || req.params;
  req.query = value.query || req.query;
  next();
};

export const validateRegistration = [
  body('mobile')
    .isMobilePhone('any')
    .withMessage('Please provide a valid mobile number')
    .isLength({ min: 10, max: 15 })
    .withMessage('Mobile number must be between 10-15 digits'),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2-255 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('pin')
    .optional()
    .isLength({ min: 4, max: 6 })
    .withMessage('PIN must be between 4-6 digits')
    .isNumeric()
    .withMessage('PIN must contain only numbers')
];

export const validateUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2-255 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];