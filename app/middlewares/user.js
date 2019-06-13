const { validateUserData } = require('../validations/user'),
  { authenticationError, invalidUserError } = require('../errors'),
  { verifyToken } = require('../services/token');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return next(invalidUserError(validationErrors));
  }
  return next();
};

exports.authenticate = (req, res, next) => {
  const { token } = req.query;
  verifyToken(token, (err, payload) => {
    if (payload && payload.admin) {
      next();
    } else {
      next(authenticationError('Unauthorized'));
    }
  });
};
