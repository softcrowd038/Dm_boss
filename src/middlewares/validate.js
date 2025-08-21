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
