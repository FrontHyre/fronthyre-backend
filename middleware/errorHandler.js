function errorHandler(err, req, res, _next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'Resume file is too large. Maximum size is 5MB.',
      errors: [
        {
          field: 'resume',
          message: 'Resume must be 5MB or smaller. Please upload a smaller file.'
        }
      ],
      details: ['Resume must be 5MB or smaller. Please upload a smaller file.']
    });
  }

  if (err.code === 'DUPLICATE_EMAIL') {
    return res.status(409).json({
      success: false,
      error: 'This email is already registered.',
      errors: [
        {
          field: 'email',
          message:
            'This email address is already registered. Use a different email or contact support.'
        }
      ],
      details: ['This email address is already registered.']
    });
  }

  if (err.statusCode && err.message) {
    const errors = err.errors || undefined;
    const details =
      err.details || (errors ? errors.map((e) => e.message) : undefined);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors,
      details
    });
  }

  if (err.statusCode === 400 && err.message && err.errors) {
    return res.status(400).json({
      success: false,
      error: err.message,
      errors: err.errors,
      details: err.errors.map((e) => e.message)
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong on our side. Please try again in a moment.',
    errors: [
      {
        field: '_form',
        message: 'Something went wrong on our side. Please try again in a moment.'
      }
    ]
  });
}

module.exports = errorHandler;
