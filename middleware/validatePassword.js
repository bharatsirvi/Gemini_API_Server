const validatePassword = (API_PASSWORD) => (req, res, next) => {
  const password = req.headers['x-api-password'] || req.body.password;
  if (!password) {
    return res.status(401).json({
      success: false,
      error: 'API password is required',
      message: 'Please provide password in x-api-password header or password field'
    });
  }
  if (password !== API_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API password',
      message: 'The provided password is incorrect'
    });
  }
  next();
};

export default validatePassword;
