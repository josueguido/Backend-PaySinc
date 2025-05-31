const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten();
    return res.status(400).json({ errors });
  }

  req.body = result.data;
  next();
};

export default validateRequest;
