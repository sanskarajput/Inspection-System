const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

const validateRequest = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  const errorArray = [];

  // Errors from express-validator
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      console.log(`❌ Field "${error.path}": ${error.msg} (value: ${error.value})`);
      errorArray.push({
        field: error.path,
        message: error.msg,
        value: error.value
      });
    });
  }

  // Errors from custom file validation (if any)
  if (req.fileValidationErrors && Array.isArray(req.fileValidationErrors)) {
    req.fileValidationErrors.forEach((error) => {
      console.log(`❌ File Error - Field "${error.field}": ${error.message}`);
      errorArray.push(error);
    });
  }

  if (errorArray.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: errorArray
    });
  }

  next();
});

module.exports = {
  validateRequest
};
