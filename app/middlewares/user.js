const { validateUserData } = require('../validations/user'),
  { invalidUserError } = require('../errors');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return next(invalidUserError(validationErrors));
  }
  return next();
};
