const { validateUserData } = require('../utils/user'),
  { invalidUserError } = require('../errors');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return next(invalidUserError(validationErrors));
  }
  return next();
};
