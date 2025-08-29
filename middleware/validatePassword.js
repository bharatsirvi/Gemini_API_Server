const validatePassword = (API_PASSWORD) => (req, res, next) => {
  console.log('🔐 Validating password for endpoint:', req.path);
  const password = req.headers['x-api-password'] || req.body.password;
  if (!password) {
    console.log('❌ No password provided in request');
    return res.status(401).json({
      success: false,
      error: 'API password is required',
      message: 'Please provide password in x-api-password header or password field'
    });
  }
  if (password !== API_PASSWORD) {
    console.log('❌ Invalid password provided');
    return res.status(401).json({
      success: false,
      error: 'Invalid API password',
      message: 'The provided password is incorrect'
    });
  }
  console.log('✅ Password validation successful');
  next();
};

export default validatePassword;
