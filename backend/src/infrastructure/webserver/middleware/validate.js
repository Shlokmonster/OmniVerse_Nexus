export const validateAuth = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'A valid email is required.'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters long.'
    });
  }

  next();
};

export const validateTelemetry = (req, res, next) => {
  const { nodeName, health, latency } = req.body;

  if (!nodeName) {
    return res.status(400).json({
      success: false,
      error: 'nodeName is required.'
    });
  }

  if (health !== undefined && (health < 0 || health > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Health score must be between 0 and 100.'
    });
  }

  if (latency !== undefined && latency < 0) {
    return res.status(400).json({
      success: false,
      error: 'Latency must be a non-negative integer.'
    });
  }

  next();
};
